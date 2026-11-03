import { uiEn } from "./ui.en";
import { authEn } from "./auth.en";
import { domainEn } from "./domain.en";
import { shellEn } from "./shell.en";
import { settingsEn } from "./settings.en";
import { ranksEn } from "./ranks.en";
import { aiEn } from "./ai.en";
import { auditEn } from "./audit.en";
import { billingEn } from "./billing.en";
import { backlinksEn } from "./backlinks.en";
import { dashboardEn } from "./dashboard.en";
import { integrationsEn } from "./integrations.en";
import { aiVisibilityEn } from "./aiVisibility.en";
import { searchPerformanceEn } from "./searchPerformance.en";
import { contextEn } from "./context.en";
import { samEn } from "./sam.en";
import { keywordsEn } from "./keywords.en";
import { projectsEn } from "./projects.en";
import { projectSettingsEn } from "./projectSettings.en";
import { teamEn } from "./team.en";
export const en = {
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
    close: "Close",
    status: "Status",
    cancel: "Cancel",
    save: "Save",
    saved: "Saved",
  },
  domain: domainEn,
  shell: shellEn,
  settings: settingsEn,
  nav: {
    settings: "Settings",
    keywords: "Keyword Research",
    dashboard: "Dashboard",
    audit: "Site Audit",
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
  ranks: ranksEn,
  ai: aiEn,
  audit: auditEn,
  billing: billingEn,
  backlinks: backlinksEn,
  dashboard: dashboardEn,
  integrations: integrationsEn,
  ai_visibility: aiVisibilityEn,
  search_performance: searchPerformanceEn,
  context: contextEn,
  sam: samEn,
  keywords: keywordsEn,
  projects: projectsEn,
  project_settings: projectSettingsEn,
  team: teamEn,
};
export type TranslationDict = typeof en;
