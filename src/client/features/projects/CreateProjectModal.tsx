import { projectsQueryOptions } from "@/client/features/projects/projectQueries";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateLogic } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/client/components/form/useAppForm";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { FieldDescription } from "@/client/components/ui/field";
import {
  getLastProjectId,
  setLastProjectId,
} from "@/client/lib/active-project";
import {
  getErrorCode,
  getStandardErrorMessage,
} from "@/client/lib/error-messages";
import {
  DEFAULT_LOCATION_CODE,
  getLanguageCode,
} from "@/client/features/keywords/locations";
import { ProjectMarketFields } from "@/client/features/projects/ProjectMarketFields";
import { toastInitialAudit } from "@/client/features/projects/initialAuditToast";
import { createProject } from "@/serverFunctions/projects";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";
import { useLocale } from "@/client/lib/i18n";

export function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // A new project starts in the market of the project the user is working in.
  const projects = useQuery(projectsQueryOptions());
  const currentProject = projects.data?.find(
    (project) => project.id === getLastProjectId(),
  );

  const createProjectSchema = z.object({
    name: z.string().trim().min(1, t("projects.create.name_required")),
    domain: z.string(),
    market: z.object({ locationCode: z.number(), languageCode: z.string() }),
  });

  const serverFieldErrors: Record<string, Record<string, string>> = {
    VALIDATION_ERROR: { domain: t("projects.create.domain_validation_error") },
    CONFLICT: {
      name: t("projects.create.conflict_error"),
    },
  };

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof createProjectSchema>) =>
      createProject({
        data: {
          name: values.name.trim(),
          domain: values.domain.trim() || undefined,
          ...values.market,
        },
      }),
    // The form shows field errors inline and toasts the rest itself.
    meta: { errorToast: false },
    onSuccess: async (created) => {
      setLastProjectId(created.id);
      await queryClient.invalidateQueries({
        queryKey: projectsQueryOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: ["dashboardActivation"],
      });
      onClose();
      toast.success(t("projects.create.success"));
      toastInitialAudit(created.initialAudit);
      // Continue setup through the new project’s dashboard.
      void navigate({
        to: "/p/$projectId",
        params: { projectId: created.id },
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      domain: "",
      market: {
        locationCode: currentProject?.locationCode ?? DEFAULT_LOCATION_CODE,
        languageCode:
          currentProject?.languageCode ??
          getLanguageCode(DEFAULT_LOCATION_CODE),
      },
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: createProjectSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync(value);
      } catch (error) {
        const fields = serverFieldErrors[getErrorCode(error) ?? ""];
        if (fields) {
          formApi.setErrorMap({ onSubmit: { fields } });
        } else {
          toast.error(getStandardErrorMessage(error));
        }
      }
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !createMutation.isPending) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <form.AppForm>
          <form.Form className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{t("projects.create.title")}</DialogTitle>
            </DialogHeader>

            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  label={t("projects.create.name")}
                  placeholder={t("projects.create.name_placeholder")}
                  maxLength={120}
                  required
                />
              )}
            </form.AppField>

            <p className="text-sm text-muted-foreground">
              {isEveryAppClientAuthMode()
                ? t("projects.create.scan_notice_everyapp")
                : t("projects.create.scan_notice")}
            </p>
            <form.AppField name="domain">
              {(field) => (
                <field.TextField
                  label={
                    <>
                      {t("projects.create.domain")}{" "}
                      <span className="font-normal text-muted-foreground">
                        {t("projects.create.optional")}
                      </span>
                    </>
                  }
                  description={t("projects.create.domain_description")}
                  placeholder={t("projects.create.domain_placeholder")}
                  maxLength={255}
                />
              )}
            </form.AppField>

            <div className="flex flex-col gap-2">
              <form.Field name="market">
                {(field) => (
                  <ProjectMarketFields
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
              <FieldDescription>
                {t("projects.create.market_description")}
              </FieldDescription>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                {t("projects.create.cancel")}
              </Button>
              <form.SubmitButton>
                {t("projects.create.submit")}
              </form.SubmitButton>
            </DialogFooter>
          </form.Form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
