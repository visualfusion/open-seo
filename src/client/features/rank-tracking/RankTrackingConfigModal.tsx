import { languageLabel } from "@/client/features/keywords/locations";
import { useId, useState } from "react";
import { projectsQueryOptions } from "@/client/features/projects/projectQueries";
import { useQuery } from "@tanstack/react-query";
import { revalidateLogic, useStore } from "@tanstack/react-form";
import { Info } from "lucide-react";
import { useAppForm } from "@/client/components/form/useAppForm";
import { CountryCombobox } from "@/client/components/CountryCombobox";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Field, FieldLabel } from "@/client/components/ui/field";
import type { RankTrackingConfig } from "@/types/schemas/rank-tracking";
import { domainField, normalizeDomain } from "@/types/schemas/domain";
import {
  estimateRankCheckCredits,
  pagesToDepth,
  RANK_CHECK_DURATION_COPY,
} from "@/shared/rank-tracking";
import { getLanguageCode } from "@/client/features/keywords/locations";
import {
  SERP_LANGUAGE_OPTIONS,
  getIsoCountryCode,
} from "@/shared/keyword-locations";
import type { ProjectMarket } from "@/client/features/projects/types";
import { QueryError } from "@/client/components/QueryState";
import { Spinner } from "@/client/components/Spinner";
import { getFieldError } from "@/client/lib/forms";
import { getTranslation, useLocale } from "@/client/lib/i18n";
import { SearchTargetingField } from "./SearchTargetingField";
import { KeywordSuggestionStep } from "./KeywordSuggestionStep";
import {
  useSaveConfigMutations,
  type SaveConfigInput,
} from "./useSaveConfigMutations";
import { ScheduleField } from "./ScheduleField";
import {
  localScheduleTimeFrom,
  randomScheduleDate,
  withBrowserTimeZone,
  type LocalScheduleTime,
} from "./scheduleTime";
import { parseDbTimestamp } from "@/client/lib/db-timestamp";

type Props = {
  projectId: string;
  existingConfig?: RankTrackingConfig | null;
  onClose: () => void;
  onSaved: (createdConfigId?: string) => void;
  onConfigCreated?: () => void;
};

type ConfigFormValues = Omit<SaveConfigInput, "scheduleTime"> & {
  scheduleTime: LocalScheduleTime;
};

function validateConfig(values: ConfigFormValues) {
  const fields: Partial<Record<keyof ConfigFormValues, string>> = {};
  if (!values.domain.trim()) {
    fields.domain = getTranslation("ranks.modals.domain_required");
  } else if (!domainField.safeParse(values.domain).success) {
    fields.domain = getTranslation("ranks.modals.domain_invalid");
  }
  if (values.targetingMode === "local" && !values.locationName) {
    fields.locationName = getTranslation("ranks.modals.city_required");
  }
  return Object.keys(fields).length > 0 ? { fields } : undefined;
}

