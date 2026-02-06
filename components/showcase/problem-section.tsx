"use client"

import { AlertCircle, MessageSquare, Clock, Users } from "lucide-react"
import { useEffect, useRef } from "react"

const problems = [
  {
    icon: AlertCircle,
    title: "No Clear Outcomes",
    description: "Meetings end without defined decisions or clear next steps",
  },
  {
    icon: MessageSquare,
    title: "Poor Follow-up",
    description: "Action items are forgotten, lost, or never tracked",
  },
  {
    icon: Users,
    title: "Lack of Accountability",
    description: "Unclear ownership leads to missed deadlines and slipped commitments",
  },
  {
    icon: Clock,
    title: "Wasted Time",
    description: "Hours spent in meetings with no measurable business impact",
  },
]

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".problem-card").forEach((el, i) => {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Meetings Should Drive Action — Not Confusion
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most organizations struggle with meeting effectiveness. BACS+ changes that.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="problem-card group p-6 rounded-xl border border-border/50 bg-gradient-to-br from-destructive/5 to-background hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/10 transition-all duration-300 opacity-0 will-change-transform backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-destructive/10 text-destructive group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
