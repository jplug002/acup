import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, Lightbulb } from "lucide-react"

const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-blue-800">About Us</h2>
        
        <Card className="hover:shadow-lg transition-shadow bg-white border-gray-200 rounded-xl overflow-hidden">
          <div className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 px-6 text-center relative">
            <CardTitle className="text-2xl md:text-3xl font-bold">About ACUP</CardTitle>
            <Globe size={32} className="text-white absolute right-6 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Users size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  The ACUP is a unique African Political Party that many Africans identify themselves with, and in which
                  Africans worldwide find the hope to meet our common aspirations of freedom, prosperity and dignity. What
                  makes the ACUP unique is the fact that we do not fit into the standard of traditional political parties
                  funded and controlled by the system. Our party is funded and controlled by Africans who identify
                  themselves with it. In reality, this is the Africans' party.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Lightbulb size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  This party is inspired by the same philosophy of Marcus Garvey, Kwame Nkrumah, Patrice Lumumba, Thomas
                  Sankara and many others whose dedication to the cause of our liberation continues to light our minds
                  today. The choice of ACUP is not a choice for a particular leader, but it is a choice of the common
                  ideology, ambition and the vision upon which we are building the new world for us and our children.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Users size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  In other words, with ACUP there is no leader and follower, everyone who joins the party receives the
                  skills to become a potential leader. Essentially, everything Africa needs for its development is already
                  here, and the people that Africa needs for its new direction is just you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default AboutSection
