type TemplateComponent = {
  type: "body";
  parameters: Array<{ type: "text"; text: string }>;
};

export async function sendWhatsAppTemplate(args: {
  to: string;
  templateName: string;
  languageCode: string;
  variables?: string[];
}) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION ?? "v23.0";

  if (!token || !phoneNumberId) throw new Error("WhatsApp API is not configured");

  const components: TemplateComponent[] = args.variables?.length
    ? [{
        type: "body",
        parameters: args.variables.map(text => ({ type: "text", text }))
      }]
    : [];

  const response = await fetch(
    `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: args.to.replace("+", ""),
        type: "template",
        template: {
          name: args.templateName,
          language: { code: args.languageCode },
          ...(components.length ? { components } : {})
        }
      })
    }
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "WhatsApp send failed");
  }
  return payload as { messages?: Array<{ id: string }> };
}
