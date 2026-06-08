import axios from "axios";

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// Get OAuth access token from M-Pesa
async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  return response.data.access_token;
}

// Generate the M-Pesa password (base64 of shortcode + passkey + timestamp)
function generatePassword(timestamp: string): string {
  const str = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(str).toString("base64");
}

// Format timestamp: YYYYMMDDHHmmss
function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

// STK Push — sends payment prompt to customer's phone
export async function stkPush(params: {
  phoneNumber: string; // +255xxxxxxxxx format
  amount: number;      // TZS amount (integer)
  orderId: string;
  description: string;
}): Promise<{
  checkoutRequestId: string;
  merchantRequestId: string;
  responseCode: string;
  responseDescription: string;
}> {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);

  // Remove +255 and ensure format 2557XXXXXXXX
  const phone = params.phoneNumber.replace("+", "").replace(/^0/, "255");

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(params.amount),
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: params.orderId,
    TransactionDesc: params.description.slice(0, 13), // M-Pesa max 13 chars
  };

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    checkoutRequestId: response.data.CheckoutRequestID,
    merchantRequestId: response.data.MerchantRequestID,
    responseCode: response.data.ResponseCode,
    responseDescription: response.data.ResponseDescription,
  };
}

// Query STK Push status (polling fallback)
export async function querySTKStatus(checkoutRequestId: string) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

// Parse M-Pesa callback body
export function parseMpesaCallback(body: Record<string, unknown>): {
  success: boolean;
  resultCode: number;
  resultDesc: string;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
  amount?: number;
  checkoutRequestId: string;
} {
  const stk = (body.Body as Record<string, unknown>)?.stkCallback as Record<string, unknown>;
  const resultCode = stk?.ResultCode as number;
  const resultDesc = stk?.ResultDesc as string;
  const checkoutRequestId = stk?.CheckoutRequestID as string;

  if (resultCode !== 0) {
    return { success: false, resultCode, resultDesc, checkoutRequestId };
  }

  const items = ((stk?.CallbackMetadata as Record<string, unknown>)?.Item as Array<{
    Name: string; Value: string | number;
  }>) || [];

  const get = (name: string) => items.find((i) => i.Name === name)?.Value;

  return {
    success: true,
    resultCode,
    resultDesc,
    checkoutRequestId,
    mpesaReceiptNumber: get("MpesaReceiptNumber") as string,
    transactionDate: get("TransactionDate") as string,
    phoneNumber: get("PhoneNumber") as string,
    amount: get("Amount") as number,
  };
}
