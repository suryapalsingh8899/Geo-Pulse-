async function test() {
  const apiKey = 'txb_JneK1AXgMEibMKM52qpjYsdowsRP3dUx';
  const deviceId = '6a9e7de9ccb6c727099fa1b9';
  const phone = '+919999999999';
  try {
    const res = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ recipients: [phone], message: 'Test message' })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', data);
  } catch (e) {
    console.error(e);
  }
}
test();
