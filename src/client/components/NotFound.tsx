import { useLocale } from "@/client/lib/i18n";
import { Link } from "@tanstack/react-router";
import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";

export function NotFound() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {t("ui.details.the_page_you_are_not_exist")}
        </CardContent>
        <CardFooter>
          <Button nativeButton={false} render={<Link to="/" />}>
            {t("ui.details.home")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
