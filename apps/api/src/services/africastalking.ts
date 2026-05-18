import axios from "axios";

const AT_BASE_URL = "https://api.africastalking.com/version1";

// Send SMS via Africa's Talking
export async function sendSMS(params: {
  to: string;       // +255xxxxxxxxx
  message: string;
}): Promise<{ messageId: string; status: string }> {
  const response = await axios.post(
    `${AT_BASE_URL}/messaging`,
    new URLSearchParams({
      username: process.env.AT_USERNAME || "sandbox",
      to: params.to,
      message: params.message,
      from: process.env.AT_SENDER_ID || "SOKOLINK",
    }),
    {
      headers: {
        apiKey: process.env.AT_API_KEY!,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const recipient = response.data.SMSMessageData?.Recipients?.[0];
  return {
    messageId: recipient?.messageId || "",
    status: recipient?.status || "error",
  };
}

// Generate and send OTP
export async function sendOTP(phone: string): Promise<{ code: string; messageId: string }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `Soko Link: Namba yako ya OTP ni ${code}. Itatumika kwa dakika 10. Usimpe mtu yeyote. - SokoLink`;

  const result = await sendSMS({ to: phone, message });

  return { code, messageId: result.messageId };
}

// Send order notification to customer
export async function sendOrderConfirmation(params: {
  phone: string;
  orderId: string;
  amount: number;
}): Promise<void> {
  const message = `Soko Link: Agizo lako ${params.id} la TZS ${params.amount.toLocaleString()} limethibitishwa! Utapata arifa wakati bidhaa inasafirishwa. Asante! - SokoLink`;
  await sendSMS({ to: params.phone, message });
}

// Notify seller of new order
export async function sendSellerOrderAlert(params: {
  phone: string;
  orderId: string;
  itemCount: number;
  amount: number;
}): Promise<void> {
  const message = `Soko Link: Una agizo jipya! ${params.itemCount} bidhaa - TZS ${params.amount.toLocaleString()}. Nenda kwenye dashibodi yako. ID: ${params.orderId} - SokoLink`;
  await sendSMS({ to: params.phone, message });
}
