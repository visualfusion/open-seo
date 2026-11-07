import { createFileRoute } from "@tanstack/react-router";
import { CopyButton } from "@/client/components/CopyButton";
import { PageHeader } from "@/client/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { useLocale } from "@/client/lib/i18n";
import { SUPPORT_EMAIL } from "@/client/lib/support";
import { pageHead } from "@/client/lib/pageHead";

const DISCORD_URL = "https://discord.gg/c9uGs3cFXr";
const GITHUB_URL = "https://github.com/every-app/open-seo";

export const Route = createFileRoute("/_app/support")({
  head: () => pageHead("Help & Community"),
  component: SupportPage,
});

function SupportPage() {
  const { t } = useLocale();
  return (
    <div className="h-full overflow-auto px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {t("sam.support.eyebrow")}
          </p>
          <PageHeader
            title={t("sam.support.title")}
            description={t("sam.support.description")}
          />
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>{t("sam.support.email_title")}</h2>
              </CardTitle>
              <CardDescription>{t("sam.support.email_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <CopyButton
                value={SUPPORT_EMAIL}
                label={SUPPORT_EMAIL}
                successMessage={t("sam.support.email_copied")}
                size="sm"
              />
            </CardContent>
          </Card>

          <SupportLinkCard
            href={DISCORD_URL}
            title={t("sam.support.discord_title")}
            description={t("sam.support.discord_desc")}
            cta={t("sam.support.discord_cta")}
          />

          <SupportLinkCard
            href={`${GITHUB_URL}/issues`}
            title={t("sam.support.github_title")}
            description={t("sam.support.github_desc")}
            cta={t("sam.support.github_cta")}
          />
        </div>
      </div>
    </div>
  );
}

function SupportLinkCard({
  href,
  title,
  description,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group block">
      <Card className="transition-colors group-hover:border-foreground/20">
        <CardHeader>
          <CardTitle>
            <h2>{title}</h2>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="font-medium">
          {cta} <span aria-hidden="true">&rarr;</span>
        </CardContent>
      </Card>
    </a>
  );
}
