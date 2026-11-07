import { umamiEn } from "./umami.en";
import { uiEn } from "./ui.en";
import { authEn } from "./auth.en";
import { domainEn } from "./domain.en";
import { shellEn } from "./shell.en";
import { settingsEn } from "./settings.en";
import { samEn } from "./sam.en";
import { ranksEn } from "./ranks.en";
import { aiEn } from "./ai.en";
import { brandLookupEn } from "./brandLookup.en";
import { aiVisibilityEn } from "./aiVisibility.en";
import { contextEn } from "./context.en";
import { teamEn } from "./team.en";
import { reportsEn } from "./reports.en";
import { keywordsEn } from "./keywords.en";
import { auditEn } from "./audit.en";
import { projectsEn } from "./projects.en";
import { billingEn } from "./billing.en";
import { backlinksEn } from "./backlinks.en";
import { dashboardEn } from "./dashboard.en";
import { integrationsEn } from "./integrations.en";
import { searchPerformanceEn } from "./searchPerformance.en";
import { lighthouseEn } from "./lighthouse.en";
import { localSeoEn } from "./localSeo.en";
import { projectSettingsEn } from "./projectSettings.en";
import { savedKeywordsEn } from "./savedKeywords.en";
import { widgetsEn } from "./widgets.en";
export const en = {
  umami: umamiEn,
  ui: uiEn,
  auth: authEn,
  common: {
    delete: "Delete",
    search: "Search",
    help: "Help",
    organization: "Organization",
    billing: "Billing & Plans",
    theme: "Theme",
    sign_out: "Sign out",
    loading: "Loading...",
    system: "System",
    light: "Light",
    dark: "Dark",
    cancel: "Cancel",
    close: "Close",
    date: "Date",
    save: "Save",
    saved: "Saved",
    url: "URL",
    status: "Status",
    all: "All",
    edit: "Edit",
  },
  domain: domainEn,
  shell: shellEn,
  settings: settingsEn,
  nav: {
    settings: "Settings",
    audit: "Site Audit",
    keywords: "Keyword Research",
    dashboard: "Dashboard",
    overview: "Overview",
    research: "Research",
    ai_visibility: "AI Visibility",
    my_site: "My Site",
    ai_tools: "AI Tools",
    saved_keywords: "Saved Keywords",
    rank_tracking: "Rank Tracking",
    local_seo: "Local SEO",
    search_performance: "GSC Insights",
    domain: "Domain Overview",
    backlinks: "Backlinks",
    prompt_tracking: "Prompt Tracking",
    prompt_research: "Prompt Research",
    prompt_explorer: "Prompt Explorer",
    reports: "Reports",
    context: "Context",
    agent_setup: "Agent setup",
  },
  sam: samEn,
  ranks: ranksEn,
  ai: aiEn,
  brand_lookup: brandLookupEn,
  ai_visibility: aiVisibilityEn,
  context: contextEn,
  team: teamEn,
  reports: reportsEn,
  keywords: keywordsEn,
  audit: auditEn,
  projects: projectsEn,
  billing: billingEn,
  backlinks: backlinksEn,
  dashboard: dashboardEn,
  integrations: integrationsEn,
  search_performance: searchPerformanceEn,
  lighthouse: lighthouseEn,
  local_seo: localSeoEn,
  project_settings: projectSettingsEn,
  saved_keywords: savedKeywordsEn,
  widgets: widgetsEn,
};
export type TranslationDict = typeof en;
