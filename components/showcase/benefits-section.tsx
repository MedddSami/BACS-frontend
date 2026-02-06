"use client"

import { TrendingUp, Users, Zap, Shield } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  {
    icon: TrendingUp,
    title: "95% Time Savings",
    description: "Eliminate manual meeting notes and action tracking with automated BACS data extraction.",
    gradient: "from-blue-500/20 to-blue-600/20",
    accent: "text-blue-600",
  },
  {
    icon: Users,
    title: "Improved Accountability",
    description: "Clear action ownership and status tracking ensures nothing falls through the cracks.",
    gradient: "from-emerald-500/20 to-emerald-600/20",
    accent: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "10x Faster Decisions",
    description: "AI-powered insights and real-time analytics accelerate decision-making processes.",
    gradient: "from-amber-500/20 to-amber-600/20",
    accent: "text-amber-600",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Systematically track and resolve concerns with audit trails and escalation workflows.",
    gradient: "from-purple-500/20 to-purple-600/20",
    accent: "text-purple-600",
  },
]

export default function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".benefit-card").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("fade-in-up")
            }, i * 100)
          })
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
    <section
      id="benefits"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Why Teams Choose BACS+</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proven benefits from organizations worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className={`benefit-card flex gap-6 p-6 rounded-xl bg-gradient-to-br ${benefit.gradient} border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-lg bg-white/10`}>
                    <Icon className={`h-6 w-6 ${benefit.accent}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