export function RankTrackingConfigModal(props: Props) {
  const { t } = useLocale();
  const { projectId, existingConfig, onClose } = props;
  const projectsQuery = useQuery({
    ...projectsQueryOptions(),
    enabled: !existingConfig,
  });
  const initialMarket =
    existingConfig ??
    projectsQuery.data?.find((project) => project.id === projectId);

  if (!initialMarket) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {t("ranks.modals.config_title_add")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex min-h-40 items-center justify-center">
            {projectsQuery.isPending ? (
              <Spinner />
            ) : (
              <QueryError
                error={projectsQuery.error}
                fallback={t("ranks.modals.failed_load_project")}
                onRetry={() => void projectsQuery.refetch()}
                isRetrying={projectsQuery.isFetching}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <RankTrackingConfigModalContent {...props} initialMarket={initialMarket} />
  );
}

function RankTrackingConfigModalContent({
  projectId,
  existingConfig,
  initialMarket,
  onClose,
  onSaved,
  onConfigCreated,
}: Props & { initialMarket: ProjectMarket }) {
  const { t } = useLocale();
  const countryId = useId();
  const languageItems = SERP_LANGUAGE_OPTIONS.map((language) => ({
    value: language.code,
    label: languageLabel(language.code),
  }));
  const isEdit = !!existingConfig;
  const [createdConfigId, setCreatedConfigId] = useState<string>();
  const [scheduleTimeEdited, setScheduleTimeEdited] = useState(false);

  const deviceItems: { value: SaveConfigInput["devices"]; label: string }[] = [
    { value: "both", label: t("ranks.modals.devices_both") },
    { value: "desktop", label: t("ranks.modals.devices_desktop") },
    { value: "mobile", label: t("ranks.modals.devices_mobile") },
  ];

  const depthItems = Array.from({ length: 10 }, (_, i) => i + 1).map(
    (pages) => ({
      value: pagesToDepth(pages),
      label:
        pages === 1
          ? t("ranks.modals.depth_page_one")
          : t("ranks.modals.depth_pages", { pages, results: pages * 10 }),
    }),
  );

  const { createMutation, updateMutation } = useSaveConfigMutations({
    projectId,
    existingConfig,
    onCreated: (configId) => {
      setCreatedConfigId(configId);
      onConfigCreated?.();
    },
    onUpdated: () => onSaved(),
  });

  const [defaultValues] = useState<ConfigFormValues>(() => ({
    domain: existingConfig?.domain ?? "",
    locationCode: existingConfig?.locationCode ?? initialMarket.locationCode,
    languageCode: existingConfig?.languageCode ?? initialMarket.languageCode,
    targetingMode: existingConfig?.locationName ? "local" : "national",
    locationName: existingConfig?.locationName ?? undefined,
    devices: existingConfig?.devices ?? "mobile",
    schedule: existingConfig?.scheduleInterval ?? "weekly",
    scheduleTime: localScheduleTimeFrom(
      existingConfig?.nextCheckAt
        ? parseDbTimestamp(existingConfig.nextCheckAt)
        : randomScheduleDate(),
    ),
    serpDepth: existingConfig?.serpDepth ?? 40,
  }));

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: ({ value }) => validateConfig(value) },
    onSubmit: async ({ value, formApi }) => {
      const domain = domainField.parse(value.domain);
      formApi.setFieldValue("domain", domain);
      const sendScheduleTime =
        value.schedule !== "manual" &&
        (!existingConfig ||
          scheduleTimeEdited ||
          value.schedule !== existingConfig.scheduleInterval);
      const input: SaveConfigInput = {
        ...value,
        domain,
        scheduleTime: sendScheduleTime
          ? withBrowserTimeZone(value.scheduleTime)
          : undefined,
      };
      await (isEdit
        ? updateMutation.mutateAsync(input)
        : createMutation.mutateAsync(input));
    },
  });
  const values = useStore(form.store, (state) => state.values);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const closeKeywordStep = () => onSaved(createdConfigId);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (open || isSubmitting) return;
        if (createdConfigId) closeKeywordStep();
        else onClose();
      }}
    >
      <DialogContent
        showCloseButton={!!createdConfigId}
        className={createdConfigId ? "sm:max-w-3xl" : "sm:max-w-lg"}
      >
        {createdConfigId ? (
          <KeywordSuggestionStep
            configId={createdConfigId}
            projectId={projectId}
            domain={values.domain}
            locationCode={values.locationCode}
            onDone={onSaved}
            onClose={closeKeywordStep}
          />
        ) : (
          <form.AppForm>
            <form.Form className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>
                  {isEdit
                    ? t("ranks.modals.config_title_edit")
                    : t("ranks.modals.config_title_add")}
                </DialogTitle>
              </DialogHeader>

              <form.AppField
                name="domain"
                listeners={{
                  onBlur: ({ value }) => {
                    try {
                      form.setFieldValue("domain", normalizeDomain(value), {
                        dontValidate: true,
                      });
                    } catch {
                      // Keep invalid partial input editable
                    }
                  },
                }}
              >
                {(field) => (
                  <field.TextField
                    label={t("ranks.modals.domain_label")}
                    placeholder={t("ranks.modals.domain_placeholder")}
                  />
                )}
              </form.AppField>

              <Field>
                <FieldLabel htmlFor={countryId}>
                  {t("ranks.modals.country_label")}
                </FieldLabel>
                <CountryCombobox
                  id={countryId}
                  value={values.locationCode}
                  onChange={(locationCode) => {
                    form.setFieldValue("locationCode", locationCode);
                    form.setFieldValue(
                      "languageCode",
                      getLanguageCode(locationCode),
                    );
                    form.setFieldValue("locationName", undefined);
                  }}
                />
              </Field>

              <form.Field name="locationName">
                {(field) => (
                  <SearchTargetingField
                    mode={values.targetingMode}
                    onModeChange={(mode) =>
                      form.setFieldValue("targetingMode", mode)
                    }
                    locationName={field.state.value}
                    onLocationNameChange={field.handleChange}
                    countryCode={getIsoCountryCode(values.locationCode)}
                    error={getFieldError(field.state.meta.errors) ?? undefined}
                  />
                )}
              </form.Field>

              <form.AppField name="languageCode">
                {(field) => (
                  <field.SelectField
                    label={t("ranks.modals.language_label")}
                    items={languageItems}
                    description={t("ranks.modals.language_desc")}
                  />
                )}
              </form.AppField>

              <div className="flex flex-col gap-1.5">
                <form.AppField name="devices">
                  {(field) => (
                    <field.SelectField
                      label={t("ranks.modals.devices_label")}
                      items={deviceItems}
                      description={t("ranks.modals.devices_desc")}
                    />
                  )}
                </form.AppField>
                {values.devices === "both" && (
                  <p className="flex items-start gap-1.5 text-xs text-info">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    {t("ranks.modals.devices_both_warning")}
                  </p>
                )}
              </div>

              <ScheduleField
                schedule={values.schedule}
                onScheduleChange={(schedule) =>
                  form.setFieldValue("schedule", schedule)
                }
                scheduleTime={values.scheduleTime}
                onScheduleTimeChange={(time) => {
                  form.setFieldValue("scheduleTime", time);
                  setScheduleTimeEdited(true);
                }}
              />

              <form.AppField name="serpDepth">
                {(field) => (
                  <field.SelectField
                    label={t("ranks.modals.depth_label")}
                    items={depthItems}
                    description={t("ranks.modals.depth_desc")}
                  />
                )}
              </form.AppField>

              <CostEstimate
                devices={values.devices}
                serpDepth={values.serpDepth}
                schedule={values.schedule}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <form.SubmitButton>
                  {isEdit
                    ? t("ranks.modals.save_changes")
                    : t("ranks.modals.config_title_add")}
                </form.SubmitButton>
              </DialogFooter>
            </form.Form>
          </form.AppForm>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CostEstimate({
  devices,
  serpDepth,
  schedule,
}: Pick<ConfigFormValues, "devices" | "serpDepth" | "schedule">) {
  const { t } = useLocale();
  const { costUsd: costPerKeyword } = estimateRankCheckCredits(
    ["plain keyword"],
    devices,
    serpDepth,
  );
  const checksPerMonth =
    schedule === "daily" ? 30 : schedule === "weekly" ? 4 : 1;
  return (
    <div className="space-y-0.5 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
      <div>
        <span className="font-mono font-semibold text-foreground">
          {t("ranks.modals.cost_per_keyword", {
            cost: costPerKeyword.toFixed(4),
          })}
        </span>{" "}
        {t("ranks.modals.cost_per_keyword_suffix")}
      </div>
      <div>{RANK_CHECK_DURATION_COPY}</div>
      {schedule !== "manual" && (
        <div>
          {t("ranks.modals.cost_monthly_prefix")}
          <span className="font-mono font-semibold text-foreground">
            ${(costPerKeyword * 50 * checksPerMonth).toFixed(2)}
          </span>
          {t("ranks.modals.cost_monthly_suffix")}
        </div>
      )}
    </div>
  );
}
