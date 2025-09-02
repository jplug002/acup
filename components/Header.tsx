"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Image
            src="/ACUP LOGO.jpg"
            alt="ACUP Logo"
            width={40}
            height={40}
            style={{ height: "40px", width: "auto" }}
          />
        </div>
        <button
          className="mobile-menu-btn md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <nav className={`nav-container ${isMenuOpen ? "mobile-open" : ""}`}>
          <ul className="nav">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Welcome
              </Link>
            </li>
            <li>
              <Link href="/ideology" onClick={() => setIsMenuOpen(false)}>
                Ideology
              </Link>
            </li>
            <li>
              <Link href="/membership" onClick={() => setIsMenuOpen(false)}>
                Membership
              </Link>
            </li>
            <li>
              <Link href="/branches" onClick={() => setIsMenuOpen(false)}>
                Branches
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                Events
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
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
                    className="text-white hover:text-gray-200"
                  >
                    Sign Out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
