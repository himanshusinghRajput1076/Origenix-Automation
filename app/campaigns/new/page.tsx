export default function NewCampaignPage() {
  return (
    <main>
      <h1>Create campaign</h1>
      <div className="card">
        <form action="/api/campaigns" method="post">
          <label>Name<input name="name" required /></label>
          <label>Channel
            <select name="channel" required>
              <option value="WHATSAPP">WhatsApp template</option>
              <option value="VOICE">Automated voice message</option>
            </select>
          </label>
          <label>WhatsApp template name<input name="templateName" placeholder="approved_template_name" /></label>
          <label>Template language<input name="templateLanguage" defaultValue="en" /></label>
          <label>Template variables (comma separated)<input name="templateVariables" placeholder="{{1}},{{2}} values" /></label>
          <label>Voice message<textarea name="voiceMessage" rows={5} placeholder="Hello. This is an update from Origenix..." /></label>
          <button type="submit">Create campaign</button>
        </form>
      </div>
    </main>
  );
}
