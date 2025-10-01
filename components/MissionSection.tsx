import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Target, BookOpen, Users, GraduationCap, Globe, Handshake } from "lucide-react"

const MissionSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-blue-700">Our Mission</h2>
        
        <Card className="hover:shadow-lg transition-shadow bg-white border-gray-200 rounded-xl overflow-hidden">
          <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 px-6 text-center relative">
            <CardTitle className="text-2xl md:text-3xl font-bold">Mission Statement</CardTitle>
            <Target size={32} className="text-white absolute right-6 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <CardContent className="p-6">
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <CardDescription className="text-xl font-medium text-blue-800 italic leading-relaxed">
                "To create new leaders through our school of future African leaders in politics and in business, we
                also aim to put new faces and ideas in leadership positions in countries around the continent."
              </CardDescription>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <BookOpen size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  Based on our vision of setting a global power-base which is also our supreme guide. We believe that development is an inside-out process, rather than outside-in process, therefore, a
                  society cannot be called developed on the basis of infrastructure only, if its people are not fully developed.
                  Consequently, we focus on the mind transformation of our people. As people become aware of themselves and
                  their reality worldwide, being mentally developed, they will be able to reflect their mental development onto
                  their environment.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <GraduationCap size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  We are aware that the world including Africa is at the time of danger and opportunity, our chance to
                  survive depends on what type of leadership we put in charge and in which direction it is taking us. For that
                  reason, we have an academy called 'The Free-Minded', a new school for future African leaders in politics and
                  business. Through this education system, we will create political and business leaders who are fit for the
                  future of Africa.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Users size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  Also, we are working in collaboration with all Africans around the world to design an agenda that takes into
                  account all aspects of our respective communities and countries. In fact, we are not just creating leaders, we
                  want to put them in positions of power in our respective communities and countries in order to fulfill our
                  common vision.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Globe size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  Finally, we are aiming to work and strengthen our common position in order to create a continental agenda in
                  all areas of activities for the future African generations and their leaderships.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Handshake size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700 font-medium">
                  Above all, our mission is to working with you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default MissionSection
