// Helper to send SMS via Textbee
export const sendSmsOtp = async (phone, otp) => {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    console.warn("⚠️ TEXTBEE_API_KEY or TEXTBEE_DEVICE_ID not configured, skipping SMS dispatch.");
    return { success: false, message: "Textbee configuration missing" };
  }

  // Clean phone number (extract 10 digits) and prepend +91 (assumed India)
  const cleanPhone = phone.toString().replace(/\D/g, "").slice(-10);
  const fullPhone = `+91${cleanPhone}`;

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
    console.log(`📱 Textbee response for ${fullPhone}:`, data);

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
