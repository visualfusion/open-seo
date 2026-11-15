import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Tag } from "lucide-react";
import { CardShell } from "@/client/components/CardShell";
import { EmptyState } from "@/client/components/EmptyState";
import { Button } from "@/client/components/ui/button";
import { QueryState } from "@/client/components/QueryState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/client/components/ui/table";
import { getDashboardEmergingQueries } from "@/serverFunctions/dashboard";
import { Freshness, DashboardInfo } from "./siteTabParts";
import { cardTableClass, moreDetailsClass } from "./cardParts";
import { useLocale } from "@/client/lib/i18n";

export function DashboardNewQueries({
  projectId,
  connected,
  siteUrl,
}: {
  projectId: string;
  connected: boolean;
  siteUrl: string | null;
}) {
  const { t } = useLocale();
  const query = useQuery({
    queryKey: ["dashboardEmergingQueries", projectId, siteUrl],
    queryFn: () => getDashboardEmergingQueries({ data: { projectId } }),
    enabled: connected,
    staleTime: 10 * 60_000,
    retry: false,
  });
  if (!connected) return null;
  return (
    <QueryState
      query={query}
      errorFallback={t("dashboard.cards.new_keywords_title")}
    >
      {(data) =>
        !data.value.connected ? null : (
          <CardShell
            title={t("dashboard.cards.new_keywords_title")}
            icon={<Tag className="size-5" />}
            titleInfo={
              <DashboardInfo label={t("dashboard.cards.new_keywords_about")}>
                <p>{t("dashboard.cards.new_keywords_desc")}</p>
                <p className="mt-2">
                  {t("dashboard.cards.new_keywords_detail")}
                </p>
              </DashboardInfo>
            }
            action={
              <Link
                to="/p/$projectId"
                params={{ projectId }}
                search={{ tab: "keywords" }}
                className={moreDetailsClass}
                aria-label={t("dashboard.cards.view_all")}
              >
                {t("dashboard.cards.view_all")}
              </Link>
            }
          >
            <Freshness {...data} />
            {data.value.rows.length ? (
              <Table className={cardTableClass}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dashboard.cards.keyword")}</TableHead>
                    <TableHead className="text-right">
                      {t("dashboard.cards.impressions")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("dashboard.cards.clicks")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.value.rows.slice(0, 5).map((row) => (
                    <TableRow key={row.query}>
                      <TableCell className="font-medium">{row.query}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.impressions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.clicks.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                variant="plain"
                icon={Search}
                title={
                  data.value.hasSearchData
                    ? t("dashboard.cards.no_new_keywords")
                    : t("dashboard.cards.no_search_data")
                }
                description={
                  data.value.hasSearchData
                    ? t("dashboard.cards.existing_queries_note")
                    : t("dashboard.cards.no_search_reported")
                }
                action={
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link
                        to="/p/$projectId/search-performance"
                        params={{ projectId }}
                      />
                    }
                  >
                    {t("dashboard.cards.view_full_gsc")}
                  </Button>
                }
              />
            )}
          </CardShell>
        )
      }
    </QueryState>
  );
}
