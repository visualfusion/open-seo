import { useLocale } from "@/client/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { SectionHeader } from "@/client/components/PageHeader";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Progress } from "@/client/components/ui/progress";
import { organizationContextQueryOptions } from "@/client/features/team/organizationQueries";
import { CommandBlock } from "@/client/features/help/SecretHelpPage";
import { Step } from "@/client/features/every-app/Step";
import { hasOrgPermission } from "@/lib/org-permissions";
import {
  MovePhase,
  runMove,
  type MoveState,
} from "@/client/features/every-app/runEveryAppMove";
import { parseTransferCode } from "@/shared/every-app-transfer";

enum GatewayPath {
  SetUp = "set-up",
  Existing = "existing",
}

/** Settings → Move to Every App, on self-hosted installs, for owners. */
export function MoveToEveryAppSettings() {
  const { t } = useLocale();
  const { data: organization } = useQuery(organizationContextQueryOptions());
  const [open, setOpen] = useState(false);
  if (
    !organization ||
    !hasOrgPermission(organization.role, { organization: ["delete"] })
  ) {
    return null;
  }
  return (
    <section className="space-y-3">
      <SectionHeader title="Every App" />
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm">{t("settings.move_to_every_app")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.get_team_sign_in_and_all_your")}{" "}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="https://everyapp.com/docs/apps/openseo"
              target="_blank"
              rel="noreferrer"
            >
              {t("settings.about_every_app")}
            </a>
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          {t("settings.move_to_every_app")}
        </Button>
      </div>
      {open ? <MoveDialog onClose={() => setOpen(false)} /> : null}
    </section>
  );
}

function MoveDialog({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();
  const [path, setPath] = useState(GatewayPath.SetUp);
  const [state, setState] = useState<MoveState>({ status: "idle" });
  const stopped = useRef(false);
  const moving = state.status === "moving";

  const close = () => {
    stopped.current = true;
    onClose();
  };

  return (
    <Dialog
      open
      // A click outside or Escape mustn't stop a move halfway.
      onOpenChange={(next) => {
        if (!next && !moving) close();
      }}
    >
      <DialogContent className="grid-cols-1 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("settings.move_to_every_app")}</DialogTitle>
          <DialogDescription>
            {t("settings.copies_your_projects_and_their_history_to")}
          </DialogDescription>
        </DialogHeader>
        {state.status === "moving" ? (
          <MoveProgress state={state} />
        ) : state.status === "done" ? (
          <MoveDone origin={state.origin} />
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {t("settings.do_you_already_have_an_every_app")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  aria-pressed={path === GatewayPath.SetUp}
                  className="aria-pressed:border-primary aria-pressed:bg-primary/10"
                  onClick={() => setPath(GatewayPath.SetUp)}
                >
                  {t("settings.set_up_my_gateway")}
                </Button>
                <Button
                  variant="outline"
                  aria-pressed={path === GatewayPath.Existing}
                  className="aria-pressed:border-primary aria-pressed:bg-primary/10"
                  onClick={() => setPath(GatewayPath.Existing)}
                >
                  {t("settings.i_have_a_gateway")}
                </Button>
              </div>
            </div>
            {path === GatewayPath.SetUp ? (
              <GatewaySetupSteps
                onReady={() => setPath(GatewayPath.Existing)}
              />
            ) : (
              <MoveSteps
                failure={state.status === "failed" ? state.message : null}
                onMove={(code) => {
                  stopped.current = false;
                  void runMove(code, setState, stopped);
                }}
              />
            )}
          </>
        )}
        <DialogFooter>
          <Button
            variant={state.status === "done" ? "default" : "ghost"}
            onClick={close}
          >
            {state.status === "done"
              ? t("settings.done")
              : moving
                ? t("settings.stop")
                : t("settings.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GatewaySetupSteps({ onReady }: { onReady: () => void }) {
  const { t } = useLocale();
  return (
    <ol className="space-y-4">
      <Step number={1} title={t("settings.get_every_app")}>
        <CommandBlock command="npm install -g everyapp@latest" />
      </Step>
      <Step number={2} title={t("settings.create_your_gateway")}>
        <CommandBlock command="everyapp setup" />
        <p className="text-sm text-muted-foreground">
          {t("settings.needs")}{" "}
          <a
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="https://dash.cloudflare.com/"
            target="_blank"
            rel="noreferrer"
          >
            Cloudflare Workers Paid
          </a>{" "}
          {t("settings.and_a_domain_on_cloudflare_dns")}
        </p>
      </Step>
      <li>
        <Button variant="outline" onClick={onReady}>
          {t("settings.my_gateway_is_ready")}
        </Button>
      </li>
    </ol>
  );
}

function MoveSteps({
  failure,
  onMove,
}: {
  failure: string | null;
  onMove: (code: string) => void;
}) {
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const codeIsValid = parseTransferCode(code) !== null;

  return (
    <ol className="space-y-4">
      <Step number={1} title={t("settings.install_openseo_on_your_gateway")}>
        <CommandBlock command="everyapp install https://github.com/every-app/open-seo" />
      </Step>
      <Step number={2} title={t("settings.make_a_transfer_code")}>
        <p className="text-sm text-muted-foreground">
          {t("settings.in_openseo_on_your_gateway_open_settings")}
        </p>
      </Step>
      <Step number={3} title={t("settings.paste_the_code_here")}>
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (codeIsValid) onMove(code);
          }}
        >
          <Label htmlFor="every-app-transfer-code" className="sr-only">
            {t("settings.transfer_code")}
          </Label>
          <Input
            id="every-app-transfer-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="https://openseo.yourdomain.com#…"
            autoComplete="off"
            spellCheck={false}
            data-ph-mask
          />
          {failure ? (
            <p className="text-sm text-destructive" role="alert">
              {failure}
            </p>
          ) : null}
          <Button type="submit" disabled={!codeIsValid}>
            {t("settings.move_my_data")}
          </Button>
        </form>
      </Step>
    </ol>
  );
}

const PHASE_LABELS: Record<MovePhase, string> = {
  [MovePhase.Data]: "settings.moving_projects_and_history",
  [MovePhase.Chats]: "settings.moving_sam_chats",
  [MovePhase.Files]: "settings.moving_audit_and_export_files",
};

function MoveProgress({
  state,
}: {
  state: Extract<MoveState, { status: "moving" }>;
}) {
  const { locale, t } = useLocale();
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium">{t(PHASE_LABELS[state.phase])}</span>
        {state.phase === MovePhase.Files ? (
          <span className="text-muted-foreground tabular-nums">
            {t("settings.count_files", {
              count: state.done.toLocaleString(
                locale === "de" ? "de-DE" : "en-US",
              ),
            })}
          </span>
        ) : null}
      </div>
      <Progress
        value={state.phase === MovePhase.Files ? null : state.done}
        max={Math.max(state.total, 1)}
      />
      <p className="text-sm text-muted-foreground">
        {t("settings.keep_this_page_open_until_it_finishes")}
      </p>
    </div>
  );
}

function MoveDone({ origin }: { origin: string }) {
  const { t } = useLocale();
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">{t("settings.your_data_is_on_every_app")}</p>
      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
        <li>{t("settings.everyone_connects_google_again_there_for_search")}</li>
        <li>{t("settings.this_install_still_runs_scheduled_checks_turn")} </li>
      </ul>
      <a
        className="inline-block font-medium text-primary underline-offset-4 hover:underline"
        href={origin}
        target="_blank"
        rel="noreferrer"
      >
        {t("settings.open_openseo_on_your_gateway")}
      </a>
    </div>
  );
}
