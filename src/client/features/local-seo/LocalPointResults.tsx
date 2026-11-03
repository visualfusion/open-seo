import type { getLocalScan } from "@/serverFunctions/local-seo";
import { EmptyState } from "@/client/components/EmptyState";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { LocalPointStatus } from "@/shared/local-seo";
import { useLocale } from "@/client/lib/i18n";
import type { LocalGridDisplayPoint } from "./LocalRankGrid";

type PointResult = Awaited<ReturnType<typeof getLocalScan>>["results"][number];

export function LocalPointResults({
  point,
  results,
  cid,
  placeId,
  gridSize,
  spacingKm,
}: {
  point: LocalGridDisplayPoint;
  results: PointResult[];
  cid: string | null;
  placeId: string | null;
  gridSize: number;
  spacingKm: number;
}) {
  const { locale, t } = useLocale();
  return (
    <Card className="h-full min-h-0 min-w-0 gap-0 overflow-hidden py-0 shadow-none">
      <CardHeader className="shrink-0 items-center gap-2 px-4 py-3">
        <CardTitle className="text-sm">
          {t("local_seo.point_results.title")}
        </CardTitle>
        <CardAction className="row-span-1 self-center text-xs text-muted-foreground">
          {searchedFrom(point, gridSize, spacingKm, t)}
        </CardAction>
      </CardHeader>
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-border">
        {point.status !== LocalPointStatus.Completed ? (
          <EmptyState
            variant="plain"
            title={
              point.status === LocalPointStatus.Pending
                ? t("local_seo.point_results.pending_title")
                : t("local_seo.point_results.failed_title")
            }
            description={
              point.status === LocalPointStatus.Pending
                ? t("local_seo.point_results.pending_desc")
                : t("local_seo.point_results.failed_desc")
            }
          />
        ) : results.length === 0 ? (
          <EmptyState
            variant="plain"
            title={t("local_seo.point_results.no_listings_title")}
            description={t("local_seo.point_results.no_listings_desc")}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("local_seo.point_results.rank")}</TableHead>
                <TableHead>{t("local_seo.point_results.business")}</TableHead>
                <TableHead>{t("local_seo.point_results.reviews")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  data-state={
                    (cid != null && result.cid === cid) ||
                    (placeId != null && result.placeId === placeId)
                      ? "selected"
                      : undefined
                  }
                >
                  <TableCell className="font-mono">{result.rank}</TableCell>
                  <TableCell>
                    <p className="font-medium">{result.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.address}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs">
                    <p>{result.rating == null ? "—" : `${result.rating} ★`}</p>
                    <p className="text-muted-foreground">
                      {result.reviews?.toLocaleString(
                        locale === "de" ? "de-DE" : "en-US",
                      ) ?? "—"}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}

/** Where a point's search ran, e.g. "Searched 2 km north, 2 km west of your listing". */
function searchedFrom(
  point: LocalGridDisplayPoint,
  gridSize: number,
  spacingKm: number,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const center = (gridSize - 1) / 2;
  const north = (center - point.row) * spacingKm;
  const east = (point.col - center) * spacingKm;
  const parts = [
    north &&
      `${Math.abs(north)} km ${north > 0 ? t("local_seo.point_results.north") : t("local_seo.point_results.south")}`,
    east &&
      `${Math.abs(east)} km ${east > 0 ? t("local_seo.point_results.east") : t("local_seo.point_results.west")}`,
  ].filter(Boolean);
  return parts.length
    ? t("local_seo.point_results.searched_relative", {
        offset: parts.join(", "),
      })
    : t("local_seo.point_results.searched_from_listing");
}
