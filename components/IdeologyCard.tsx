import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote } from "lucide-react"
import Link from "next/link"

interface Ideology {
  id: string
  title: string
  description: string
  content: string
  category: string
  created_at: string
}

interface IdeologyCardProps {
  ideology: Ideology
}

export default function IdeologyCard({ ideology }: IdeologyCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "political":
        return "bg-blue-100 text-blue-800"
      case "economic":
        return "bg-red-100 text-red-800"
      case "social":
        return "bg-blue-100 text-blue-800"
      case "cultural":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-blue-200 rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Quote size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex gap-2">
            <Badge className={getCategoryColor(ideology.category)}>
              {ideology.category.charAt(0).toUpperCase() + ideology.category.slice(1)}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-blue-600 leading-tight">{ideology.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-red-600 pl-4 py-2 bg-gray-50 rounded-r-lg">
          <CardDescription className="text-gray-800 text-base leading-relaxed italic line-clamp-4">
            "{ideology.content || ideology.description}"
          </CardDescription>
        </blockquote>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">Added: {new Date(ideology.created_at).toLocaleDateString()}</div>
          <Link href={`/ideology/${ideology.id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Read More
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
