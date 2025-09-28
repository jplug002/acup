import Image from "next/image"

interface CountryFlagProps {
  country: string
  size?: number
  className?: string
}

const flagUrls: Record<string, string> = {
  Ghana: "https://flagcdn.com/w80/gh.png",
  Nigeria: "https://flagcdn.com/w80/ng.png",
  "South Africa": "https://flagcdn.com/w80/za.png",
  Kenya: "https://flagcdn.com/w80/ke.png",
  "Côte d'Ivoire": "https://flagcdn.com/w80/ci.png",
}

export function CountryFlag({ country, size = 48, className = "" }: CountryFlagProps) {
  const flagUrl = flagUrls[country]

  if (!flagUrl) {
    return <div className={`w-12 h-8 bg-gray-200 rounded ${className}`} />
  }

  return (
    <div
      className={`relative overflow-hidden rounded shadow-sm ${className}`}
      style={{ width: size, height: size * 0.67 }}
    >
      <Image src={flagUrl || "/placeholder.svg"} alt={`${country} flag`} fill className="object-cover" sizes="80px" />
    </div>
  )
}
