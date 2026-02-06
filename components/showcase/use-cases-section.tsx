"use client"

import { Users, Target, RotateCcw, Rocket, AlertTriangle, BookOpen } from "lucide-react"
import { useEffect, useRef } from "react"

const useCases = [
  {
    icon: Users,
    title: "Daily Standups",
    description: "Keep teams aligned with automatic daily progress tracking",
  },
  {
    icon: Target,
    title: "Steering Committees",
    description: "Strategic decision documentation with clear accountability",
  },
  {
    icon: RotateCcw,
    title: "Retrospectives",
    description: "Capture lessons learned and improvement suggestions systematically",
  },
  {
    icon: Rocket,
    title: "Project Kickoffs",
    description: "Document goals, constraints, and action items from day one",
  },
  {
    icon: AlertTriangle,
    title: "Risk Reviews",
    description: "Track concerns and mitigation strategies with escalation workflows",
  },
  {
    icon: BookOpen,
    title: "Lessons Learned",
    description: "Build organizational knowledge base from meeting insights",
  },
]

export default function UseCasesSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".use-case-card").forEach((el, i) => {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Built for Every Type of Meeting</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            BACS+ adapts to any meeting type and organizational structure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div
                key={index}
                className="use-case-card group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 opacity-0 will-change-transform cursor-pointer"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
