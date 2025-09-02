import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <div
        style={{
          background: "linear-gradient(135deg, var(--cream-white) 0%, #f5f5dc 100%)",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(139, 69, 19, 0.2)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2>Thank You for Registering!</h2>
        <p>
          Your application has been successfully submitted to the African Cup Political Party. We'll be in touch soon to
          welcome you to the ACUP community and provide you with next steps for your journey as a Pan-African leader.
        </p>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-dark)",
            opacity: 0.8,
            marginBottom: "2rem",
          }}
        >
          You should receive a confirmation email within the next few minutes. If you don't see it, please check your
          spam folder.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="cta-button">
            Return to Home
          </Link>
          <Link href="/membership" className="cta-button secondary">
            Learn More About ACUP
          </Link>
        </div>
      </div>
    </div>
  )
}
