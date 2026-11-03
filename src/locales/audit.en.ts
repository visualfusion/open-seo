export const auditEn = {
  running: "Running",
  running_lighthouse: "Running Lighthouse checks",
  done: "Done",
  failed: "Failed",
  failed_zero_pages_title: "This audit stopped before it crawled any pages.",
  failed_try_again:
    "Run a new audit to try again, or email {email} if this keeps happening.",
  failed_to_load_results: "Failed to load the audit results",
  bot_advice_render:
    "Turn on Render JavaScript and run the audit again. To avoid the extra cost, use a free desktop crawler like {crawlers}.",
  bot_advice_rendered:
    "Rendering couldn't get past it. Try a free desktop crawler like {crawlers}.",
  bot_advice_desktop: "Try a free desktop crawler like {crawlers}.",
  stats: {
    pages_crawled: "Pages crawled",
  },
  issues: "Issues",
  affected_pages: "Affected pages",
  critical: "Critical",
  warning: "Warning",
  warnings: {
    shells_title: "Some pages may need JavaScript to show their content.",
    shells_rendered_desc:
      "They were still loading after rendering, so we couldn't check them.",
    shells_not_rendered_desc:
      "Turn on Render JavaScript and run the audit again to check them.",
    unread_pages_title: "We couldn't read {count} {pages}.",
    unread_pages_desc:
      "To see them, open Pages and filter Crawl result by Failed.",
    js_rendering_enabled: "JavaScript rendering was enabled for this audit.",
  },
  info: "Info",
  site_url_aria: "Site URL",
  setup_guide: "Setup guide",
};
