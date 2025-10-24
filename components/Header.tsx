"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="bg-red-500 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Party Name */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/acup-logo.jpg"
              alt="ACUP Logo"
              width={120}
              height={40}
              style={{ height: "40px", width: "auto" }}
              className="object-contain cursor-pointer"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight">ACUP</h1>
              <p className="text-xs text-white/90 leading-tight">African Continental Unity Party</p>
            </div>
          </Link>
        </div>

        {/* Navigation links (desktop) */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link href="/">Welcome</Link>
          <Link href="/ideology">Ideology</Link>
          <Link href="/leadership">Leadership</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/branches">Branches</Link>
          <Link href="/events">Events</Link>
          <Link href="/blog">Blog</Link>
          {session && <Link href="/dashboard">Dashboard</Link>}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link href="/donate">
            <Button
              variant="secondary"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Donate
            </Button>
          </Link>
          {session ? (
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="secondary"
              size="sm"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-red-500 md:hidden z-50 shadow-lg">
          <div className="p-4 border-b border-red-400">
            <h1 className="font-bold text-lg">ACUP</h1>
            <p className="text-sm text-white/90">African Continental Unity Party</p>
          </div>
          <ul className="flex flex-col space-y-3 p-4">
            <li>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Welcome
              </Link>
            </li>
            <li>
              <Link
                href="/ideology"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Ideology
              </Link>
            </li>
            <li>
              <Link
                href="/leadership"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Leadership
              </Link>
            </li>
            <li>
              <Link
                href="/membership"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link
                href="/branches"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Branches
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors"
              >
                Blog
              </Link>
            </li>

            <li>
              <Link
                href="/donate"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-gray-200 transition-colors font-bold text-blue-400"
              >
                Donate
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 hover:text-gray-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setIsMenuOpen(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-gray-200 w-full justify-start p-2"
                  >
                    Sign Out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 hover:text-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 hover:text-gray-200 transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
