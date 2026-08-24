import React, { useState, useEffect } from "react";

const RegisterButton = ({
  onClick,
  showModal,
  onClose,
  onSubmit,
  formData,
  onChange,
  step,
  onNext,
  onResend,
}) => {
  const [timer, setTimer] = useState(0);
  const [resendCount, setResendCount] = useState(1);

  useEffect(() => {
    if (!showModal) {
      setTimer(0);
      setResendCount(1);
    } else if (step === 2 && resendCount === 1 && timer === 0) {
      setTimer(30);
    }
  }, [showModal, step]);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && step === 2) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleResend = () => {
    if (timer === 0) {
      if (onResend) onResend();
      setResendCount((prev) => prev + 1);
      setTimer(30);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={onClick}>
        Register
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-card">
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
            <h2 className="modal-title">Create Account</h2>
            <p className="modal-subtitle">
              Join Geo Pulse to unlock the world.
            </p>

            {step === 1 ? (
              <form onSubmit={onNext} className="registration-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={onChange}
                    required
                    placeholder="25"
                    min="1"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                    required
                    style={{
                      background: "var(--input-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "0.8rem 1rem",
                      color: "var(--text-color)",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male" style={{ background: "var(--bg-color)" }}>
                      Male
                    </option>
                    <option value="female" style={{ background: "var(--bg-color)" }}>
                      Female
                    </option>
                    <option value="other" style={{ background: "var(--bg-color)" }}>
                      Other
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={onChange}
                    required
                    style={{
                      background: "var(--input-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "0.8rem 1rem",
                      color: "var(--text-color)",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {[
                      "Afghanistan",
                      "Albania",
                      "Algeria",
                      "Andorra",
                      "Angola",
                      "Antigua and Barbuda",
                      "Argentina",
                      "Armenia",
                      "Australia",
                      "Austria",
                      "Azerbaijan",
                      "Bahamas",
                      "Bahrain",
                      "Bangladesh",
                      "Barbados",
                      "Belarus",
                      "Belgium",
                      "Belize",
                      "Benin",
                      "Bhutan",
                      "Bolivia",
                      "Bosnia and Herzegovina",
                      "Botswana",
                      "Brazil",
                      "Brunei",
                      "Bulgaria",
                      "Burkina Faso",
                      "Burundi",
                      "Cabo Verde",
                      "Cambodia",
                      "Cameroon",
                      "Canada",
                      "Central African Republic",
                      "Chad",
                      "Chile",
                      "China",
                      "Colombia",
                      "Comoros",
                      "Congo, Democratic Republic of the",
                      "Congo, Republic of the",
                      "Costa Rica",
                      "Croatia",
                      "Cuba",
                      "Cyprus",
                      "Czech Republic",
                      "Denmark",
                      "Djibouti",
                      "Dominica",
                      "Dominican Republic",
                      "Ecuador",
                      "Egypt",
                      "El Salvador",
                      "Equatorial Guinea",
                      "Eritrea",
                      "Estonia",
                      "Eswatini",
                      "Ethiopia",
                      "Fiji",
                      "Finland",
                      "France",
                      "Gabon",
                      "Gambia",
                      "Georgia",
                      "Germany",
                      "Ghana",
                      "Greece",
                      "Grenada",
                      "Guatemala",
                      "Guinea",
                      "Guinea-Bissau",
                      "Guyana",
                      "Haiti",
                      "Honduras",
                      "Hungary",
                      "Iceland",
                      "India",
                      "Indonesia",
                      "Iran",
                      "Iraq",
                      "Ireland",
                      "Israel",
                      "Italy",
                      "Jamaica",
                      "Japan",
                      "Jordan",
                      "Kazakhstan",
                      "Kenya",
                      "Kiribati",
                      "Korea, North",
                      "Korea, South",
                      "Kosovo",
                      "Kuwait",
                      "Kyrgyzstan",
                      "Laos",
                      "Latvia",
                      "Lebanon",
                      "Lesotho",
                      "Liberia",
                      "Libya",
                      "Liechtenstein",
                      "Lithuania",
                      "Luxembourg",
                      "Madagascar",
                      "Malawi",
                      "Malaysia",
                      "Maldives",
                      "Mali",
                      "Malta",
                      "Marshall Islands",
                      "Mauritania",
                      "Mauritius",
                      "Mexico",
                      "Micronesia",
                      "Moldova",
                      "Monaco",
                      "Mongolia",
                      "Montenegro",
                      "Morocco",
                      "Mozambique",
                      "Myanmar",
                      "Namibia",
                      "Nauru",
                      "Nepal",
                      "Netherlands",
                      "New Zealand",
                      "Nicaragua",
                      "Niger",
                      "Nigeria",
                      "North Macedonia",
                      "Norway",
                      "Oman",
                      "Pakistan",
                      "Palau",
                      "Palestine",
                      "Panama",
                      "Papua New Guinea",
                      "Paraguay",
                      "Peru",
                      "Philippines",
                      "Poland",
                      "Portugal",
                      "Qatar",
                      "Romania",
                      "Russia",
                      "Rwanda",
                      "Saint Kitts and Nevis",
                      "Saint Lucia",
                      "Saint Vincent and the Grenadines",
                      "Samoa",
                      "San Marino",
                      "Sao Tome and Principe",
                      "Saudi Arabia",
                      "Senegal",
                      "Serbia",
                      "Seychelles",
                      "Sierra Leone",
                      "Singapore",
                      "Slovakia",
                      "Slovenia",
                      "Solomon Islands",
                      "Somalia",
                      "South Africa",
                      "South Sudan",
                      "Spain",
                      "Sri Lanka",
                      "Sudan",
                      "Suriname",
                      "Sweden",
                      "Switzerland",
                      "Syria",
                      "Taiwan",
                      "Tajikistan",
                      "Tanzania",
                      "Thailand",
                      "Timor-Leste",
                      "Togo",
                      "Tonga",
                      "Trinidad and Tobago",
                      "Tunisia",
                      "Turkey",
                      "Turkmenistan",
                      "Tuvalu",
                      "Uganda",
                      "Ukraine",
                      "United Arab Emirates",
                      "United Kingdom",
                      "United States",
                      "Uruguay",
                      "Uzbekistan",
                      "Vanuatu",
                      "Vatican City",
                      "Venezuela",
                      "Vietnam",
                      "Yemen",
                      "Zambia",
                      "Zimbabwe",
                    ].map((country) => (
                      <option
                        key={country}
                        value={country}
                        style={{ background: "var(--bg-color)" }}
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone No</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={onChange}
                      style={{
                        width: "80px",
                        background: "var(--input-bg)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "12px",
                        padding: "0.8rem 0.5rem",
                        color: "var(--text-color)",
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    >
                      {[
                        "+1",
                        "+7",
                        "+20",
                        "+27",
                        "+30",
                        "+31",
                        "+32",
                        "+33",
                        "+34",
                        "+36",
                        "+39",
                        "+40",
                        "+41",
                        "+43",
                        "+44",
                        "+45",
                        "+46",
                        "+47",
                        "+48",
                        "+49",
                        "+51",
                        "+52",
                        "+53",
                        "+54",
                        "+55",
                        "+56",
                        "+57",
                        "+58",
                        "+60",
                        "+61",
                        "+62",
                        "+63",
                        "+64",
                        "+65",
                        "+66",
                        "+81",
                        "+82",
                        "+84",
                        "+86",
                        "+90",
                        "+91",
                        "+92",
                        "+93",
                        "+94",
                        "+95",
                        "+98",
                        "+212",
                        "+213",
                        "+216",
                        "+218",
                        "+220",
                        "+221",
                        "+222",
                        "+223",
                        "+224",
                        "+225",
                        "+226",
                        "+227",
                        "+228",
                        "+229",
                        "+230",
                        "+231",
                        "+232",
                        "+233",
                        "+234",
                        "+235",
                        "+236",
                        "+237",
                        "+238",
                        "+239",
                        "+240",
                        "+241",
                        "+242",
                        "+243",
                        "+244",
                        "+245",
                        "+246",
                        "+248",
                        "+249",
                        "+250",
                        "+251",
                        "+252",
                        "+253",
                        "+254",
                        "+255",
                        "+256",
                        "+257",
                        "+258",
                        "+260",
                        "+261",
                        "+262",
                        "+263",
                        "+264",
                        "+265",
                        "+266",
                        "+267",
                        "+268",
                        "+269",
                        "+290",
                        "+291",
                        "+297",
                        "+298",
                        "+299",
                        "+350",
                        "+351",
                        "+352",
                        "+353",
                        "+354",
                        "+355",
                        "+356",
                        "+357",
                        "+358",
                        "+359",
                        "+370",
                        "+371",
                        "+372",
                        "+373",
                        "+374",
                        "+375",
                        "+376",
                        "+377",
                        "+378",
                        "+380",
                        "+381",
                        "+382",
                        "+383",
                        "+385",
                        "+386",
                        "+387",
                        "+389",
                        "+420",
                        "+421",
                        "+423",
                        "+500",
                        "+501",
                        "+502",
                        "+503",
                        "+504",
                        "+505",
                        "+506",
                        "+507",
                        "+508",
                        "+509",
                        "+590",
                        "+591",
                        "+592",
                        "+593",
                        "+594",
                        "+595",
                        "+596",
                        "+597",
                        "+598",
                        "+599",
                        "+670",
                        "+672",
                        "+673",
                        "+674",
                        "+675",
                        "+676",
                        "+677",
                        "+678",
                        "+679",
                        "+680",
                        "+681",
                        "+682",
                        "+683",
                        "+685",
                        "+686",
                        "+687",
                        "+688",
                        "+689",
                        "+690",
                        "+691",
                        "+692",
                        "+850",
                        "+852",
                        "+853",
                        "+855",
                        "+856",
                        "+880",
                        "+886",
                        "+960",
                        "+961",
                        "+962",
                        "+963",
                        "+964",
                        "+965",
                        "+966",
                        "+967",
                        "+968",
                        "+970",
                        "+971",
                        "+972",
                        "+973",
                        "+974",
                        "+975",
                        "+976",
                        "+977",
                        "+992",
                        "+993",
                        "+994",
                        "+995",
                        "+996",
                        "+998",
                      ].map((code) => (
                        <option
                          key={code}
                          value={code}
                          style={{ background: "var(--bg-color)" }}
                        >
                          {code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      required
                      placeholder="234 567 8900"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full form-submit-btn"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={onSubmit} className="registration-form">
                <div className="form-group">
                  <label htmlFor="otp">
                    Enter OTP sent to {formData.countryCode} {formData.phone}
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={onChange}
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    style={{
                      textAlign: "center",
                      letterSpacing: "0.5rem",
                      fontSize: "1.2rem",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full form-submit-btn"
                >
                  Verify & Register
                </button>
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: timer > 0 ? "#64748b" : "#38bdf8",
                      cursor: timer > 0 ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterButton;
