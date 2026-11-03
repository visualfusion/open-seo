import { brandLookupDetailsDe } from "./brandLookupDetails.de";
export const brandLookupDe = {
  scope_reason: "Bereiche gelten nur für Domain-Abfragen",
  err_enter_query: "Bitte gib einen Markennamen oder eine Domain ein",
  err_max_length: "Bitte maximal {max} Zeichen eingeben",
  err_comp_max_length:
    "Jeder Wettbewerber darf maximal {max} Zeichen lang sein",
  err_comp_matches_target:
    "„{match}“ entspricht der gesuchten Marke – bitte aus den Wettbewerbern entfernen",
  err_subfolder_path:
    "Füge einen Pfad hinzu, um Unterordner zu nutzen (z. B. beispiel.de/blog)",
  bullet1_title: "KI-Sichtbarkeit verfolgen",
  bullet1_body:
    "Sieh geschätzte Werte für Antworten von ChatGPT und Google AI Overview, die deine Marke zitieren, und verfolge den monatlichen Trend.",
  bullet2_title: "Prompts einsehen",
  bullet2_body:
    "Sieh dir Beispiel-Fragen von Nutzern an, bei denen LLMs auf deine Marke oder Domain verweisen.",
  bullet3_title: "Wettbewerb kartieren",
  bullet3_body:
    "Erkenne die Seiten, die LLMs zusammen mit dir zitieren, damit du weißt, wer in KI-Antworten um Aufmerksamkeit konkurriert.",
  title: "KI-Markensuche",
  subtitle: "Sieh dir an, wie KI-Suchsysteme Marken oder Domains zitieren.",
  gate_desc:
    "Sieh dir an, wie ChatGPT und Google AI Overview eine Marke oder Domain zitieren – gesamte Erwähnungen, Beispiel-Prompts und gemeinsam zitierte Seiten.",
  err_load_failed: "KI-Markensuche konnte nicht geladen werden",
  recent_searches: "Letzte Suchanfragen",
  empty_history:
    "Suche nach einem Markennamen oder einer Domain, um zu sehen, wie KI sie zitiert",
  prompt_explorer: {
    models_tab_suffix: "{prompt} · {count} Modelle",
    err_enter_prompt: "Bitte gib einen Prompt ein",
    err_prompt_max: "Prompts dürfen maximal {max} Zeichen lang sein",
    err_brand_max: "Die Marke darf maximal {max} Zeichen lang sein",
    err_select_model: "Bitte wähle mindestens ein Modell aus",
    err_load_failed: "Prompt-Ergebnisse konnten nicht geladen werden",
    empty_history: "Gib einen Prompt ein, um Modell-Antworten zu vergleichen",
    no_country_pref: "Keine Länderpräferenz",
    prompt_label: "Prompt",
    prompt_desc: "Was deine Kunden eine KI fragen könnten.",
    highlight_label: "Marke hervorheben (optional)",
    highlight_desc:
      "Wir markieren, ob das jeweilige Modell diese Marke erwähnt.",
    models_label: "Modelle",
    skipped_for_country: "Übersprungen für {country}",
    allow_web_search: "Websuche erlauben",
    web_search_country_aria: "Land für die Websuche",
    search_countries_placeholder: "Länder suchen",
    no_countries_match: "Keine unterstützten Länder gefunden.",
    about_country_aria: "Über Länder-Targeting",
    about_country_tip:
      "Ein Land steuert die Websuche, sofern das Modell dies unterstützt. Modelle können auch ohne Suche antworten. Leer lassen, um alle ausgewählten Modelle auszuführen.",
    run_one_model: "1 Modell ausführen",
    run_many_models: "{count} Modelle ausführen",
    loading_aria: "Antworten werden geladen",
    country_hint_sent:
      "Länderhinweis gesendet: {country}. Dies ist kein verifizierter Suchstandort.",
    no_country_hint:
      "Kein Länderhinweis gesendet. Bei einer Suche wird der Standardstandort des Anbieters genutzt.",
    related_queries_heading:
      "Verwandte Suchanfragen, die das Modell erwogen hat",
    cited_sources_heading: "Zitierte Quellen ({count})",
    status_error: "Fehler",
    status_skipped: "Übersprungen",
    web_search_used: "Websuche",
    no_web_search_used: "keine Websuche",
    tokens_suffix: "{count} Tokens",
    no_brand_prefix: "kein {brand}",
  },
  showing_earlier_results: "{error} Es werden frühere Ergebnisse angezeigt.",
  sov: {
    you_badge: "Du",
    title: "Share of Voice",
    domain_tip:
      "Share of Voice vergleicht gesamte Domains – nicht eingeschränkt auf die gesuchte Unterseite oder das Verzeichnis.",
    no_comparable_data: "· keine vergleichbaren Daten",
    caption_prefix: "Anteil der Erwähnungen auf ",
    share_aria: "{label} Anteil im Verhältnis zum Spitzenreiter",
  },
  citations: {
    run_in_explorer: "Diesen Prompt im Prompt-Explorer ausführen",
    prompt_vol_title: "Prompt-Volumen in der abgerufenen Stichprobe",
    vol_suffix: "Vol.",
    col_source: "Quelle",
    col_source_help:
      "Eine Seite, die in KI-Antworten als Quelle zitiert wurde, in denen die gesuchte Marke oder Domain vorkommt.",
    col_source_vol: "Quellen-Vol.",
    col_source_vol_help:
      "Geschätzte monatliche Prompt-Nachfrage laut DataForSEO für diese zitierte Quelle über alle Prompts hinweg, in denen die gesuchte Marke oder Domain erscheint.",
    col_platform: "Plattform",
    platform_help:
      "Welche KI-Plattform die Antwort erzeugt hat – ChatGPT oder Google AI Overview.",
    col_cited_for: "Zitiert für",
    col_cited_for_help:
      "Beispiel-Prompts aus der abgerufenen Stichprobe, bei denen diese Seite zitiert wurde.",
    col_query: "Suchanfrage",
    col_query_help:
      "Ein Beispiel-Prompt aus der Stichprobe, dessen KI-Antwort die gesuchte Marke oder Domain im Text oder in den Quellen genannt hat. Der Prompt selbst muss die Marke nicht enthalten.",
    brands_prefix: "Marken: ",
    col_ai_vol: "KI-Suchvol.",
    col_ai_vol_help:
      "Geschätzte monatliche Suchnachfrage für das Thema dieses Prompts. Dies ist die Themen-Nachfrage, nicht die Anzahl der Markenerwähnungen.",
    col_actions: "Aktionen",
    desc_pages_scoped_prefix: "Zitierte Seiten innerhalb von ",
    desc_pages_unscoped_prefix: "Gemeinsam zitierte Seiten mit ",
    desc_pages_scoped_suffix:
      ". Prompt-Beispiele stammen aus der abgerufenen Stichprobe.",
    desc_pages_unscoped_suffix:
      " in KI-Antworten. Prompt-Beispiele stammen aus der abgerufenen Stichprobe.",
    desc_queries_prefix: "Abgerufene Stichprobe von Prompts, deren KI-Antwort ",
    desc_queries_scoped_mid: "eine Seite innerhalb von ",
    desc_queries_scoped_suffix: " zitiert hat.",
    desc_queries_unscoped_suffix: " im Text oder in den Quellen zitiert hat.",
    tab_queries: "Suchanfragen",
    tab_pages: "Zitierte Quellen",
    empty_pages_scoped:
      "Keine der meistzitierten Seiten dieser Domain fällt unter {target}.",
    empty_pages_scoped_desc:
      "Erweitere den Bereich, um Zitate auf Domain-Ebene zu sehen.",
    empty_pages_unscoped: "Keine zitierten Quellen vorhanden.",
    empty_queries_scoped:
      "Keiner der Stichproben-Prompts hat eine Seite unter {target} zitiert.",
    empty_queries_scoped_desc:
      "Erweitere den Bereich, um Prompts auf Domain-Ebene zu sehen.",
    empty_queries_unscoped: "Keine passenden Suchanfragen gefunden.",
  },
  filters: {
    all: "Alle",
    platform: "Plattform",
    include_terms: "Begriffe einschließen",
    exclude_terms: "Begriffe ausschließen",
    source_mentions: "Quellen-Erwähnungen",
    ai_search_volume: "KI-Suchvolumen",
  },
  results: {
    mentions_col: "Erwähnungen",
    temp_unavailable_prefix:
      "Daten zu KI-Erwähnungen sind vorübergehend nicht verfügbar für ",
    temp_unavailable_suffix: ". Bitte versuche es in Kürze erneut.",
    no_mentions_prefix: "Keine KI-Erwähnungen gefunden für ",
    platform_unavailable_note:
      "Hinweis: {platforms} war nicht verfügbar – einige Erwähnungen fehlen möglicherweise.",
    updated_prefix: "Aktualisiert ",
    domain_level_tip:
      "KI-Suchanbieter erfassen Erwähnungen pro Domain, nicht pro Unterseite. Dieser Wert gilt für die gesamte Domain – die unten zitierten Seiten sind auf deinen Bereich begrenzt.",
    platform_col: "Plattform",
    mentions_tip:
      "KI-Antworten, die deine Marke erwähnen oder deine Website zitieren.",
    ai_vol_col: "KI-Suchvolumen",
    ai_vol_tip:
      "Geschätztes monatliches Suchvolumen für Prompts, bei denen deine Marke in KI-Antworten erscheint.",
    total_row: "Gesamt",
    chatgpt_us_tip: "ChatGPT-Daten umfassen derzeit nur US-Englisch.",
    unavailable: "Nicht verfügbar",
    trend_title: "Erwähnungen im Trend (letzte 12 Monate)",
    more_info: "Weitere Infos",
    just_now: "gerade eben",
    minutes_ago: "vor {count} Min.",
    hours_ago: "vor {count} Std.",
    days_ago: "vor {count} T.",
    domain_level_badge: "Domain-Ebene",
  },
  search_card: {
    comp_placeholder: "Wettbewerber hinzufügen (kommagetrennt)",
    comp_aria: "Wettbewerber",
    comp_desc:
      "Füge bis zu 5 Wettbewerbs-Marken oder -Domains hinzu, um deinen Share of Voice zu sehen.",
    est_prefix: "Geschätzt ",
    est_comp_prefix: " plus ~${cost} für den Wettbewerbsvergleich",
    placeholder: "Markenname oder Domain eingeben",
    aria_label: "Markenname oder Domain",
  },
  details: brandLookupDetailsDe,
};
