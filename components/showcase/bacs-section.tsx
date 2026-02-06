"use client"

import { Target, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"
import { useEffect, useRef } from "react"

const bacsComponents = [
  {
    icon: Target,
    title: "Business Goals",
    description: "Define strategic objectives and track their progress with metrics and ownership.",
    gradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-300",
    badgeBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    letter: "B",
    darkText: "text-blue-700",
  },
  {
    icon: CheckCircle,
    title: "Agreed Actions",
    description: "Capture action items with clear ownership, deadlines, and priority levels.",
    gradient: "from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-300",
    badgeBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    letter: "A",
    darkText: "text-emerald-700",
  },
  {
    icon: AlertCircle,
    title: "Concerns",
    description: "Log risks and concerns with severity tracking and resolution monitoring.",
    gradient: "from-amber-50 to-amber-100",
    borderColor: "border-amber-300",
    badgeBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    letter: "C",
    darkText: "text-amber-700",
  },
  {
    icon: Lightbulb,
    title: "Suggestions",
    description: "Collect improvement ideas and track implementation status.",
    gradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-300",
    badgeBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    letter: "S",
    darkText: "text-purple-700",
  },
]

export default function BACSSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".bacs-card").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("fade-in-up")
            }, i * 150)
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
      id="bacs"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-primary/2 to-accent/2"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-20 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl glow-pulse animate-delay-3000" />
      </div>

      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            The <span className="gradient-text">BACS+</span> Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven framework for structuring meetings and ensuring action accountability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bacsComponents.map((component, index) => {
            const Icon = component.icon
            return (
              <div key={index} className="bacs-card group relative">
                <div
                  className={`h-full p-6 rounded-xl border-2 ${component.borderColor} bg-gradient-to-br ${component.gradient} hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 shine-effect`}
                >
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-125 transition-transform duration-300">
                    {component.letter}
                  </div>

                  <div
                    className={`mb-4 inline-flex p-4 rounded-lg ${component.badgeBg} text-white shadow-lg transition-all group-hover:scale-125 group-hover:shadow-2xl duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`text-xl font-semibold ${component.darkText} mb-2`}>{component.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{component.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-primary/12 via-accent/8 to-background border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/15 shine-effect">
          <h3 className="text-2xl font-semibold text-foreground mb-4 gradient-text">Why BACS+ Works</h3>
          <p className="text-muted-foreground leading-relaxed text-lg">
            The BACS+ framework ensures that meetings are structured, productive, and result in clear action items. By
            categorizing discussion points into Business Goals, Agreed Actions, Concerns, and Suggestions, teams
            maintain focus, accountability, and continuous improvement across the organization.
          </p>
        </div>
      </div>
    </section>
  )
}
