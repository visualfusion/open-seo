export const auditDe = {
  running: "Läuft",
  running_lighthouse: "Lighthouse-Prüfungen laufen",
  done: "Fertig",
  failed: "Fehlgeschlagen",
  failed_zero_pages_title:
    "Dieses Audit wurde abgebrochen, bevor Seiten gecrawlt werden konnten.",
  failed_try_again:
    "Starten Sie ein neues Audit, oder kontaktieren Sie {email}, falls das Problem weiterhin besteht.",
  failed_to_load_results: "Audit-Ergebnisse konnten nicht geladen werden",
  bot_advice_render:
    "Aktivieren Sie „JavaScript rendern“ und starten Sie das Audit erneut. Um Zusatzkosten zu vermeiden, nutzen Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  bot_advice_rendered:
    "Auch mit Rendering konnte der Schutz nicht umgangen werden. Probieren Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  bot_advice_desktop:
    "Probieren Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  stats: {
    pages_crawled: "Gecrawlte Seiten",
  },
  issues: "Probleme",
  affected_pages: "Betroffene Seiten",
  critical: "Kritisch",
  warning: "Warnung",
  warnings: {
    shells_title:
      "Einige Seiten benötigen möglicherweise JavaScript, um ihren Inhalt anzuzeigen.",
    shells_rendered_desc:
      "Sie luden auch nach dem Rendern noch, sodass sie nicht geprüft werden konnten.",
    shells_not_rendered_desc:
      "Aktivieren Sie „JavaScript rendern“ und starten Sie das Audit erneut.",
    unread_pages_title: "Wir konnten {count} {pages} nicht lesen.",
    unread_pages_desc:
      "Öffnen Sie „Seiten“ und filtern Sie das Crawl-Ergebnis nach „Fehlgeschlagen“, um sie zu sehen.",
    js_rendering_enabled:
      "JavaScript-Rendering war für dieses Audit aktiviert.",
  },
  info: "Info",
  site_url_aria: "Website-URL",
  setup_guide: "Einrichtungsleitfaden",
};
