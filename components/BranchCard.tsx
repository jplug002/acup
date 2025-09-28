import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"

interface Branch {
  id: string
  name: string
  country: string
  city: string
  address: string
  contact_email: string
  contact_phone: string
  established_date: string
  status: "active" | "inactive"
  description?: string
}

interface BranchCardProps {
  branch: Branch
}

export default function BranchCard({ branch }: BranchCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-gray-200 rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-gray-900">{branch.name}</CardTitle>
          <Badge className="bg-blue-100 text-blue-800">{branch.status === "active" ? "Active" : "Inactive"}</Badge>
        </div>
        <CardDescription className="text-red-600 font-medium text-base">
          {branch.city}, {branch.country}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {branch.description && <p className="text-gray-700 text-sm leading-relaxed">{branch.description}</p>}

        <div className="space-y-3">
          <div className="flex items-start text-gray-600">
            <MapPin size={16} className="mr-3 mt-1 text-red-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Address</div>
              <div className="text-gray-700">{branch.address}</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-3 text-blue-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Email</div>
              <a href={`mailto:${branch.contact_email}`} className="text-blue-600 hover:text-blue-700 break-all">
                {branch.contact_email}
              </a>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-3 text-red-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Phone</div>
              <a href={`tel:${branch.contact_phone}`} className="text-red-600 hover:text-red-700">
                {branch.contact_phone}
              </a>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-3 text-blue-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Established</div>
              <div>{new Date(branch.established_date).getFullYear()}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Link href={`/branches/${branch.id}`} className="flex-1">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              View Details
            </button>
          </Link>
          <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors">
            Contact
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
