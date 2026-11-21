import { settingsDetailsEn } from "./settingsDetails.en";
export const settingsEn = {
  every_app: {
    title: "Every App",
    description:
      "Your account, teammates and AI connections are managed on Every App.",
    open_button: "Open Every App →",
  },
  connected_agents_connected: "Connected",
  crawler_access: {
    form: {
      domain_required: "Enter a domain.",
      input_required: "Enter Signature-Input.",
      input_expired:
        "This signature has already expired. Create a new one in Shopify admin.",
      sig_required: "Enter Signature.",
      success: "Crawler access saved for {host}",
      err_wrong_domain:
        "This signature was created for {signedHost}, not {host}. In Shopify admin, create a signature for {host}.",
      err_rejected:
        "Shopify won't accept this signature for {host}. Check that you created it for {host} and copied both values in full.",
      needs_setup: "Crawler access isn't set up yet.",
      domain_label: "Domain",
      domain_placeholder: "store.example.com",
      input_label: "Signature-Input",
      input_placeholder: "sig1=(...);expires=...",
      sig_label: "Signature",
      sig_desc:
        "Shopify also shows a Signature-Agent value. You don't need to paste it: OpenSEO sends it with every request.",
      sig_placeholder: "sig1=:...:",
      submit: "Save signature",
    },
    connect: "Connect",
    table: {
      remove_success: "Crawler access removed",
      domain: "Domain",
      type: "Type",
      type_shopify: "Shopify signature",
      added: "Added",
      expires: "Expires",
      unknown: "Unknown",
      expired: "Expired",
      remove_label: "Remove crawler access for {host}",
    },
    title: "Shopify",
    cancel: "Cancel",
    desc: "Let the audit crawler through Shopify. Paste the signature you created in Shopify admin under Online Store → Preferences → Crawler access. Every audit of that domain in your organization sends it with each request.",
    error_loading: "We couldn't load your crawler access.",
  },
  indexnow: {
    agent_copy_label: "Copy prompt",
    urls_required: "Enter at least one URL.",
    toasts: {
      failed: "Couldn't submit to IndexNow",
      submitted: "Submitted {count} URL(s)",
      skipped: "Skipped {count} URL(s) not on {domain}",
    },
    title: "IndexNow",
    error_loading: "Couldn't load IndexNow.",
    agent_prompt: "Submit the pages I just published to IndexNow.",
    description:
      "Tell Bing about new and updated pages as soon as you publish them, instead of waiting for it to crawl your site. Bing also powers DuckDuckGo and Yahoo results. Google doesn't use IndexNow.",
    add_website_hint: "Add your website in General settings to use IndexNow.",
    setup_button: "Set up IndexNow",
    step2_title: "Submit pages when you publish or update them",
    step2_desc: "Paste just the pages that changed, not your whole site.",
    urls_label: "URLs (one per line)",
    submit: "Submit to IndexNow",
    agent_hint: "Or ask your agent:",
    agent_copy_success: "Prompt copied",
    agent_subhint:
      "If it can edit your site's code, it can add the key file too.",
    step1_title_verified: "Your key file is set up",
    step1_title_pending: "Add this key file to your site",
    download_key_file: "Download key file",
    key_file_location: "Put it at the root of your site, so it opens at:",
    check_again: "Check again",
    how_to_add_title: "How do I add a file to my site?",
    how_to_add_code:
      "Site built from code: put the file in the folder your site serves as-is, often called public or static.",
    how_to_add_wordpress:
      "WordPress: upload it with your host's file manager or SFTP to the folder that holds wp-config.php. SEO plugins like Rank Math can also submit to IndexNow for you.",
    how_to_add_cloudflare:
      "On Cloudflare: turn on Crawler Hints in Cloudflare's caching settings and it submits changed pages to IndexNow for you.",
    how_to_add_builders:
      "Website builders like Webflow, Shopify, Squarespace and Wix usually don't let you add files at the root. Check whether yours already supports IndexNow.",
    status: {
      found: "Found",
      missing: "Not found",
      wrong_content: "Should contain only the key",
      redirects: "Redirects. The file must load at this address itself",
      moved: "Redirects to another address",
      unreachable: "Couldn't reach this address",
      unknown: "Couldn't check right now",
    },
  },
  api_keys: {
    revoke_dialog: {
      success: "API key revoked",
      title: "Revoke API key",
      confirm: "Revoke",
      desc: "Are you sure you want to revoke “{name}”? Any client using this key will immediately lose access.",
    },
    title: "API keys",
    subtitle: "Authenticate MCP clients when OAuth doesn't work",
    helper:
      "Use this for remote agents like Hermes where the normal login flow doesn't work.",
    setup_guide: "Setup guide",
    create_button: "Create API key",
    error_loading: "We couldn't load your API keys.",
    empty: "No API keys yet.",
    table: {
      name: "Name",
      key: "Key",
      organization: "Organization",
      created: "Created",
      last_used: "Last used",
      unnamed: "Unnamed key",
      never: "Never",
      actions_label: "Actions for {name}",
      revoke: "Revoke",
      copied: "Key copied",
    },
    create_dialog: {
      save_title: "Save your API key",
      save_desc:
        "Make sure to copy your API key now. You won't be able to see it again.",
      copy: "Copy",
      done: "Done",
      title: "Create API key",
      name_label: "Name",
      name_placeholder: "e.g. Claude Desktop, Hermes",
      cancel: "Cancel",
      submit: "Create key",
    },
  },
  connected_agents_success: "Agent disconnected",
  connected_agents_title: "Connected agents",
  connected_agents_desc:
    "AI clients signed in to OpenSEO with OAuth or added through Stripe Projects.",
  connected_agents_error: "We couldn't load your connected agents.",
  connected_agents_empty: "No agents connected yet.",
  connected_agents_client: "Client",
  connected_agents_organization: "Organization",
  connected_agents_actions: "Actions for",
  connected_agents_disconnect: "Disconnect",
  connected_agents_disconnect_title: "Disconnect “{name}”?",
  connected_agents_disconnect_confirm: "Disconnect",
  connected_agents_disconnect_warning:
    "It will have to sign in to OpenSEO again.",
  connected_agents_disconnect_stripe_warning:
    "Stripe can't create new keys, and the keys it created stop working. Run stripe projects add openseo/api to connect again.",
  privacy_updates_error: "We couldn't save your email choice.",
  privacy_title: "Privacy and emails",
  privacy_analytics: "Usage analytics",
  privacy_analytics_desc:
    "Share usage analytics and session replays to help improve OpenSEO.",
  privacy_analytics_label: "Share usage analytics",
  privacy_updates: "Product updates",
  privacy_updates_desc:
    "Occasional emails about new features and tips. Unsubscribe anytime.",
  privacy_updates_label: "Get product update emails",
  appearance: "Appearance",
  theme: "Theme",
  language: "Language",
  language_desc: "Choose your preferred interface language.",
  about: "About",
  version: "Version",
  personal: "Personal",
  organization: "Organization",
  title: "Settings",
  sections: "Settings sections",
  details: settingsDetailsEn,
  import_from_self_hosted_openseo: "Import from self-hosted OpenSEO",
  bring_over_the_projects_history_and_chats:
    "Bring over the projects, history and chats from an OpenSEO you host yourself.",
  import: "Import",
  copies_its_projects_and_their_history_here:
    "Copies its projects and their history here.",
  create_a_transfer_code: "Create a transfer code",
  transfer_code_copied: "Transfer code copied",
  copy_transfer_code: "Copy transfer code",
  works_once_for_24_hours: "Works once, for 24 hours.",
  create_code: "Create code",
  a_move_is_already_running_try_again:
    "A move is already running. Try again once it finishes.",
  paste_it_in_your_self_hosted_openseo: "Paste it in your self-hosted OpenSEO",
  settings_move_to_every_app_i_have:
    "Settings → Move to Every App → I have a Gateway",
  done: "Done",
  cancel: "Cancel",
  update_your_self_hosted_openseo_to_v:
    "Update your self-hosted OpenSEO to v{version}",
  move_to_every_app: "Move to Every App",
  get_team_sign_in_and_all_your:
    "Get team sign-in and all your apps in one place. Every project, history and chat moves over intact.",
  about_every_app: "About Every App",
  copies_your_projects_and_their_history_to:
    "Copies your projects and their history to OpenSEO on your Gateway. Nothing is removed here.",
  do_you_already_have_an_every_app: "Do you already have an Every App Gateway?",
  set_up_my_gateway: "Set up my Gateway",
  i_have_a_gateway: "I have a Gateway",
  stop: "Stop",
  get_every_app: "Get Every App",
  create_your_gateway: "Create your Gateway",
  needs: "Needs",
  and_a_domain_on_cloudflare_dns: "and a domain on Cloudflare DNS.",
  my_gateway_is_ready: "My Gateway is ready",
  install_openseo_on_your_gateway: "Install OpenSEO on your Gateway",
  make_a_transfer_code: "Make a transfer code",
  in_openseo_on_your_gateway_open_settings:
    "In OpenSEO on your Gateway, open Settings and click Import from self-hosted OpenSEO.",
  paste_the_code_here: "Paste the code here",
  transfer_code: "Transfer code",
  move_my_data: "Move my data",
  moving_projects_and_history: "Moving projects and history",
  moving_sam_chats: "Moving SAM chats",
  moving_audit_and_export_files: "Moving audit and export files",
  keep_this_page_open_until_it_finishes:
    "Keep this page open until it finishes.",
  your_data_is_on_every_app: "Your data is on Every App.",
  everyone_connects_google_again_there_for_search:
    "Everyone connects Google again there for Search Console and Analytics.",
  this_install_still_runs_scheduled_checks_turn:
    "This install still runs scheduled checks. Turn it off once you're happy with the move, or they'll run twice.",
  open_openseo_on_your_gateway: "Open OpenSEO on your Gateway →",
  count_files: "{count} files",
  that_isn_t_a_transfer_code_copy:
    "That isn't a transfer code. Copy it again from OpenSEO on your Gateway.",
  this_code_expired_was_used_or_was:
    "This code expired, was used or was replaced. Make a new one and try again.",
  this_install_and_your_gateway_run_different:
    "This install and your Gateway run different OpenSEO versions. Update both to the latest release, then try again.",
  an_audit_or_check_is_still_running:
    "An audit or check is still running here. Try again once it finishes.",
  this_install_has_more_than_one_organization:
    "This install has more than one organization, and a move can only take one.",
  couldn_t_reach_openseo_on_your_gateway:
    "Couldn't reach OpenSEO on your Gateway. Check it's installed and up to date, then try again.",
};
