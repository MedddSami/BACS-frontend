"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up")
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-accent/12 to-transparent rounded-full blur-3xl glow-pulse animate-delay-2000" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 via-accent/8 to-transparent rounded-full blur-3xl glow-pulse animate-delay-4000" />
        {/* Animated grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.5" />
            </pattern>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="rgb(85, 100, 255)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full" ref={ref}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 glow-effect shine-effect group">
                <Zap className="h-4 w-4 text-primary group-hover:animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Smarter Meetings. Clear Actions. Real Results.
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Transform Your <span className="gradient-text">Meetings</span> into{" "}
                <span className="gradient-text">Action</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                BACS+ transforms meetings into structured outcomes using AI and proven frameworks. Automate meeting
                management, streamline action tracking, and ensure accountability.
              </p>
            </div>

            {/* Stats with gradient backgrounds */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "95%", label: "Time Saved", delay: "0" },
                { value: "10x", label: "More Accountability", delay: "100" },
                { value: "100%", label: "Action Tracking", delay: "200" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/8 border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20 shine-effect`}
                  style={{ animationDelay: `${stat.delay}ms` }}
                >
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 font-semibold text-white border-0"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/15 hover:to-accent/15 border-primary/30 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual - Dashboard mockup */}
          <div className="hidden md:block relative">
            <div className="relative h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-2xl border-2 border-primary/20 p-4 flex items-center justify-center glow-effect group overflow-hidden shine-effect">

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Grid texture */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                <div className="w-full h-full bg-[linear-gradient(rgba(85,100,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(85,100,255,.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
              </div>

              {/* Skeleton (shown until image loads) */}
              {!loaded && (
                <div className="relative space-y-4 w-full float animate-fade-in">
                  <div className="h-12 bg-gradient-to-r from-primary/20 to-accent/15 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg animate-pulse" />
                    <div className="h-24 bg-gradient-to-br from-accent/15 to-accent/5 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/8 rounded-lg animate-pulse" />
                </div>
              )}

              {/* Image */}
              <div
                className={`absolute inset-4 rounded-xl overflow-hidden float transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Image
                  src="/dashboard_view.PNG"
                  alt="BACS+ Dashboard Preview"
                  width={700}
                  height={96}
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  onLoad={() => setLoaded(true)}
                />

                {/* Image polish overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <p className="text-sm text-muted-foreground">
                  Dashboard Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
