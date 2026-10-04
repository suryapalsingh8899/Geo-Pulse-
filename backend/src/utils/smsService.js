// Helper to send SMS via Textbee
// countryCode: e.g. "+91", "+1", "+44" — defaults to "+91" for backward compat
export const sendSmsOtp = async (phone, otp, countryCode = "+91") => {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    console.warn("⚠️ TEXTBEE_API_KEY or TEXTBEE_DEVICE_ID not configured, skipping SMS dispatch.");
    return { success: false, message: "Textbee configuration missing" };
  }

  // Sanitize inputs
  const sanitizedCode = (countryCode || "+91").trim();
  // Remove all non-digits from the phone, then strip any leading digits matching the country code
  const digitsOnly = phone.toString().replace(/\D/g, "");
  // Take last 10 digits for 10-digit countries; for other formats take all digits
  const cleanPhone = digitsOnly.slice(-10);
  const fullPhone = `${sanitizedCode}${cleanPhone}`;

  try {
    const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        recipients: [fullPhone],
        message: `Your OTP for Geo-Pulse is ${otp}. Valid for 10 minutes.`,
      }),
    });

    const data = await response.json();
    console.log(`📱 Textbee SMS → ${fullPhone} | Response:`, data);

    // Textbee returns { success: true, ... } if successful
    if (data.success || response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Failed to send SMS via Textbee" };
    }
  } catch (error) {
    console.error("Textbee dispatch error:", error.message);
    return { success: false, message: error.message };
  }
};

export const sendAlertSms = async (phones, alertTitle, alertSeverity) => {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    console.warn("⚠️ TEXTBEE_API_KEY or TEXTBEE_DEVICE_ID not configured, skipping alert SMS dispatch.");
    return { success: false };
  }

  // Filter and format phone numbers
  const validPhones = phones
    .filter(p => p && p.trim().length >= 10)
    .map(p => {
      const sanitized = p.toString().replace(/\D/g, "");
      return p.startsWith("+") ? p : `+91${sanitized.slice(-10)}`;
    });

  if (validPhones.length === 0) return { success: false, message: "No valid phone numbers." };

  try {
    const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        recipients: validPhones,
        message: `EMERGENCY ALERT: ${alertTitle} (${alertSeverity.toUpperCase()}). Please stay safe and check the Geo-Pulse app for more details.`,
      }),
    });

    const data = await response.json();
    console.log(`📱 Textbee SMS Alert → ${validPhones.length} recipients | Response:`, data);
    return { success: data.success || response.ok, data };
  } catch (error) {
    console.error("Textbee alert dispatch error:", error.message);
    return { success: false, message: error.message };
  }
};
