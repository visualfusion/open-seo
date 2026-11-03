export const samDe = {
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
  support: {
    eyebrow: "Hilfe & Community",
    title: "Wir freuen uns auf dein Feedback",
    description:
      "Wir möchten mit dir ins Gespräch kommen! Wir sind offen für jedes Feedback und möchten verstehen, wie du arbeitest, um OpenSEO noch besser zu machen.",
    email_title: "E-Mail",
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
};
