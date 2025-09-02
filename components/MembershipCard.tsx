"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import Image from "next/image"

interface MembershipCardProps {
  showActions?: boolean
}

export default function MembershipCard({ showActions = true }: MembershipCardProps) {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const handleDownload = () => {
    // TODO: Implement card download as PDF/image
    console.log("Download membership card")
  }

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Share membership card")
  }

  const membershipId = `ACUP-${Date.now().toString().slice(-6)}`

  return (
    <div className="max-w-md mx-auto">
      {/* Digital Membership Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Image src="/ACUP LOGO.jpg" alt="ACUP Logo" width={32} height={32} className="rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-lg">ACUP</h3>
                <p className="text-blue-100 text-sm">African Cup Political Party</p>
              </div>
            </div>
            <Badge className="bg-white text-blue-800 hover:bg-gray-100">
              {session.user.membershipStatus || "Active"}
            </Badge>
          </div>

          {/* Member Info */}
          <div className="space-y-4">
            <div>
              <p className="text-blue-100 text-sm uppercase tracking-wide">Member Name</p>
              <p className="font-semibold text-xl">{session.user.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm uppercase tracking-wide">Member ID</p>
                <p className="font-mono text-sm">{membershipId}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm uppercase tracking-wide">Valid Until</p>
                <p className="font-mono text-sm">12/2025</p>
              </div>
            </div>

            <div>
              <p className="text-blue-100 text-sm uppercase tracking-wide">Email</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-blue-500">
            <p className="text-blue-100 text-xs text-center">Building Africa's Future Together</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-3 mt-4">
          <Button onClick={handleDownload} variant="outline" className="flex-1 flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1 flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      )}
    </div>
  )
}
