import { lazy, Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/client/components/form/useAppForm";
import { FormDialog } from "@/client/components/FormDialog";
import { Button } from "@/client/components/ui/button";
import { Skeleton } from "@/client/components/ui/skeleton";
import { QueryError } from "@/client/components/QueryState";
import {
  createLocalTracker,
  lookupLocalBusiness,
} from "@/serverFunctions/local-seo";
import { SerpLocationCombobox } from "@/client/components/SerpLocationCombobox";
import { usePrewarmSerpLocations } from "@/client/components/usePrewarmSerpLocations";
import { Field, FieldError, FieldLabel } from "@/client/components/ui/field";
import { useProjectMarket } from "@/client/features/projects/useProjectMarket";
import { getIsoCountryCode } from "@/shared/keyword-locations";
import { useLocale } from "@/client/lib/i18n";
import { cleanKeywords, LocalKeywordFields } from "./LocalKeywordFields";
import { LocalListingChoices, type Listing } from "./LocalListingChoices";

const ListingMap = lazy(() => import("./LocalListingMap"));

export function LocalTrackerDialog({
  projectId,
  onClose,
  onCreated,
}: {
  projectId: string;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  return listing ? (
    <TrackerSettings
      projectId={projectId}
      listing={listing}
      onClose={onClose}
      onCreated={onCreated}
    />
  ) : (
    <ListingLookup
      projectId={projectId}
      onClose={onClose}
      onSelect={setListing}
    />
  );
}

function ListingLookup({
  projectId,
  onClose,
  onSelect,
}: {
  projectId: string;
  onClose: () => void;
  onSelect: (listing: Listing) => void;
}) {
  const { t } = useLocale();
  const market = useProjectMarket(projectId);
  const countryCode = market ? getIsoCountryCode(market.locationCode) : "us";
  usePrewarmSerpLocations(countryCode, Boolean(market));
  const [selected, setSelected] = useState(0);
  const lookup = useMutation({
    mutationFn: (data: { query: string; locationName: string }) =>
      lookupLocalBusiness({ data: { projectId, ...data } }),
    // A single match needs no picking, so setup opens straight away.
    onSuccess: (found) => {
      setSelected(0);
      if (found.length === 1) onSelect(found[0]);
    },
  });
  const form = useAppForm({
    defaultValues: { query: "", locationName: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        query: z
          .string()
          .trim()
          .min(2, t("local_seo.validation_business_name"))
          .max(200),
        locationName: z.string().min(1, t("local_seo.validation_city")),
      }),
    },
    onSubmit: async ({ value }) => {
      await lookup.mutateAsync(value);
    },
  });
  const listings = lookup.data && lookup.data.length > 1 ? lookup.data : null;
  return (
    <FormDialog
      title={t("local_seo.add_business_title")}
      onClose={onClose}
      wide={Boolean(listings)}
      actions={
        listings ? (
          <>
            <Button variant="outline" onClick={() => lookup.reset()}>
              {t("local_seo.search_again")}
            </Button>
            <Button onClick={() => onSelect(listings[selected])}>
              {t("local_seo.use_this_listing")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              form="local-business-lookup"
              pending={lookup.isPending}
            >
              {t("local_seo.find_listing")}
            </Button>
          </>
        )
      }
    >
      {listings ? (
        <div className="grid gap-4 md:grid-cols-2">
          <LocalListingChoices
            listings={listings}
            selected={selected}
            onSelectedChange={setSelected}
          />
          <div className="min-h-80 overflow-hidden rounded-lg border border-border">
            <Suspense fallback={<Skeleton className="h-full rounded-none" />}>
              <ListingMap
                projectId={projectId}
                listings={listings}
                selected={selected}
                onSelectedChange={setSelected}
              />
            </Suspense>
          </div>
        </div>
      ) : (
        <form.AppForm>
          <form.Form id="local-business-lookup" className="space-y-4">
            <form.AppField name="query">
              {(field) => (
                <field.TextField
                  label={t("local_seo.business_name")}
                  placeholder={t("local_seo.business_name_placeholder")}
                />
              )}
            </form.AppField>
            <form.Field name="locationName">
              {(field) => {
                const error = field.state.meta.errors[0]?.message;
                return (
                  <Field data-invalid={Boolean(error) || undefined}>
                    <FieldLabel htmlFor="local-business-city">
                      {t("local_seo.city")}
                    </FieldLabel>
                    <SerpLocationCombobox
                      id="local-business-city"
                      value={field.state.value || undefined}
                      onChange={(value) => field.handleChange(value ?? "")}
                      countryCode={countryCode}
                      invalid={Boolean(error)}
                    />
                    {error ? <FieldError>{error}</FieldError> : null}
                  </Field>
                );
              }}
            </form.Field>
          </form.Form>
        </form.AppForm>
      )}
      {lookup.isPending && (
        <p className="text-sm text-muted-foreground">
          {t("local_seo.searching_maps")}
        </p>
      )}
      {lookup.isError && (
        <QueryError
          title={t("local_seo.lookup_error_title")}
          cause={lookup.error}
          fallback={t("local_seo.lookup_error_fallback")}
        />
      )}
      {lookup.isSuccess && lookup.data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t("local_seo.no_listing_found")}
        </p>
      )}
    </FormDialog>
  );
}

