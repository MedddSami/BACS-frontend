"use client"

import { Calendar, Mic, BarChart3, CheckCircle, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

const steps = [
  {
    icon: Calendar,
    title: "Plan & Schedule",
    description: "Create meetings with BACS structure templates built-in",
  },
  {
    icon: Mic,
    title: "Record & Transcribe",
    description: "AI automatically transcribes and analyzes meeting content",
  },
  {
    icon: BarChart3,
    title: "Structure Outcomes",
    description: "Smart extraction of Business Goals, Actions, Concerns, Suggestions",
  },
  {
    icon: CheckCircle,
    title: "Assign Actions",
    description: "Auto-generate action items with ownership and deadlines",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor completion, identify risks, celebrate wins",
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".step-card").forEach((el, i) => {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary/3 to-background">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">From Meeting to Measurable Results</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A streamlined workflow that transforms meeting time into business outcomes
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="step-card flex gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 rounded-lg bg-white/50 border border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold flex-shrink-0 shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
