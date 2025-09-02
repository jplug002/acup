import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="welcome-title">WELCOME</h1>
          <div className="welcome-content">
            <p className="hero-subtitle">
              The first Pan-African political party transcending boundaries. This is time for Africans to unite and
              build, or disunite and perish.
            </p>
            <p className="hero-description">
              Welcome to the Africans' party, at home and abroad, this is the pathway to your origins and majesty.
            </p>
          </div>
          <Link href="/membership" className="cta-button">
            Join Our Movement
          </Link>
        </div>
        <div className="hero-logo">
          <Image src="/ACUP LOGO.jpg" alt="ACUP Logo" width={400} height={400} className="hero-logo-img" priority />
        </div>
      </div>
    </section>
  )
}

export default Hero
