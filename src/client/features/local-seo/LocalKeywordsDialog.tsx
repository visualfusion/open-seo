import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormDialog } from "@/client/components/FormDialog";
import {
  cleanKeywords,
  KeywordFields,
} from "@/client/components/KeywordFields";
import {
  MAX_LOCAL_KEYWORD_LENGTH,
  MAX_LOCAL_KEYWORDS,
} from "@/types/schemas/local-seo";
import { useAppForm } from "@/client/components/form/useAppForm";
import { QueryError } from "@/client/components/QueryState";
import { Button } from "@/client/components/ui/button";
import { updateLocalKeywords } from "@/serverFunctions/local-seo";
import { useLocale } from "@/client/lib/i18n";

export function LocalKeywordsDialog({
  projectId,
  trackerId,
  keywords,
  onClose,
}: {
  projectId: string;
  trackerId: string;
  keywords: { keyword: string }[];
  onClose: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: (terms: string[]) =>
      updateLocalKeywords({ data: { projectId, trackerId, keywords: terms } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["localSeo", projectId],
      });
      onClose();
    },
  });
  const form = useAppForm({
    defaultValues: {
      keywords: keywords.length ? keywords.map((row) => row.keyword) : [""],
    },
    onSubmit: async ({ value }) => {
      await save.mutateAsync(cleanKeywords(value.keywords));
    },
  });
  return (
    <FormDialog
      title={t("local_seo.keywords_dialog.title")}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" disabled={save.isPending} onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" form="local-keywords" pending={save.isPending}>
            {t("local_seo.keywords_dialog.save")}
          </Button>
        </>
      }
    >
      <form.AppForm>
        <form.Form id="local-keywords" className="space-y-4">
          <form.Field name="keywords">
            {(field) => (
              <KeywordFields
                label={t("local_seo.keywords_to_track")}
                placeholder={t("local_seo.e_g_pizza_delivery")}
                max={MAX_LOCAL_KEYWORDS}
                maxLength={MAX_LOCAL_KEYWORD_LENGTH}
                value={field.state.value}
                onChange={field.handleChange}
                description={t("local_seo.keywords_dialog.field_description")}
              />
            )}
          </form.Field>
        </form.Form>
      </form.AppForm>
      {save.isError && (
        <QueryError
          error={save.error}
          fallback={t("local_seo.keywords_dialog.error_fallback")}
        />
      )}
    </FormDialog>
  );
}
