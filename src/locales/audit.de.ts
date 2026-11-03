import { auditDetailsDe } from "./auditDetails.de";
export const auditDe = {
  all_audits: "Alle Audits",
  load_error_fallback:
    "Dieses Audit konnte nicht geladen werden. Möglicherweise wurde es gelöscht.",
  started_at: "Site-Audit · Gestartet {time}",
  failed_zero_pages_title:
    "Dieses Audit wurde abgebrochen, bevor Seiten gecrawlt werden konnten.",
  failed_try_again:
    "Starten Sie ein neues Audit, oder kontaktieren Sie {email}, falls das Problem weiterhin besteht.",
  code: "Code: {code}",
  blocked_title: "Der Bot-Schutz dieser Website hat unseren Crawler blockiert.",
  stopped_early_title:
    "Dieses Audit wurde nach {count} {pages} vorzeitig beendet.",
  page_singular: "Seite",
  page_plural: "Seiten",
  stopped_early_desc:
    "Die unten stehenden Ergebnisse umfassen alles, was vor dem Abbruch gecrawlt wurde. Starten Sie ein neues Audit, oder kontaktieren Sie {email}, falls das Problem weiterhin besteht.",
  failed_to_load_results: "Audit-Ergebnisse konnten nicht geladen werden",
  phases: {
    discovery: "Erkennung",
    crawling: "Crawling",
    lighthouse: "Lighthouse",
    finalizing: "Abschluss",
    running: "Läuft",
  },
  running_lighthouse: "Lighthouse-Prüfungen laufen",
  crawling_pages: "Seiten werden gecrawlt",
  lighthouse_progress: "{done} / {total} Prüfungen",
  lighthouse_failed: "({count} fehlgeschlagen)",
  crawl_progress: "{crawled} / {total} Seiten",
  crawled_pages_count: "Gecrawlte Seiten ({count})",
  updated_at: "Aktualisiert {time}",
  history: {
    failed_to_load: "Audit-Verlauf konnte nicht geladen werden",
    no_audits_title: "Noch keine Audits vorhanden",
    previous_audits: "Bisherige Audits",
    actions_label: "Audit-Aktionen",
    delete_audit: "Audit löschen",
  },
  pages: "Seiten",
  pages_crawled: "Seiten gecrawlt",
  yes: "Ja",
  start_new_audit: "Neues Audit starten",
  site_url_aria: "Website-URL",
  starting: "Wird gestartet...",
  start_audit: "Audit starten",
  upgrade_pages_desc: "{link}, um bis zu {max} Seiten zu crawlen.",
  upgrade: "Upgrade durchführen",
  max_pages: "Max. Seiten",
  max_pages_desc: "Geben Sie einen Wert von {min} bis {max} ein.",
  lighthouse_tooltip:
    "Lighthouse misst die Performance Ihrer Seiten und identifiziert Schwachstellen.",
  include_lighthouse: "Lighthouse einbeziehen",
  lighthouse_desc:
    "Wir wählen eine Stichprobe von 20 Seiten aus und filtern doppelte Seitenvorlagen heraus.",
  render_javascript_tooltip:
    "Lädt jede Seite vor der Analyse in einem Browser. Dauert länger.",
  render_javascript: "JavaScript rendern",
  setup_guide: "Einrichtungsleitfaden",
  title: "Site-Audit",
  render_up_to_title: "Bis zu {count} Seiten rendern?",
  large_audit_title: "Großes Audit starten?",
  render_cost_info:
    "Audits mit Rendering können deutlich länger dauern als reguläre Crawls.",
  large_audit_confirm:
    "Sie sind dabei, {count} Seiten zu crawlen. Dies kann eine Weile dauern. Fortfahren?",
  filters: {
    query_placeholder: "URL, Titel, Meta",
    missing: "Fehlt",
    missing_alt: "Fehlender Alt-Text",
    fetch_class: "Crawl-Ergebnis",
    read: "Gelesen",
    blocked: "Blockiert",
    rate_limited: "Ratenbegrenzt",
    alt_text: "Alt-Text",
    no_missing_alt: "Kein fehlender Alt-Text",
    speed_ms: "Geschwindigkeit ms",
    device: "Gerät",
    desktop: "Desktop",
    mobile: "Mobil",
    max_lcp: "Max. LCP s",
    perf: "Perf",
    seo: "SEO",
    result_count_of: "{count} von {total}",
  },
  failed: "Fehlgeschlagen",
  columns: {
    words: "Wörter",
    title: "Titel",
    h1: "H1",
    images: "Bilder",
    speed: "Geschwindigkeit",
    a11y: "Barrierefreiheit",
  },
  no_issues_recorded: "Keine Probleme erfasst.",
  no_issues_recorded_desc: "Jede gecrawlte Seite hat alle Prüfungen bestanden.",
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
  how_to_fix: "Behebung",
  and_more_export:
    "…und {count} weitere — exportieren Sie die CSV-Datei für die vollständige Liste.",
  redirect: "Weiterleitung",
  missing: "fehlt",
  no_pages_crawled: "Keine Seiten gecrawlt",
  no_lighthouse_results: "Keine Lighthouse-Ergebnisse",
  issues: "Probleme",
  view_issues: "Probleme ansehen",
  crawler_link_text: "OpenSEO-Audit-Crawler",
  rate_limited_advice:
    "Starten Sie das Audit nach Ablauf des Rate-Limits erneut oder bitten Sie den Website-Betreiber, den {crawler} freizuschalten.",
  bot_blocked_pages_title:
    "Der Bot-Schutz hat unseren Crawler auf {count} {pages} blockiert.",
  rate_limited_stopped_title:
    "Das Crawling wurde aufgrund des Rate-Limits der Website vorzeitig beendet.",
  rate_limited_pages_title:
    "Die Website hat die Anfragen für {count} {pages} limitiert (Rate Limit).",
  rate_limited_stopped_desc:
    "Die Website hat wiederholt Anfragen verweigert, weshalb einige URLs nicht besucht werden konnten. Dieser Bericht ist unvollständig. ",
  rate_limited_pages_desc:
    "Seiten mit dem HTTP-Status 429 Too Many Requests konnten nicht analysiert werden. ",
  tabs: {
    issues: "Probleme ({count})",
    pages: "Seiten ({count})",
    performance: "Performance ({count})",
  },
  shopify: {
    rate_limit_title: "Fehler bei der Kommunikation mit Ihrer Shopify-Domain.",
    rate_limit_desc:
      "Shopify wendet ein globales Rate-Limit an, weshalb dieser Bericht unvollständig ist. Starten Sie ein neues Audit mit aktiviertem JavaScript-Rendering, um das Audit abzuschließen.",
  },
  stats: {
    pages_crawled: "Gecrawlte Seiten",
    issues_found: "Gefundene Probleme",
    avg_response_time: "Durchschnittliche Antwortzeit",
    lighthouse_tests: "Lighthouse-Tests",
    lighthouse_performance: "Lighthouse Performance",
    lighthouse_seo: "Lighthouse SEO",
    lighthouse_accessibility: "Lighthouse Barrierefreiheit",
    lighthouse_failures: "Lighthouse-Fehlschläge",
  },
  running: "Läuft",
  done: "Fertig",
  bot_advice_render:
    "Aktivieren Sie „JavaScript rendern“ und starten Sie das Audit erneut. Um Zusatzkosten zu vermeiden, nutzen Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  bot_advice_rendered:
    "Auch mit Rendering konnte der Schutz nicht umgangen werden. Probieren Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  bot_advice_desktop:
    "Probieren Sie einen kostenlosen Desktop-Crawler wie {crawlers}.",
  affected_pages: "Betroffene Seiten",
  details: auditDetailsDe,
};
