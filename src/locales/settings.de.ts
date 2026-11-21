import { settingsDetailsDe } from "./settingsDetails.de";
export const settingsDe = {
  every_app: {
    title: "Every App",
    description:
      "Dein Benutzerkonto, Teammitglieder und KI-Verbindungen werden auf Every App verwaltet.",
    open_button: "Every App öffnen →",
  },
  connected_agents_connected: "Verbunden",
  crawler_access: {
    form: {
      domain_required: "Gib eine Domain ein.",
      input_required: "Gib Signature-Input ein.",
      input_expired:
        "Diese Signatur ist bereits abgelaufen. Erstelle im Shopify-Admin eine neue.",
      sig_required: "Gib Signature ein.",
      success: "Crawler-Zugriff für {host} gespeichert",
      err_wrong_domain:
        "Diese Signatur wurde für {signedHost} erstellt, nicht für {host}. Erstelle im Shopify-Admin eine Signatur für {host}.",
      err_rejected:
        "Shopify akzeptiert diese Signatur für {host} nicht. Prüfe, ob sie für {host} erstellt und beide Werte vollständig kopiert wurden.",
      needs_setup: "Crawler-Zugriff ist noch nicht eingerichtet.",
      domain_label: "Domain",
      domain_placeholder: "shop.example.de",
      input_label: "Signature-Input",
      input_placeholder: "sig1=(...);expires=...",
      sig_label: "Signature",
      sig_desc:
        "Shopify zeigt auch einen Signature-Agent-Wert an. Du musst ihn nicht einfügen: OpenSEO sendet ihn automatisch mit jeder Anfrage.",
      sig_placeholder: "sig1=:...:",
      submit: "Signatur speichern",
    },
    connect: "Verbinden",
    table: {
      remove_success: "Crawler-Zugriff entfernt",
      domain: "Domain",
      type: "Typ",
      type_shopify: "Shopify-Signatur",
      added: "Hinzugefügt",
      expires: "Gültig bis",
      unknown: "Unbekannt",
      expired: "Abgelaufen",
      remove_label: "Crawler-Zugriff für {host} entfernen",
    },
    title: "Shopify",
    cancel: "Abbrechen",
    desc: "Erlaube dem Audit-Crawler den Zugriff auf Shopify. Füge die Signatur ein, die du im Shopify-Admin unter Onlineshop → Einstellungen → Crawler-Zugriff erstellt hast. Jedes Audit dieser Domain in deiner Organisation sendet sie bei jeder Anfrage mit.",
    error_loading: "Crawler-Zugriff konnte nicht geladen werden.",
  },
  indexnow: {
    agent_copy_label: "Prompt kopieren",
    urls_required: "Gib mindestens eine URL ein.",
    toasts: {
      failed: "Konnte nicht an IndexNow übermittelt werden",
      submitted: "{count} URL(s) übermittelt",
      skipped: "{count} URL(s) übersprungen, die nicht zu {domain} gehören",
    },
    title: "IndexNow",
    error_loading: "IndexNow konnte nicht geladen werden.",
    agent_prompt:
      "Reiche die Seiten, die ich gerade veröffentlicht habe, bei IndexNow ein.",
    description:
      "Informiere Bing über neue und aktualisierte Seiten, sobald du sie veröffentlichst, anstatt auf den Crawler zu warten. Bing versorgt auch DuckDuckGo und Yahoo. Google nutzt IndexNow nicht.",
    add_website_hint:
      "Füge deine Website in den allgemeinen Einstellungen hinzu, um IndexNow zu nutzen.",
    setup_button: "IndexNow einrichten",
    step2_title: "Seiten beim Veröffentlichen oder Aktualisieren einreichen",
    step2_desc:
      "Füge nur die geänderten Seiten ein, nicht deine gesamte Website.",
    urls_label: "URLs (eine pro Zeile)",
    submit: "An IndexNow übermitteln",
    agent_hint: "Oder frage deinen Agenten:",
    agent_copy_success: "Prompt kopiert",
    agent_subhint:
      "Wenn dein Agent deinen Website-Code bearbeiten kann, kann er auch die Schlüsseldatei hinterlegen.",
    step1_title_verified: "Deine Schlüsseldatei ist eingerichtet",
    step1_title_pending: "Schlüsseldatei auf deiner Website hinterlegen",
    download_key_file: "Schlüsseldatei herunterladen",
    key_file_location:
      "Lege die Datei ins Hauptverzeichnis deiner Website, sodass sie hier erreichbar ist:",
    check_again: "Erneut prüfen",
    how_to_add_title: "Wie füge ich eine Datei zu meiner Website hinzu?",
    how_to_add_code:
      "Selbst erstellte Website: Lege die Datei in den Ordner, den dein Webserver unverändert ausliefert (oft public oder static genannt).",
    how_to_add_wordpress:
      "WordPress: Lade die Datei per Dateimanager deines Hosters oder SFTP in das Verzeichnis mit wp-config.php hoch. SEO-Plugins wie Rank Math können Seiten ebenfalls automatisch an IndexNow melden.",
    how_to_add_cloudflare:
      "Auf Cloudflare: Aktiviere Crawler Hints in den Caching-Einstellungen, damit Cloudflare geänderte Seiten automatisch an IndexNow übermittelt.",
    how_to_add_builders:
      "Website-Baukästen wie Webflow, Shopify, Squarespace und Wix erlauben meist keine Dateien im Stammverzeichnis. Prüfe, ob dein Anbieter IndexNow bereits unterstützt.",
    status: {
      found: "Gefunden",
      missing: "Nicht gefunden",
      wrong_content: "Darf nur den Schlüssel enthalten",
      redirects:
        "Leitet weiter. Die Datei muss direkt unter dieser Adresse laden",
      moved: "Leitet zu einer anderen Adresse weiter",
      unreachable: "Adresse konnte nicht erreicht werden",
      unknown: "Konnte gerade nicht geprüft werden",
    },
  },
  api_keys: {
    revoke_dialog: {
      success: "API-Schlüssel widerrufen",
      title: "API-Schlüssel widerrufen?",
      confirm: "Widerrufen",
      desc: "Möchtest du „{name}“ wirklich widerrufen? Jeder Client, der diesen Schlüssel verwendet, verliert sofort den Zugriff.",
    },
    title: "API-Schlüssel",
    subtitle: "MCP-Clients authentifizieren, wenn OAuth nicht funktioniert",
    helper:
      "Nutze dies für Remote-Agenten wie Hermes, bei denen der normale Login-Ablauf nicht greift.",
    setup_guide: "Einrichtungsanleitung",
    create_button: "API-Schlüssel erstellen",
    error_loading: "Deine API-Schlüssel konnten nicht geladen werden.",
    empty: "Noch keine API-Schlüssel vorhanden.",
    table: {
      name: "Name",
      key: "Schlüssel",
      organization: "Organisation",
      created: "Erstellt",
      last_used: "Zuletzt verwendet",
      unnamed: "Unbenannter Schlüssel",
      never: "Nie",
      actions_label: "Aktionen für {name}",
      revoke: "Widerrufen",
      copied: "Schlüssel kopiert",
    },
    create_dialog: {
      save_title: "Speichere deinen API-Schlüssel",
      save_desc:
        "Kopiere deinen API-Schlüssel jetzt sorgfältig. Er wird danach nicht mehr angezeigt.",
      copy: "Kopieren",
      done: "Fertig",
      title: "API-Schlüssel erstellen",
      name_label: "Name",
      name_placeholder: "z. B. Claude Desktop, Hermes",
      cancel: "Abbrechen",
      submit: "Schlüssel erstellen",
    },
  },
  connected_agents_success: "Agent getrennt",
  connected_agents_title: "Verbundene Agenten",
  connected_agents_desc:
    "KI-Clients, die über OAuth bei OpenSEO angemeldet oder über Stripe Projects hinzugefügt wurden.",
  connected_agents_error: "Verbundene Agenten konnten nicht geladen werden.",
  connected_agents_empty: "Noch keine Agenten verbunden.",
  connected_agents_client: "Client",
  connected_agents_organization: "Organisation",
  connected_agents_actions: "Aktionen für",
  connected_agents_disconnect: "Trennen",
  connected_agents_disconnect_title: "„{name}“ trennen?",
  connected_agents_disconnect_confirm: "Trennen",
  connected_agents_disconnect_warning:
    "Der Agent muss sich erneut bei OpenSEO anmelden.",
  connected_agents_disconnect_stripe_warning:
    "Stripe kann keine neuen Schlüssel mehr erstellen, und zuvor erstellte Schlüssel funktionieren nicht mehr. Führe stripe projects add openseo/api aus, um die Verbindung wiederherzustellen.",
  privacy_updates_error: "Wir konnten deine E-Mail-Auswahl nicht speichern.",
  privacy_title: "Datenschutz und E-Mails",
  privacy_analytics: "Nutzungsanalyse",
  privacy_analytics_desc:
    "Teile Nutzungsdaten und Sitzungsaufzeichnungen, um OpenSEO zu verbessern.",
  privacy_analytics_label: "Nutzungsanalyse teilen",
  privacy_updates: "Produkt-Updates",
  privacy_updates_desc:
    "Gelegentliche E-Mails zu neuen Funktionen und Tipps. Jederzeit abbestellbar.",
  privacy_updates_label: "Produkt-Update-E-Mails erhalten",
  appearance: "Erscheinungsbild",
  theme: "Theme",
  language: "Sprache",
  language_desc: "Wähle deine bevorzugte Sprache für die Benutzeroberfläche.",
  about: "Über OpenSEO",
  version: "Version",
  personal: "Persönlich",
  organization: "Organisation",
  title: "Einstellungen",
  sections: "Einstellungsbereiche",
  details: settingsDetailsDe,
  import_from_self_hosted_openseo: "Selbst gehostetes OpenSEO importieren",
  bring_over_the_projects_history_and_chats:
    "Übernimm Projekte, Verlauf und Chats aus deiner eigenen OpenSEO-Installation.",
  import: "Importieren",
  copies_its_projects_and_their_history_here:
    "Kopiert die Projekte und ihren Verlauf in diese Installation.",
  create_a_transfer_code: "Übertragungscode erstellen",
  transfer_code_copied: "Übertragungscode kopiert",
  copy_transfer_code: "Übertragungscode kopieren",
  works_once_for_24_hours:
    "Der Code ist 24 Stunden gültig und lässt sich einmal verwenden.",
  create_code: "Code erstellen",
  a_move_is_already_running_try_again:
    "Es läuft bereits eine Übertragung. Versuche es erneut, sobald sie abgeschlossen ist.",
  paste_it_in_your_self_hosted_openseo:
    "Code im selbst gehosteten OpenSEO einfügen",
  settings_move_to_every_app_i_have:
    "Einstellungen → Zu Every App umziehen → Ich habe ein Gateway",
  done: "Fertig",
  cancel: "Abbrechen",
  update_your_self_hosted_openseo_to_v:
    "Aktualisiere dein selbst gehostetes OpenSEO auf v{version}",
  move_to_every_app: "Zu Every App umziehen",
  get_team_sign_in_and_all_your:
    "Melde dein Team zentral an und verwalte eure Apps an einem Ort. Projekte, Verlauf und Chats werden vollständig übernommen.",
  about_every_app: "Über Every App",
  copies_your_projects_and_their_history_to:
    "Kopiert deine Projekte und ihren Verlauf zu OpenSEO auf deinem Gateway. Deine Daten bleiben auch hier erhalten.",
  do_you_already_have_an_every_app: "Hast du bereits ein Every App Gateway?",
  set_up_my_gateway: "Gateway einrichten",
  i_have_a_gateway: "Ich habe ein Gateway",
  stop: "Stoppen",
  get_every_app: "Every App installieren",
  create_your_gateway: "Gateway erstellen",
  needs: "Du brauchst",
  and_a_domain_on_cloudflare_dns: "und eine Domain mit Cloudflare DNS.",
  my_gateway_is_ready: "Mein Gateway ist bereit",
  install_openseo_on_your_gateway: "OpenSEO auf deinem Gateway installieren",
  make_a_transfer_code: "Übertragungscode erstellen",
  in_openseo_on_your_gateway_open_settings:
    "Öffne auf deinem Gateway die OpenSEO-Einstellungen und klicke auf „Selbst gehostetes OpenSEO importieren“.",
  paste_the_code_here: "Code hier einfügen",
  transfer_code: "Übertragungscode",
  move_my_data: "Meine Daten übertragen",
  moving_projects_and_history: "Projekte und Verlauf werden übertragen",
  moving_sam_chats: "SAM-Chats werden übertragen",
  moving_audit_and_export_files: "Audit- und Exportdateien werden übertragen",
  keep_this_page_open_until_it_finishes:
    "Lass diese Seite geöffnet, bis die Übertragung abgeschlossen ist.",
  your_data_is_on_every_app: "Deine Daten sind jetzt auf Every App.",
  everyone_connects_google_again_there_for_search:
    "Alle Teammitglieder müssen dort ihr Google-Konto für Search Console und Analytics erneut verbinden.",
  this_install_still_runs_scheduled_checks_turn:
    "Diese Installation führt weiterhin geplante Prüfungen aus. Sobald du den Umzug geprüft hast, kannst du sie abschalten, damit die Prüfungen nur einmal laufen.",
  open_openseo_on_your_gateway: "OpenSEO auf deinem Gateway öffnen →",
  count_files: "{count} Dateien",
  that_isn_t_a_transfer_code_copy:
    "Das ist kein gültiger Übertragungscode. Kopiere ihn erneut aus OpenSEO auf deinem Gateway.",
  this_code_expired_was_used_or_was:
    "Dieser Code ist abgelaufen, wurde bereits verwendet oder ersetzt. Erstelle einen neuen Code und versuche es erneut.",
  this_install_and_your_gateway_run_different:
    "Diese Installation und dein Gateway verwenden unterschiedliche OpenSEO-Versionen. Aktualisiere beide und versuche es erneut.",
  an_audit_or_check_is_still_running:
    "Hier läuft noch ein Audit oder eine Prüfung. Versuche es nach Abschluss erneut.",
  this_install_has_more_than_one_organization:
    "Diese Installation enthält mehrere Organisationen. Pro Umzug lässt sich eine Organisation übertragen.",
  couldn_t_reach_openseo_on_your_gateway:
    "OpenSEO auf deinem Gateway ist nicht erreichbar. Prüfe die Installation und Version und versuche es erneut.",
};
