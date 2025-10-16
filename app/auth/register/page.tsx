"use client"

import type React from "react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+1",
    phone: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const fullPhoneNumber = formData.phone ? `${formData.countryCode}${formData.phone}` : ""

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: fullPhoneNumber,
          country: formData.country,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      const loginResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (loginResult?.error) {
        router.push("/auth/login?message=Registration successful! Please log in.")
      } else {
        router.push("/dashboard?welcome=true")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const countryCodes = [
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+234", country: "Nigeria" },
    { code: "+254", country: "Kenya" },
    { code: "+27", country: "South Africa" },
    { code: "+233", country: "Ghana" },
    { code: "+255", country: "Tanzania" },
    { code: "+256", country: "Uganda" },
    { code: "+237", country: "Cameroon" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+251", country: "Ethiopia" },
    { code: "+20", country: "Egypt" },
    { code: "+212", country: "Morocco" },
    { code: "+213", country: "Algeria" },
    { code: "+216", country: "Tunisia" },
    { code: "+221", country: "Senegal" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" },
    { code: "+265", country: "Malawi" },
    { code: "+267", country: "Botswana" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/acup-logo.jpg" alt="ACUP Logo" width={100} height={100} className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Create Your Account</CardTitle>
          <CardDescription className="text-blue-700">Join ACUP and become part of Africa's future</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2 mt-1">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.code} ({item.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Select your country code and enter your phone number</p>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-700">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
