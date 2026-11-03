import { useQuery } from "@tanstack/react-query";
import { BackLink, PageHeader } from "@/client/components/PageHeader";
import { useLocale } from "@/client/lib/i18n";
import { projectsQueryOptions } from "./projectQueries";

export function ProjectPageHeader({
  projectId,
  title,
  showBackLink = false,
}: {
  projectId: string;
  title: string;
  showBackLink?: boolean;
}) {
  const { t } = useLocale();
  const projectsQuery = useQuery(projectsQueryOptions());
  const project = projectsQuery.data?.find((entry) => entry.id === projectId);

  return (
    <PageHeader
      title={title}
      description={project?.name ?? " "}
      backLink={
        showBackLink ? (
          <BackLink to="/projects">{t("projects.manage.title")}</BackLink>
        ) : undefined
      }
    />
  );
}
