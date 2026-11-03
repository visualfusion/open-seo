import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/client/components/ui/button";
import { AuthPageCard, AuthPageShell } from "@/client/features/auth/AuthPage";
import { googleAuthErrorCopy } from "@/client/features/integrations/googleAuthErrorCopy";
import { useLocale } from "@/client/lib/i18n";

const authErrorSearchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/auth-error")({
  validateSearch: authErrorSearchSchema,
  component: AuthErrorPage,
});

function AuthErrorPage() {
  const { t } = useLocale();
  const { error } = Route.useSearch();
  const copy = googleAuthErrorCopy(error ?? "unknown");

  return (
    <AuthPageShell>
      <AuthPageCard
        title={copy.title}
        helperText={copy.description}
        footer={
          error ? (
            <p className="font-mono text-xs text-muted-foreground">
              {t("auth.auth_error.code_label", { error })}
            </p>
          ) : undefined
        }
      >
        <Button
          nativeButton={false}
          render={<Link to="/" />}
          variant="secondary"
          className="w-full"
        >
          {t("auth.auth_error.back_to_openseo")}
        </Button>
      </AuthPageCard>
    </AuthPageShell>
  );
}
