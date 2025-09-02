import Image from "next/image"

const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-800">About Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              The ACUP is a unique African Political Party that many Africans identify themselves with, and in which
              Africans worldwide find the hope to meet our common aspirations of freedom, prosperity and dignity. What
              makes the ACUP unique is the fact that we do not fit into the standard of traditional political parties
              funded and controlled by the system. Our party is funded and controlled by Africans who identify
              themselves with it. In reality, this is the Africans' party.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              This party is inspired by the same philosophy of Marcus Garvey, Kwame Nkrumah, Patrice Lumumba, Thomas
              Sankara and many others whose dedication to the cause of our liberation continues to light our minds
              today. The choice of ACUP is not a choice for a particular leader, but it is a choice of the common
              ideology, ambition and the vision upon which we are building the new world for us and our children.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              In other words, with ACUP there is no leader and follower, everyone who joins the party receives the
              skills to become a potential leader. Essentially, everything Africa needs for its development is already
              here, and the people that Africa needs for its new direction is just you.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/africa countries.jpg"
                alt="African countries and communities"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
