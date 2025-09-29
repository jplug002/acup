import { Heart, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">Africa Continental Union Party</h3>
        <p className="mb-6 max-w-2xl mx-auto">
          Building a stronger, more prosperous Africa through community action and sustainable development.
        </p>

        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>unity@africanacup.org</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>+2774 657 7264</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Pan-African Headquarters</span>
          </div>
        </div>

        <div className="border-t border-blue-400 pt-4 mt-6 text-center">
          <span>© 2024 Africa Continental Union Party</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
