export const keywordsDe = {
  search_bar: {
    placeholder: "Keyword eingeben oder Muster wie beste * für hunde",
    validation_required: "Bitte gib mindestens ein Keyword ein.",
    validation_max:
      "Bitte gib nicht mehr als {max} Keywords ein (eines pro Zeile).",
    city_tooltip:
      "Suchvolumen für eine Stadt, einen Landkreis oder eine Region abrufen. Für das gesamte Land leer lassen.",
    city_label: "Stadt",
    city_placeholder: "Stadt (optional)",
    local_volume_cost: "Lokales Volumen kostet ca. ~${cost} pro Suche.",
    aria_label: "Keywords",
    search_button: "Suchen",
    google_ads_notice:
      "Keyword-Daten für dieses Land stammen aus Google Ads – Suchvolumen, CPC und Trends sind verfügbar, Difficulty und Intention jedoch nicht.",
    options_button: "Optionen",
  },
  results: {
    serp: {
      retry: "Wiederholen",
      page_header: "Seite",
      show_top_20: "Top 20 anzeigen",
      show_top_results: "Top-Ergebnisse anzeigen",
      fetching_live:
        "Live-Ergebnisse werden abgerufen… Dies kann bis zu einer Minute dauern.",
      title: "SERP-Analyse",
      organic_results: "{count} organische Ergebnisse",
      no_serp_title: "Noch keine SERP-Details für dieses Keyword verfügbar.",
      no_serp_desc: "Klicke auf ein anderes Keyword, um Daten zu laden.",
      load_top_100: "Top 100 laden",
    },
    filters: {
      search_volume: "Suchvolumen",
      include_terms: "Begriffe einschließen",
      include_placeholder: "audit, checker, vorlage",
      exclude_terms: "Begriffe ausschließen",
      exclude_placeholder: "jobs, gehalt, kurs",
      cpc_usd: "CPC (USD)",
      difficulty: "Difficulty",
      intent: "Intention",
    },
    mobile_tabs: {
      keywords: "Keywords ({count})",
      serp: "SERP-Analyse",
    },
    approximate_notice:
      "Kein exakter Treffer für „{keyword}“. Es werden stattdessen die ähnlichsten verwandten Keywords angezeigt.",
    table: {
      selected_count: "{count} ausgewählt",
      showing_filtered: "{count} von {total} Keywords angezeigt",
      showing_count: "{count} Keywords angezeigt",
      save_keywords: "Keywords speichern",
      save: "Speichern",
      export_sheets: "In Google Sheets exportieren",
      export_csv: "CSV exportieren",
      columns: {
        keyword: "Keyword",
        volume: "Volumen",
        cpc: "CPC",
        cpc_help: "Cost-per-Click in USD.",
        competition: "Wettbewerb",
        competition_help:
          "Wettbewerb bei Google Ads (0–1): Höher bedeutet mehr werbetreibende Mitbewerber.",
        score: "Score",
        score_help:
          "Organische Keyword-Difficulty (0–100): Höher bedeutet schwerer in Googles Top 10 zu gelangen.",
        intent: "Intention",
      },
      shared_volume_tooltip:
        "{keyword}: Stimmt im gemeldeten Volumen mit {parent} überein. Geteilte Volumina können sich überschneiden.",
      no_keywords: "Keine Keywords",
    },
    search_trends: "Suchtrends",
  },
  intents: {
    informational: {
      short: "Info",
      label: "Informationell",
      description:
        "Der Suchende möchte Informationen oder Antworten. Geeignet für Ratgeber, Anleitungen und Erklärungen.",
    },
    commercial: {
      short: "Komm",
      label: "Kommerziell",
      description:
        "Der Suchende vergleicht Optionen vor einem Kauf. Kaufabsicht für Produktvergleiche, Alternativen und Lösungsseiten.",
    },
    transactional: {
      short: "Trans",
      label: "Transaktionsorientiert",
      description:
        "Der Suchende ist bereit für eine Handlung, meist einen Kauf. Priorisiere klare Angebote, Preise, Testphasen oder Konversionspfade.",
    },
    navigational: {
      short: "Nav",
      label: "Navigational",
      description:
        "Der Suchende sucht nach einer bestimmten Website, Marke oder Seite. Diese Anfragen erfordern meist das passende Ziel.",
    },
    unknown: {
      short: "?",
      label: "Unbekannt",
      description:
        "Die Suchintention war für dieses Keyword nicht verfügbar. Triff Content-Entscheidungen nicht allein anhand dieses Badges.",
    },
  },
  overview: {
    vol: "Vol",
    volume: "Volumen",
    difficulty: "Schwierigkeit",
    cpc: "CPC",
    comp: "Wettb.",
    competition: "Wettbewerb",
    search_trends: "Suchtrends, {range}",
    last_12_available_months: "Letzte 12 verfügbare Monate",
  },
  empty: {
    no_results_title: "Noch nicht genügend Keyword-Daten für diese Anfrage",
    no_results_desc:
      "Wir konnten keine Keyword-Chancen für „{keyword}“ in {location} finden.",
    start_title: "Gib ein Keyword ein, um zu starten",
    start_desc:
      "Suche nach einem beliebigen Keyword, um Suchvolumen, Difficulty, CPC und verwandte Keyword-Ideen zu sehen.",
  },
  title: "Keyword-Recherche",
  description: "Entdecke Keyword-Ideen, Suchvolumen und Ranking-Chancen.",
  recent_searches: "Letzte Suchen",
  dialog: {
    title_singular: "1 Keyword speichern",
    title_plural: "{count} Keywords speichern",
    info: "Diese Keywords werden in deinem aktuellen Projekt gespeichert.",
    local_note:
      "Gespeicherte Keywords zeigen nationale Metriken. Das lokale Volumen für {location} wird nicht gespeichert.",
    saved_singular: "1 Keyword gespeichert",
    saved_plural: "{count} Keywords gespeichert",
  },
  options: {
    results_item: "{count} Ergebnisse",
    sources: {
      auto: "Automatisch",
      suggestions: "Passende Wortgruppe",
      ideas: "Kategorie-Ideen",
      related: "Wird auch gesucht",
    },
    google_ads_only_note: "Nicht verfügbar für Länder mit Google-Ads-Daten.",
    title: "Suchoptionen",
    done: "Fertig",
    results_label: "Ergebnisse",
    source_label: "Keyword-Quelle",
    clickstream_label: "Clickstream-verfeinertes Suchvolumen",
    clickstream_local_help:
      "Nicht verfügbar für lokale Ergebnisse. Clickstream-Daten erfassen nur ganze Länder.",
    clickstream_help:
      "Google fasst das Volumen ähnlicher Keywords zusammen. Diese Option schätzt das individuelle Volumen jedes Keywords. Kostet 2× Credits.",
    group_keywords_label: "Keywords gruppieren",
  },
};
