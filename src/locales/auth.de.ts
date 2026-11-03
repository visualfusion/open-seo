import { authDetailsDe } from "./authDetails.de";
export const authDe = {
  common: {
    terms_prefix: ", stimmst du unseren ",
    terms_link: "Nutzungsbedingungen",
    terms_and: " und der ",
    privacy_link: "Datenschutzerklärung",
    terms_suffix: " zu.",
    opening_google: "Google wird geöffnet...",
    continue_email: "Mit E-Mail fortfahren",
    email_invalid: "Gib eine gültige E-Mail-Adresse ein.",
    continue_google: "Mit Google fortfahren",
    by_continuing_google: "Wenn du mit Google fortfährst",
    email_label: "E-Mail-Adresse",
    email_placeholder: "E-Mail-Adresse...",
    password_label: "Passwort",
    password_placeholder: "Passwort...",
    back_to_sign_in: "Zurück zur Anmeldung",
    by_continuing: "Wenn du fortfährst",
    by_creating_account: "Wenn du ein Konto erstellst",
  },
  terms_banner: {
    failed: "Deine Zustimmung konnte nicht gespeichert werden.",
    prefix: "Wir haben unsere ",
    terms_link: "Nutzungsbedingungen",
    and: " und ",
    privacy_link: "Datenschutzerklärung",
    suffix: " aktualisiert (gültig ab {date}). Bitte prüfe und akzeptiere sie.",
    accept: "Akzeptieren",
  },
  password_rules: {
    min_length: "Das Passwort muss mindestens {min} Zeichen lang sein.",
    max_length: "Das Passwort darf maximal {max} Zeichen lang sein.",
  },
  google_auth: {
    sign_up_unavailable:
      "Die Registrierung mit Google ist derzeit nicht verfügbar.",
    sign_in_unavailable:
      "Die Anmeldung mit Google ist derzeit nicht verfügbar.",
  },
  onboarding: {
    gsc: {
      connect_google: "Mit Google verbinden",
      opening_google: "Google wird geöffnet…",
      title: "Google Search Console verbinden",
      subtitle:
        "Sieh, über welche Google-Suchanfragen Besucher auf deine Website gelangen.",
      check_failed: "Deine Google-Verbindung konnte nicht geprüft werden.",
      connected_to: "Verbunden mit ",
    },
    saving: "Wird gespeichert…",
    analytics: {
      save_failed_toast:
        "Deine E-Mail-Einstellung konnte nicht gespeichert werden. Du kannst sie in den Einstellungen ändern.",
      title: "Hilf mit, OpenSEO noch besser zu machen",
      subtitle_prefix:
        "Du kannst diese Einstellungen jederzeit ändern. Siehe unsere ",
      privacy_link: "Datenschutzerklärung",
      usage_title: "Nutzungsstatistiken",
      usage_desc:
        "Teile Nutzungsstatistiken und Sitzungsaufzeichnungen, um OpenSEO zu verbessern.",
      usage_aria: "Nutzungsstatistiken teilen",
      updates_title: "Produkt-Updates",
      updates_desc:
        "Gelegentliche E-Mails über neue Funktionen und Tipps. Abmeldung jederzeit möglich.",
      updates_aria: "E-Mails zu Produkt-Updates erhalten",
    },
    continue: "Weiter",
    steps_aria: "Onboarding-Schritte",
    step_aria: "Schritt {step}: {label}",
    step_website: "Website",
    step_gsc: "Google Search Console",
    step_preferences: "Einstellungen",
    step_agent: "Agenten-Einrichtung",
    failed_load_project: "Dein Projekt konnte nicht geladen werden.",
    checking: "Wird geprüft…",
    skip_for_now: "Vorerst überspringen",
    save_and_continue: "Speichern und weiter",
    website: {
      title: "Wie lautet deine Website?",
      subtitle: "Wir starten direkt ein Site-Audit für dich.",
      required: "Gib deine Website ein.",
      invalid: "Gib eine gültige Domain wie beispiel.de ein.",
      label: "Website",
      placeholder: "beispiel.de",
      choose_market: "Standardland & -sprache wählen",
    },
    back: "Zurück",
    skip: "Überspringen",
  },
  sign_in: {
    password_required: "Gib dein Passwort ein.",
    failed: "Anmeldung nicht möglich.",
    failed_retry: "Anmeldung derzeit nicht möglich. Bitte versuche es erneut.",
    title: "Anmelden",
    standalone_footer:
      "Du benötigst ein Konto? Bitte einen Administrator um eine Einladung. Passwort vergessen? Bitte deinen Server-Administrator, es zurückzusetzen.",
    forgot_password: "Passwort vergessen?",
    create_account: "Konto erstellen",
    submitting: "Anmeldung läuft...",
    submit: "Anmelden",
  },
  sign_up: {
    passwords_mismatch: "Die Passwörter stimmen nicht überein.",
    failed: "Konto konnte nicht erstellt werden.",
    failed_retry:
      "Konto konnte derzeit nicht erstellt werden. Bitte versuche es erneut.",
    created_sign_in: "Konto erstellt. Melde dich an, um fortzufahren.",
    closed_title: "Registrierung geschlossen",
    closed_helper: "Bitte einen Administrator um eine Einladung.",
    admin_title: "Admin-Konto erstellen",
    title: "Konto erstellen",
    admin_helper:
      "Diese Installation hat noch keine Konten. Das erste Konto wird zum Administrator.",
    invited_helper:
      "Verwende die E-Mail-Adresse, an die die Einladung gesendet wurde.",
    has_account: "Bereits ein Konto?",
    sign_in_link: "Anmelden",
    back_to_signup: "Zurück zur Registrierung",
    confirm_password_label: "Passwort bestätigen",
    confirm_password_placeholder: "Passwort bestätigen...",
    submitting: "Konto wird erstellt...",
    submit: "Konto erstellen",
  },
  oauth_consent: {
    scope_read_label: "Deine OpenSEO-Daten lesen",
    scope_read_desc: "Projekte, Keyword-Berichte und Audit-Ergebnisse.",
    scope_act_label: "In deinem Namen über MCP handeln",
    scope_act_desc:
      "Tools ausführen und Ergebnisse in diesem Workspace speichern.",
    failed: "Autorisierung konnte nicht abgeschlossen werden.",
    no_redirect: "Die Autorisierungsantwort enthielt keine Weiterleitungs-URL.",
    unreachable:
      "OpenSEO konnte nicht erreicht werden. Bitte versuche es erneut.",
    title: "MCP-Zugriff autorisieren",
    subtitle: "Ein MCP-Client fordert Zugriff auf deinen OpenSEO-Workspace an.",
    signed_in_as: "Angemeldet als",
    workspace: "Workspace",
    allow_heading: "Dies erlaubt der Anwendung:",
    opening_app: "Deine App wird geöffnet... Nicht geöffnet?",
    open_app: "App öffnen",
    canceling: "Wird abgebrochen...",
    cancel: "Abbrechen",
    authorizing: "Wird autorisiert...",
    authorize: "Autorisieren",
    disconnect_hint:
      "Du kannst die Verbindung jederzeit in den Einstellungen unter „Verbundene Agenten“ trennen.",
  },
  auth_error: {
    back_to_openseo: "Zurück zu OpenSEO",
    code_label: "Code: {error}",
  },
  accept_invitation: {
    youre_invited_title: "Du wurdest eingeladen",
    signed_out_desc:
      "Du wurdest eingeladen, einer Organisation bei OpenSEO beizutreten. Melde dich mit der E-Mail-Adresse an, die die Einladung erhalten hat, oder erstelle damit ein Konto, um anzunehmen.",
    not_found: "Einladung nicht gefunden",
    accept_failed: "Die Einladung konnte nicht angenommen werden.",
    accept_failed_retry:
      "Die Einladung konnte nicht angenommen werden. Bitte versuche es erneut.",
    decline_failed: "Die Einladung konnte nicht abgelehnt werden.",
    decline_failed_retry:
      "Die Einladung konnte nicht abgelehnt werden. Bitte versuche es erneut.",
    checking_title: "Einladung wird geprüft...",
    unavailable_title: "Einladung nicht verfügbar",
    unavailable_desc_prefix:
      "Diese Einladung ist möglicherweise abgelaufen, wurde zurückgezogen oder gehört zu einer anderen E-Mail-Adresse. Du bist angemeldet als ",
    unavailable_desc_2:
      "Falls die Einladung an eine andere Adresse gesendet wurde, melde dich ab und mit dieser E-Mail-Adresse wieder an. Andernfalls bitte dein Teammitglied um eine neue Einladung.",
    use_different_account: "Anderes Konto verwenden",
    go_to_dashboard: "Zum Dashboard",
    declined_title: "Einladung abgelehnt",
    declined_desc_prefix: "Du hast die Einladung zum Beitritt zu ",
    declined_desc_suffix: " abgelehnt.",
    join_title: "Organisation beitreten",
    invited_desc_middle: " hat dich eingeladen, ",
    invited_desc_suffix: " bei OpenSEO beizutreten.",
    joining: "Beitritt läuft...",
    accept: "Einladung annehmen",
    declining: "Wird abgelehnt...",
    decline: "Ablehnen",
  },
  forgot_password: {
    failed: "Die E-Mail zum Zurücksetzen konnte nicht gesendet werden.",
    failed_retry:
      "Die E-Mail zum Zurücksetzen konnte derzeit nicht gesendet werden. Bitte versuche es erneut.",
    check_email_title: "Prüfe dein E-Mail-Postfach",
    title: "Passwort vergessen",
    helper_hosted:
      "Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.",
    helper_operator:
      "Bitte deinen Server-Administrator, dein Passwort zurückzusetzen.",
    helper_unavailable:
      "Das Zurücksetzen des Passworts ist derzeit nicht verfügbar.",
    sent_desc:
      "Falls ein Konto für {email} existiert, erhältst du in Kürze eine E-Mail mit Anweisungen zum Zurücksetzen deines Passworts.",
    submitting: "Link wird gesendet...",
    submit: "Link zum Zurücksetzen senden",
  },
  reset_password: {
    invalid_token:
      "Dieser Link zum Zurücksetzen ist nicht mehr gültig. Fordere einen neuen Link an, um fortzufahren.",
    token_expired:
      "Dieser Link zum Zurücksetzen ist abgelaufen. Fordere einen neuen Link an, um fortzufahren.",
    generic_error:
      "Dieser Link zum Zurücksetzen kann nicht mehr verwendet werden. Fordere einen neuen Link an und versuche es erneut.",
    title: "Passwort zurücksetzen",
    unavailable_helper:
      "Das Zurücksetzen des Passworts ist derzeit nicht verfügbar.",
    updated_title: "Passwort aktualisiert",
    updated_helper:
      "Dein Passwort wurde aktualisiert. Melde dich mit deinem neuen Passwort an.",
    expired_title: "Link abgelaufen",
    choose_helper: "Wähle ein neues Passwort für dein Konto.",
    failed_retry:
      "Dein Passwort konnte derzeit nicht aktualisiert werden. Bitte versuche es erneut.",
    continue_sign_in: "Weiter zur Anmeldung",
    request_new: "Neuen Link anfordern",
    new_password_label: "Neues Passwort",
    new_password_placeholder: "Neues Passwort...",
    confirm_password_label: "Neues Passwort bestätigen",
    confirm_password_placeholder: "Neues Passwort bestätigen...",
    submitting: "Passwort wird aktualisiert...",
    submit: "Passwort aktualisieren",
  },
  verify_email: {
    invalid_token:
      "Dieser Link ist nicht mehr gültig. Fordere eine neue E-Mail an, um fortzufahren.",
    token_expired:
      "Dieser Link ist abgelaufen. Fordere eine neue E-Mail an, um fortzufahren.",
    user_not_found:
      "Dieses Konto wurde nicht mehr gefunden. Versuche, es erneut zu erstellen.",
    unknown_error:
      "Diese E-Mail-Adresse konnte nicht bestätigt werden. Fordere eine neue E-Mail an und versuche es erneut.",
    title: "E-Mail bestätigen",
    unavailable_helper: "Die E-Mail-Bestätigung ist derzeit nicht verfügbar.",
    failed_title: "Deine E-Mail-Adresse konnte nicht bestätigt werden",
    confirmed_title: "E-Mail bestätigt",
    confirmed_helper:
      "Alles bereit. Du wirst jetzt zu deinem Konto weitergeleitet.",
    checking_helper: "Deine E-Mail-Bestätigung wird geprüft.",
    verify_your_email: "Bestätige deine E-Mail-Adresse",
    sent_to_email:
      "Klicke auf den Link, den wir an {email} gesendet haben, um deine E-Mail-Adresse zu bestätigen.",
    check_inbox:
      "Prüfe dein Postfach auf den Link zur Bestätigung deiner E-Mail-Adresse.",
    resend_failed: "Es konnte keine weitere E-Mail gesendet werden.",
    resend_failed_retry:
      "Es konnte derzeit keine weitere E-Mail gesendet werden. Bitte versuche es erneut.",
    resent_toast: "Eine neue E-Mail ist unterwegs.",
    resending: "E-Mail wird gesendet...",
    resend: "E-Mail erneut senden",
  },
  details: authDetailsDe,
};
