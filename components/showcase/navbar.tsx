"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function ShowcaseNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/showcase" className="flex items-center">

            <span className="text-xl font-bold text-foreground hidden sm:inline gradient-text">
              <Image
                className="items-center"
                src="/logo_bacs+2.png"
                alt="BACS+"
                width={150}
                height={10}
                priority
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
            <a
              href="#bacs"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              BACS Model
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <a href="#features" className="block text-sm font-medium text-foreground hover:text-primary">
              Features
            </a>
            <a href="#about" className="block text-sm font-medium text-foreground hover:text-primary">
              About
            </a>
            <a href="#bacs" className="block text-sm font-medium text-foreground hover:text-primary">
              BACS Model
            </a>
            <a href="#pricing" className="block text-sm font-medium text-foreground hover:text-primary">
              Pricing
            </a>
            <div className="flex flex-col gap-3 pt-3">
              <Link href="/contact" className="w-full">
                <Button variant="ghost" className="w-full">
                  Contact
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
