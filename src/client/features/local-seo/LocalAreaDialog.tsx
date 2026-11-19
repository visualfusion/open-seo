import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormDialog } from "@/client/components/FormDialog";
import { useAppForm } from "@/client/components/form/useAppForm";
import { QueryError } from "@/client/components/QueryState";
import { Button } from "@/client/components/ui/button";
import { useLocale } from "@/client/lib/i18n";
import { updateLocalArea } from "@/serverFunctions/local-seo";
import { LocalCenterField } from "./LocalCenterField";
import type { LocalCenter } from "./LocalCenterMap";
import {
  localAreaItems,
  LOCAL_AREAS,
  localAreaOf,
  type LocalArea,
} from "./localAreas";

export function LocalAreaDialog({
  projectId,
  tracker,
  onClose,
}: {
  projectId: string;
  tracker: {
    id: string;
    gridSize: number;
    spacingKm: number;
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const current = {
    area: localAreaOf(tracker),
    center: { latitude: tracker.latitude, longitude: tracker.longitude },
  };
  const save = useMutation({
    mutationFn: (value: { area: LocalArea; center: LocalCenter }) =>
      updateLocalArea({
        data: {
          projectId,
          trackerId: tracker.id,
          gridSize: LOCAL_AREAS[value.area].gridSize,
          spacingKm: LOCAL_AREAS[value.area].spacingKm,
          ...value.center,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["localSeo", projectId],
      });
      onClose();
    },
  });
  const form = useAppForm({
    defaultValues: current,
    onSubmit: async ({ value }) => {
      // Save is disabled until an area is picked.
      if (value.area) await save.mutateAsync({ ...value, area: value.area });
    },
  });
  return (
    <FormDialog
      title={t("local_seo.change_area")}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" disabled={save.isPending} onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <form.Subscribe
            selector={(state) => !state.values.area || state.isDefaultValue}
          >
            {(disabled) => (
              <Button
                type="submit"
                form="local-area"
                pending={save.isPending}
                disabled={disabled}
              >
                {t("local_seo.save_area")}
              </Button>
            )}
          </form.Subscribe>
        </>
      }
    >
      <form.AppForm>
        <form.Form id="local-area" className="space-y-4">
          <form.AppField name="area">
            {(field) => (
              <field.SelectField
                label={t("local_seo.area_to_check")}
                description={t("local_seo.change_area_desc")}
                items={localAreaItems(t)}
              />
            )}
          </form.AppField>
          <form.Subscribe selector={(state) => state.values.area}>
            {(area) => (
              <form.Field name="center">
                {(field) => (
                  <LocalCenterField
                    projectId={projectId}
                    center={field.state.value}
                    // A grid saved before areas existed shows as it is until
                    // an area is picked.
                    grid={area ? LOCAL_AREAS[area] : tracker}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            )}
          </form.Subscribe>
        </form.Form>
      </form.AppForm>
      {save.isError && (
        <QueryError
          error={save.error}
          fallback={t("local_seo.save_area_failed")}
        />
      )}
    </FormDialog>
  );
}
