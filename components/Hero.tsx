import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="relative bg-blue-600 py-12 md:py-20">
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left space-y-6 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">WELCOME</h1>
          <div className="space-y-4">
            <p className="text-lg text-white">
              ACUP (African Continental Union Party) the first Pan-African political party transcending boundaries. This is time for Africans to unite and
              build, or disunite and perish.
            </p>
            <p className="text-base text-white/90">
              Welcome to the Africans' party, at home and abroad, this is the pathway to your origins and majesty.
            </p>
          </div>
          <Link
            href="/membership"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-red-700 transition"
          >
            Join Our Movement
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/hero_image-removebg-preview.png"
            alt="African Continent in ACUP Colors"
            width={400}
            height={400}
            className="w-64 md:w-96 h-auto drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
