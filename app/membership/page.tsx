import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MembershipPage() {
  return (
    <div className="membership-page max-w-5xl mx-auto p-6">
      <section className="bg-blue-900 membership-hero text-center py-10 rounded-lg">
        <h1 className="text-4xl font-bold text-white">Join the African Cup Political Party</h1>
        <p className="mt-4 text-lg text-blue-100">
          Be part of the movement shaping Africa's future through Pan-Africanism and continental governance
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-10 mt-10">
        {/* Benefits */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Why Join ACUP?</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-xl font-medium text-red-500">Leadership Development</h3>
              <p className="text-blue-400">
                Participate in our leadership academy and become a future leader in African politics and business
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium text-red-500">Continental Impact</h3>
              <p className="text-blue-400">
                Contribute to shaping Africa's future through our continental governance initiatives
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium text-red-500">Community Building</h3>
              <p className="text-blue-400">
                Join a network of like-minded individuals working towards African self-determination
              </p>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg shadow bg-white">
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Ready to Join?</h2>
          <p className="mb-6 text-blue-400">
            Start your journey with ACUP today and be part of Africa's transformation
          </p>

          <div className="space-y-4">
            <Link href="/auth/register" className="block">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg">Register Now</Button>
            </Link>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <Link href="/auth/login" className="text-red-600 hover:underline font-medium">
                  Sign In
                </Link>{" "}
                or{" "}
                <Link href="/membership-card" className="text-red-600 hover:underline font-medium">
                  Get your membership card
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">Membership Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg shadow bg-white">
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Standard Member</h3>
            <p className="text-gray-600 mb-4">Join the movement and participate in local activities</p>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Access to local branch meetings</li>
              <li>• Monthly newsletter</li>
              <li>• Voting rights in local decisions</li>
            </ul>
          </div>

          <div className="p-6 border-2 border-red-600 rounded-lg shadow bg-red-50">
            <h3 className="text-xl font-semibold mb-3 text-red-600">Active Member</h3>
            <p className="text-gray-600 mb-4">Take leadership roles and shape policy</p>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• All Standard Member benefits</li>
              <li>• Leadership training programs</li>
              <li>• Policy development participation</li>
              <li>• Continental conference access</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg shadow bg-white">
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Founding Member</h3>
            <p className="text-gray-600 mb-4">Help establish ACUP in new regions</p>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• All Active Member benefits</li>
              <li>• Branch establishment support</li>
              <li>• Direct access to leadership</li>
              <li>• Special recognition</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
