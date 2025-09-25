import africastalking from 'africastalking';

const AT_API_KEY = process.env.AT_API_KEY;
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_FROM = process.env.AT_FROM; // optional short code or sender ID

let atClient: ReturnType<typeof africastalking> | null = null;

function getAtClient() {
  if (!AT_API_KEY || !AT_USERNAME) return null;
  if (!atClient) {
    atClient = africastalking({ apiKey: AT_API_KEY, username: AT_USERNAME });
  }
  return atClient;
}

export async function sendOtpSms(phoneE164: string, otpCode: string): Promise<void> {
  const client = getAtClient();
  const message = `Your OTP code is ${otpCode}. It will expire in 5 minutes.`;
  if (!client) {
    console.log(`[SMS:DEV] Would send OTP ${otpCode} to ${phoneE164}`);
    return;
  }
  const sms = client.SMS;
  await sms.send({ to: phoneE164, message, from: AT_FROM });
}

export function toE164(normalizedDigits: string, defaultCountryCode: string = '254'): string {
  // If already looks like E.164 without '+', assume includes country code
  if (normalizedDigits.length >= 10 && normalizedDigits.startsWith(defaultCountryCode)) {
    return `+${normalizedDigits}`;
  }
  // If local starts with leading 0, strip and add default country code
  if (normalizedDigits.startsWith('0')) {
    return `+${defaultCountryCode}${normalizedDigits.slice(1)}`;
  }
  // Fallback: just prepend '+'
  return `+${normalizedDigits}`;
}


