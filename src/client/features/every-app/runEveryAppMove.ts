import { getTranslation } from "@/client/lib/i18n";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import {
  finishEveryAppMove,
  sendEveryAppMoveChat,
  sendEveryAppMoveFiles,
  sendEveryAppMoveRows,
  startEveryAppMove,
} from "@/serverFunctions/everyAppTransfer";
import {
  parseTransferCode,
  TransferProblem,
} from "@/shared/every-app-transfer";

// Runs a move to Every App from the Move to Every App dialog, one step at a
// time, and says why it stopped when it does.

export enum MovePhase {
  Data = "data",
  Chats = "chats",
  Files = "files",
}

export type MoveState =
  | { status: "idle" }
  | { status: "moving"; phase: MovePhase; done: number; total: number }
  | { status: "done"; origin: string }
  | { status: "failed"; message: string };

type MoveFailure = { problem: TransferProblem };

class MoveStoppedError extends Error {
  constructor(readonly failure: MoveFailure) {
    super(failure.problem);
  }
}

function problemMessage({ problem }: MoveFailure) {
  switch (problem) {
    case TransferProblem.InvalidCode:
      return getTranslation("settings.that_isn_t_a_transfer_code_copy");
    case TransferProblem.CodeRejected:
      return getTranslation("settings.this_code_expired_was_used_or_was");
    case TransferProblem.VersionMismatch:
      return getTranslation(
        "settings.this_install_and_your_gateway_run_different",
      );
    case TransferProblem.RunningWork:
      return getTranslation("settings.an_audit_or_check_is_still_running");
    case TransferProblem.MultipleOrganizations:
      return getTranslation(
        "settings.this_install_has_more_than_one_organization",
      );
    case TransferProblem.Unreachable:
      return getTranslation("settings.couldn_t_reach_openseo_on_your_gateway");
  }
}

type MoveResult<T> =
  | { ok: true; value: T }
  | { ok: false; problem: TransferProblem };

function unwrap<T>(result: MoveResult<T>): T {
  if (!result.ok) throw new MoveStoppedError(result);
  return result.value;
}

// Sends the move one step at a time. Every step is safe to repeat, so
// Try again starts over.
export async function runMove(
  code: string,
  setState: (state: MoveState) => void,
  stopped: { current: boolean },
) {
  try {
    setState({ status: "moving", phase: MovePhase.Data, done: 0, total: 0 });
    const { tables, chats } = unwrap(
      await startEveryAppMove({ data: { code } }),
    );
    const total = tables.reduce((sum, entry) => sum + entry.rows, 0);
    let done = 0;
    for (const { table } of tables) {
      let after = 0;
      let tableDone = false;
      while (!tableDone) {
        if (stopped.current) return;
        const result = unwrap(
          await sendEveryAppMoveRows({ data: { code, table, after } }),
        );
        done += result.sent;
        after = result.after;
        tableDone = result.done;
        setState({ status: "moving", phase: MovePhase.Data, done, total });
      }
    }
    for (let index = 0; index < chats; index += 1) {
      if (stopped.current) return;
      setState({
        status: "moving",
        phase: MovePhase.Chats,
        done: index,
        total: chats,
      });
      unwrap(await sendEveryAppMoveChat({ data: { code, index } }));
    }
    let cursor: string | null = null;
    let files = 0;
    do {
      if (stopped.current) return;
      setState({
        status: "moving",
        phase: MovePhase.Files,
        done: files,
        total: 0,
      });
      const result: { sent: number; cursor: string | null } = unwrap(
        await sendEveryAppMoveFiles({ data: { code, cursor } }),
      );
      files += result.sent;
      cursor = result.cursor;
    } while (cursor);
    unwrap(await finishEveryAppMove({ data: { code } }));
    setState({ status: "done", origin: parseTransferCode(code)?.origin ?? "" });
  } catch (error) {
    if (stopped.current) return;
    setState({
      status: "failed",
      message:
        error instanceof MoveStoppedError
          ? problemMessage(error.failure)
          : getStandardErrorMessage(error),
    });
  }
}
