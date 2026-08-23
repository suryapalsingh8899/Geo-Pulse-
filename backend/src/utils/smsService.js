// Helper to send SMS via Fast2SMS
export const sendSmsOtp = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ FAST2SMS_API_KEY not configured, skipping SMS dispatch.");
    return { success: false, message: "SMS API Key not configured" };
  }

  // Clean phone number (extract 10 digits)
  const cleanPhone = phone.toString().replace(/\D/g, "").slice(-10);

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp.toString(),
        numbers: cleanPhone,
      }),
    });

    const data = await response.json();
    console.log(`📱 Fast2SMS response for ${cleanPhone}:`, data);

    if (data.return === true) {
      return { success: true, data };
    } else {
      // Fallback to quick route if otp route template isn't default
      const fallbackRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: `Your OTP for Geo-Pulse is ${otp}. Valid for 10 minutes.`,
          numbers: cleanPhone,
        }),
      });
      const fallbackData = await fallbackRes.json();
      console.log(`📱 Fast2SMS Quick route response for ${cleanPhone}:`, fallbackData);
      return { success: fallbackData.return === true, data: fallbackData };
    }
  } catch (error) {
    console.error("Fast2SMS dispatch error:", error.message);
    return { success: false, message: error.message };
  }
};
