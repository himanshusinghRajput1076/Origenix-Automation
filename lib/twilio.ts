import twilio from "twilio";

function client() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio is not configured");
  return twilio(sid, token);
}

export async function placeVoiceCall(args: { to: string; deliveryId: string }) {
  const from = process.env.TWILIO_FROM_NUMBER;
  const baseUrl = process.env.APP_BASE_URL;
  if (!from || !baseUrl) throw new Error("Twilio from number or APP_BASE_URL missing");

  return client().calls.create({
    to: args.to,
    from,
    url: `${baseUrl}/api/voice/twiml?deliveryId=${encodeURIComponent(args.deliveryId)}`,
    statusCallback: `${baseUrl}/api/webhooks/twilio/status`,
    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"]
  });
}