// Grid size and spacing as the area a customer would recognize. The width is
// (gridSize - 1) × spacing, and each point is one paid search per keyword.
const AREAS = {
  neighborhood: {
    key: "area_neighborhood",
    gridSize: 3,
    spacingKm: 1,
  },
  town: { key: "area_town", gridSize: 3, spacingKm: 2 },
  city: { key: "area_city", gridSize: 5, spacingKm: 2 },
  metro: {
    key: "area_metro",
    gridSize: 5,
    spacingKm: 5,
  },
} as const;
type Area = keyof typeof AREAS;

function TrackerSettings({
  projectId,
  listing,
  onClose,
  onCreated,
}: {
  projectId: string;
  listing: Listing;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { t } = useLocale();
  const { business, suggestedKeywords } = listing;
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (input: Parameters<typeof createLocalTracker>[0]["data"]) =>
      createLocalTracker({ data: input }),
    onSuccess: (tracker) => {
      void queryClient.invalidateQueries({ queryKey: ["localSeo", projectId] });
      onCreated(tracker.id);
    },
  });
  const form = useAppForm({
    defaultValues: {
      keywords: suggestedKeywords.length ? suggestedKeywords : [""],
      area: "town" as Area,
    },
    onSubmit: async ({ value }) => {
      const area = AREAS[value.area];
      await create.mutateAsync({
        projectId,
        business,
        keywords: cleanKeywords(value.keywords),
        gridSize: area.gridSize,
        spacingKm: area.spacingKm,
      });
    },
  });
  return (
    <FormDialog
      title={t("local_seo.setup_tracking_title")}
      onClose={onClose}
      actions={
        <>
          <Button
            variant="outline"
            disabled={create.isPending}
            onClick={onClose}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            form="local-tracker-settings"
            pending={create.isPending}
          >
            {t("local_seo.save_business")}
          </Button>
        </>
      }
    >
      <div>
        <p className="text-sm font-medium">{business.title}</p>
        <p className="text-sm text-muted-foreground">{business.address}</p>
      </div>
      <form.AppForm>
        <form.Form id="local-tracker-settings" className="space-y-4">
          <form.Field name="keywords">
            {(field) => (
              <LocalKeywordFields
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.AppField name="area">
            {(field) => (
              <field.SelectField
                label={t("local_seo.area_to_check")}
                description={t("local_seo.area_to_check_desc")}
                items={Object.entries(AREAS).map(([value, { key }]) => ({
                  value,
                  label: t(`local_seo.${key}`),
                }))}
              />
            )}
          </form.AppField>
        </form.Form>
      </form.AppForm>
      {create.isError && (
        <QueryError
          error={create.error}
          fallback={t("local_seo.could_not_save_business")}
        />
      )}
    </FormDialog>
  );
}
