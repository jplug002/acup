export default function LeadershipPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Leadership</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Dedicated leaders committed to African unity and democratic progress
          </p>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Executive Leadership</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Leader Card 1 */}
              <div className="bg-white border-2 border-red-500 rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Party President</h3>
                  <p className="text-red-500 font-semibold mb-3">Chief Executive Officer</p>
                  <p className="text-gray-700 text-sm">
                    Leading the vision for African continental unity through democratic governance and progressive
                    policies.
                  </p>
                </div>
              </div>

              {/* Leader Card 2 */}
              <div className="bg-white border-2 border-red-500 rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Vice President</h3>
                  <p className="text-red-500 font-semibold mb-3">Deputy Leader</p>
                  <p className="text-gray-700 text-sm">
                    Supporting strategic initiatives and coordinating regional development programs across Africa.
                  </p>
                </div>
              </div>

              {/* Leader Card 3 */}
              <div className="bg-white border-2 border-red-500 rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Secretary General</h3>
                  <p className="text-red-500 font-semibold mb-3">Operations Director</p>
                  <p className="text-gray-700 text-sm">
                    Managing party operations and ensuring effective communication across all continental branches.
                  </p>
                </div>
              </div>
            </div>

            {/* Leadership Principles */}
            <div className="bg-red-500 text-white rounded-lg p-8 mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Leadership Principles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Servant Leadership</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Putting the needs of African people first</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Transparent and accountable governance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Empowering communities through participation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Visionary Direction</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Long-term strategic planning for Africa</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Innovation in democratic processes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span>Building bridges across cultures and nations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Leadership Development */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Leadership Development</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Training Programs</h3>
                  <p className="text-gray-700">
                    Comprehensive leadership development courses for emerging African leaders
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Mentorship</h3>
                  <p className="text-gray-700">Pairing experienced leaders with rising talents across the continent</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🌍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Exchange Programs</h3>
                  <p className="text-gray-700">Cross-cultural leadership exchanges to strengthen continental bonds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
