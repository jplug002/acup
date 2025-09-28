import Link from "next/link"

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Lead Africa's Future?</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
          Join the movement of Africans worldwide who are building a new foundation for our continent. With ACUP,
          everyone receives the skills to become a potential leader. The people Africa needs for its new direction is
          just you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/membership"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center min-w-[200px]"
          >
            Join ACUP Today
          </Link>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 min-w-[200px]">
           <Link
            href="/leadership">
            Learn About Leadership
           </Link>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
