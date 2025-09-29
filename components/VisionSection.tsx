import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, History, Globe } from "lucide-react"

const VisionSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-blue-600">Our Vision</h2>
        
        <Card className="hover:shadow-lg transition-shadow bg-white border-gray-200 rounded-xl overflow-hidden">
          <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6 text-center relative">
            <CardTitle className="text-2xl md:text-3xl font-bold">Vision Statement</CardTitle>
            <Eye size={32} className="text-white absolute right-6 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <CardContent className="p-6">
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <CardDescription className="text-xl font-medium text-blue-800 italic leading-relaxed">
                "To establish an African global power-base, through a continental government built on a new leadership
                inspired by our common interest." A leadership built on the idea of Pan-Africanism, trained for, and by
                Africans, and subsidized by Africans.
              </CardDescription>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <History size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  This Pan-African vision of continental governance system is inspired by historical events that have shaped
                  the face of our continent. In fact, the current African geography and its internal institutions were created
                  by Europeans who had no other vision except, to conquer and exploit African resources. Consequently, the
                  African vision should not be built on the foundation of the European vision, it should be aiming to
                  establish a new foundation on which the future will be based, and that is our aim.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <Globe size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                  Especially, after a half century of the so-called African independence we have tried to protect and defend
                  the foundation established by the oppressors for our destruction, and the result is, we have turned
                  ourselves into tools of self-destruction. However, it is never too late to do things right, it is never too
                  late to lay a new foundation of unity, Ubuntu and prosperity. Finally, it is never too late to be in charge
                  again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default VisionSection
