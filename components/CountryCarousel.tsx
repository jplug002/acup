import Image from "next/image"

const CountryCarousel = () => {
  const countries = [
    { name: "Ghana", image: "/ghana.jpg" },
    { name: "South Africa", image: "/south africa.jpg" },
    { name: "Guinea", image: "/guinea.jpg" },
    { name: "Côte d'Ivoire", image: "/cotedevoir.jpg" },
  ]

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-800">
          ACUP Across Africa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={country.image || "/placeholder.svg"}
                  alt={`ACUP in ${country.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-center text-gray-800">{country.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CountryCarousel
