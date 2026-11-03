export const samDe = {
  message_copied: "Nachricht kopiert",
  copy_message: "Nachricht kopieren",
  edit_message: "Nachricht bearbeiten",
  edit_and_resend: "Bearbeiten und erneut senden",
  undo_from_message: "Ab dieser Nachricht rückgängig machen",
  undo_title: "Rückgängig – diese Nachricht und alle darauffolgenden entfernen",
  thinking: "Denkt nach…",
  thought_process: "Denkprozess",
  activating_skill: "Aktiviert {skill}",
  skill_label: "Skill: {skill}",
  save_and_resend: "Speichern & erneut senden",
  setup_gate: {
    guide_link: "Einrichtungsanleitung für den OpenRouter API-Key",
    confirm_key: "API-Key bestätigen",
    open_keys: "OpenRouter-Keys öffnen",
    title: "KI-Funktionen aktivieren",
    everyapp_p1_prefix:
      "SAM, der integrierte KI-Agent von OpenSEO, nutzt OpenRouter über dein Every-App-Gateway. Ein Administrator erstellt einen Schlüssel bei OpenRouter, hinterlegt ihn auf dem Gateway mit ",
    everyapp_p1_suffix: " und bestätigt ihn anschließend hier.",
    selfhosted_p1_prefix:
      "SAM, der integrierte KI-Agent von OpenSEO, benötigt einen OpenRouter API-Key. Erstelle einen Schlüssel bei OpenRouter, setze ihn als Umgebungsvariable ",
    selfhosted_p1_suffix:
      ", starte OpenSEO neu und bestätige ihn anschließend hier.",
    guide_prefix:
      "Eine Schritt-für-Schritt-Anleitung für jede Umgebung findest du in der ",
    guide_suffix: ".",
  },
  support: {
    email_title: "E-Mail",
    eyebrow: "Hilfe & Community",
    title: "Wir freuen uns auf dein Feedback",
    description:
      "Wir möchten mit dir ins Gespräch kommen! Wir sind offen für jedes Feedback und möchten verstehen, wie du arbeitest, um OpenSEO noch besser zu machen.",
    email_desc:
      "Sende uns Ideen, Probleme, Fragen oder Feedback direkt per E-Mail.",
    email_copied: "E-Mail-Adresse in die Zwischenablage kopiert",
    discord_title: "Discord",
    discord_desc:
      "Frage nach Hilfe, teile Ideen und tausche dich mit der Community aus.",
    discord_cta: "Discord beitreten",
    github_title: "GitHub Issues",
    github_desc: "Melde Fehler oder schlage neue Funktionen auf GitHub vor.",
    github_cta: "Issue erstellen",
  },
  help: {
    command_copied: "Befehl kopiert",
    copy_command: "Befehl kopieren",
    steps_title: "Schritte",
    not_admin_hint:
      "Kein Eigentümer oder Administrator? Leite diese Seite an einen weiter.",
    cf_title: "Cloudflare Workers (Dashboard-Oberfläche)",
    cf_step1_prefix: "Wechsle in Cloudflare zu ",
    cf_step1_mid: " -> ",
    cf_step1_suffix: " und öffne deinen OpenSEO-Worker.",
    cf_step2_prefix: "Öffne ",
    cf_step2_suffix: ".",
    cf_step3_prefix: "Wechsle zu ",
    cf_step3_mid: " und füge ein neues Secret namens ",
    cf_step3_suffix: " hinzu.",
    cf_terminal_or: "Oder setze dasselbe Secret über dein Terminal mit:",
    dataforseo: {
      request_prefix: "Öffne ",
      request_link: "DataForSEO API Access",
      request_suffix: " und fordere deine API-Zugangsdaten per E-Mail an.",
      encode_desc:
        "Kodiere deinen DataForSEO-Login und dein API-Passwort in diesem Format als Base64:",
      title: "DataForSEO API-Key einrichten",
      intro_prefix: "OpenSEO benötigt das Secret ",
      intro_suffix:
        ", bevor Keyword-, Domain- und SEO-Daten-Workflows ausgeführt werden können.",
      everyapp_intro:
        "Die Keyword-, Domain-, Backlink- und Ranking-Daten von OpenSEO stammen von DataForSEO. Bei Every App speichert das Gateway den Schlüssel einmalig für alle Apps.",
      save_env_prefix: "Speichere die Ausgabe als Secret ",
      save_env_suffix: " in deiner Umgebung.",
      everyapp_run:
        "Ein Eigentümer oder Administrator führt diesen Befehl im Every-App-Verzeichnis aus und fügt den Wert ein:",
      everyapp_reload:
        "Lade OpenSEO neu: Der Schlüssel wird bei der nächsten Anfrage verwendet.",
      dashboard_paste:
        "Füge den Base64-Wert aus dem obigen Terminal-Befehl ein und speichere.",
      terminal_hint_prefix: "Verwende den Base64-Wert von ",
      terminal_hint_suffix: ", wenn du dazu aufgefordert wirst.",
    },
    openrouter: {
      account_prefix: "Erstelle ein Konto auf ",
      account_suffix:
        " und lade Guthaben auf (Pay-as-you-go, genau wie bei DataForSEO).",
      key_prefix: "Öffne ",
      key_link: "OpenRouter API Keys",
      key_suffix: " und klicke auf „Create API Key“.",
      title: "OpenRouter API-Key einrichten",
      intro_prefix: "OpenSEO benötigt das Secret ",
      intro_suffix:
        ", bevor KI-Funktionen wie SAM (der integrierte SEO-Agent) genutzt werden können. Er ist optional – alle anderen Funktionen in OpenSEO arbeiten auch ohne ihn.",
      everyapp_intro:
        "SAM, Prompt-Vorschläge und die Website-Recherche laufen über OpenRouter. Bei Every App speichert das Gateway den Schlüssel einmalig für alle Apps.",
      save_env_prefix: "Speichere den Schlüssel als Secret ",
      save_env_suffix: " in deiner Umgebung:",
      env_docker: "Docker Self-Hosting: ",
      env_cf: "Cloudflare: in der Workers-Oberfläche setzen (siehe unten)",
      env_local: "Lokale Entwicklung: ",
      restart: "Starte OpenSEO neu.",
      everyapp_run:
        "Ein Eigentümer oder Administrator führt diesen Befehl im Every-App-Verzeichnis aus und fügt den Schlüssel ein:",
      everyapp_reload: "Lade OpenSEO neu.",
      dashboard_paste: "Füge deinen OpenRouter API-Key ein und speichere.",
      terminal_hint:
        "Füge deinen OpenRouter API-Key ein, wenn du dazu aufgefordert wirst.",
    },
  },
  reconnect: "Neu verbinden",
  reconnecting: "Verbinde neu…",
  placeholder: "Frag SAM nach Recherchen, Analysen oder Rankings…",
  stop: "Stopp",
  stopped_error: "SAM hat vor Abschluss dieser Antwort gestoppt.",
  send: "Nachricht senden",
  beta_gate: {
    title: "SAM ist in der Beta",
    p1: "SAM verpackt den OpenSEO MCP und die Skills in ein Chatfenster. Der KI-Agent, den du bereits nutzt – wie Claude Code, ChatGPT, Grok Bot oder Hermes –, führt genau dieselben Werkzeuge auf einer deutlich leistungsfähigeren Umgebung aus. Wir empfehlen, OpenSEO dort zu nutzen.",
    p2: "Du kannst SAM trotzdem direkt hier verwenden, allerdings befindet er sich noch in einem frühen Stadium.",
    setup_agent: "Deinen Agenten einrichten",
    use_anyway: "SAM trotzdem nutzen",
  },
  setup_status_error:
    "Einrichtungsstatus des KI-Agenten konnte nicht geladen werden.",
  load_chats_error: "Deine Chats konnten nicht geladen werden.",
  start_chat_error: "Neuer Chat konnte nicht gestartet werden.",
  chat_missing_desc: "Dieser Chat wurde archiviert oder existiert nicht.",
  go_to_latest_chat: "Zum letzten Chat wechseln",
  project_memory: "Projekt-Gedächtnis",
  suggestions: {
    q1: "Auf welche Keywords sollte ich mich als Nächstes konzentrieren?",
    q2: "Wer sind meine wichtigsten SERP-Wettbewerber?",
    q3: "Wie entwickelt sich mein Search-Console-Traffic?",
    q4: "Finde Quick-Win-Keywords, für die ich bereits ranke",
  },
  rewind_error:
    "Unterhaltung konnte nicht geändert werden. Bitte erneut versuchen.",
  clear_history_dev: "Verlauf leeren (Dev)",
  intro_p1:
    "Hi, ich bin SAM – dein integrierter SEO-Agent. Ich kann Keywords recherchieren, Wettbewerber analysieren, deine SERPs, Backlinks, dein Rank-Tracking und deine Search Console auswerten und daraus konkrete nächste Schritte für dieses Projekt ableiten.",
  intro_p2: "Frag mich alles oder starte mit einem dieser Vorschläge:",
  saving_cut_off: "Abgebrochene Antwort wird gespeichert…",
  lost_connection: "Verbindung zu SAM verloren.",
  beta: "Beta",
  dismiss: "Ausblenden",
  sidebar_beta_desc:
    "Für noch leistungsfähigere KI-Workflows kannst du den OpenSEO MCP mit deinem eigenen Agenten wie Claude Code oder Hermes nutzen.",
  sidebar_setup_mcp: "MCP einrichten →",
  sidebar_opt_in_hint:
    "Deine Chats erscheinen hier, sobald du der Beta beitrittst.",
  new_chat: "Neuer Chat",
  sidebar_empty: "Noch keine Chats. Starte einen neuen.",
  archive_chat: "Chat archivieren",
};
