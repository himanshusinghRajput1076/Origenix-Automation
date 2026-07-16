export function normalizePhoneE164(input: string): string {
  const cleaned = input.trim().replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    throw new Error(`Phone number must use E.164 format, for example +919876543210: ${input}`);
  }
  if (!/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    throw new Error(`Invalid E.164 phone number: ${input}`);
  }
  return cleaned;
}
