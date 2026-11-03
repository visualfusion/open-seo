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
    "KI-Clients, die über OAuth bei OpenSEO angemeldet sind.",
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
};
