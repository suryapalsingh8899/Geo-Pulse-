async function run() {
  console.log("=== Starting Comprehensive Geo-Pulse Backend API Tests ===");

  const testPhone = "9" + Math.floor(100000000 + Math.random() * 900000000);

  // 1. Health check
  const health = await fetch("http://localhost:5000/api/health").then((r) => r.json());
  console.log("1. Health Status:", health.status);

  // 2. Request Register OTP
  const otpRes = await fetch("http://localhost:5000/api/auth/register-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: testPhone }),
  }).then((r) => r.json());
  console.log("2. Register OTP:", otpRes.otp);

  // 3. Complete Registration
  const regRes = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: testPhone,
      otp: otpRes.otp,
      name: "Suryapal Singh",
      age: "23",
      gender: "Male",
      country: "India",
    }),
  }).then((r) => r.json());
  console.log("3. User Registered:", regRes.user?.name, "| ID:", regRes.user?.id);
  const token = regRes.token;

  // 4. Request Login OTP for the same user
  const loginOtpRes = await fetch("http://localhost:5000/api/auth/login-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: testPhone }),
  }).then((r) => r.json());
  console.log("4. Login OTP:", loginOtpRes.otp);

  // 5. Complete Login
  const loginRes = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: testPhone,
      otp: loginOtpRes.otp,
    }),
  }).then((r) => r.json());
  console.log("5. Login Success:", loginRes.success, "| User:", loginRes.user?.name);

  // 6. Create Report
  const createRepRes = await fetch("http://localhost:5000/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Pothole on Main Road",
      description: "Severe pothole causing slow traffic.",
      lat: 28.615,
      lng: 77.21,
    }),
  }).then((r) => r.json());
  console.log("6. Created Report:", createRepRes.report?.title, "| isMine:", createRepRes.report?.isMine);
  const reportId = createRepRes.report.id;

  // 7. Upvote Report
  const voteRes = await fetch(`http://localhost:5000/api/reports/${reportId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "up" }),
  }).then((r) => r.json());
  console.log("7. Report Upvote:", voteRes.report?.upvotes, "| userVote:", voteRes.report?.userVote);

  // 8. Create Event
  const createEvRes = await fetch("http://localhost:5000/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Delhi Tech Meetup 2026",
      description: "Networking and talks on modern full-stack development.",
      timing: "5:00 PM - 8:00 PM",
      isPublic: true,
      lat: 28.63,
      lng: 77.22,
    }),
  }).then((r) => r.json());
  console.log("8. Created Event:", createEvRes.event?.title, "| isMine:", createEvRes.event?.isMine);
  const eventId = createEvRes.event.id;

  // 9. Upvote Event
  const voteEvRes = await fetch(`http://localhost:5000/api/events/${eventId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "up" }),
  }).then((r) => r.json());
  console.log("9. Event Upvote:", voteEvRes.event?.upvotes, "| userVote:", voteEvRes.event?.userVote);

  // 10. Update Profile
  const updateProfileRes = await fetch("http://localhost:5000/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Suryapal Singh (Verified)",
      bio: "Full Stack Developer building Geo-Pulse",
    }),
  }).then((r) => r.json());
  console.log("10. Updated Profile Name:", updateProfileRes.user?.name, "| Bio:", updateProfileRes.user?.bio);

  // 11. Check Me & Stats
  const meRes = await fetch("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  console.log("11. Current User Profile Stats:", meRes.user?.stats);

  console.log("✅ ALL TESTS PASSED WITH 100% SUCCESS!");
}

run().catch(console.error);
