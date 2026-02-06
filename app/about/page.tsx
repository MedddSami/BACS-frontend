"use client"

import { useEffect, useRef } from "react"
import ShowcaseNavbar from "@/components/showcase/navbar"
import Footer from "@/components/showcase/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up")
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We believe every meeting should drive actionable outcomes for organizations.",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Cutting-edge AI and automation to solve real problems in meeting management.",
    },
    {
      icon: Users,
      title: "Team Focused",
      description: "Built by teams, for teams. We understand collaboration challenges.",
    },
    {
      icon: Heart,
      title: "Customer Success",
      description: "Your success is our success. We're committed to your growth.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseNavbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6 fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">About BACS+</h1>
            <p className="text-xl text-muted-foreground">Transforming how teams work together in meetings</p>
          </div>
        </section>

        {/* Story Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto space-y-12" ref={ref}>
            <div className="space-y-6 opacity-0 fade-in-up">
              <h2 className="text-4xl font-bold text-foreground">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                BACS+ was founded with a simple observation: most organizations waste countless hours in unproductive
                meetings. Notes get lost, action items slip through the cracks, and accountability is unclear.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We created BACS+ to solve this problem by combining the proven BACS framework with modern AI technology.
                Our platform transforms meetings from information black holes into engines of organizational progress.
              </p>
            </div>

            <div className="space-y-6 opacity-0 fade-in-up" style={{ animationDelay: "200ms" }}>
              <h2 className="text-4xl font-bold text-foreground">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, i) => {
                  const Icon = value.icon
                  return (
                    <div
                      key={i}
                      className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 glow-effect transition-all duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-6 opacity-0 fade-in-up" style={{ animationDelay: "600ms" }}>
              <h2 className="text-4xl font-bold text-foreground">Why BACS+ Works</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The BACS framework has been proven across thousands of organizations. By systematically categorizing
                  discussions into Business Goals, Agreed Actions, Concerns, and Suggestions, teams create clarity and
                  accountability.
                </p>
                <p>
                  We've enhanced this framework with AI-powered automation, intelligent transcription, and real-time
                  collaboration tools. The result is a platform that transforms meetings into strategic organizational
                  assets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 fade-in-up">
            <h2 className="text-4xl font-bold text-foreground">Ready to Transform Your Meetings?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of teams using BACS+ to drive better outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
