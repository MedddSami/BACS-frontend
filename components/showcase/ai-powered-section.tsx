"use client"

import { Sparkles, Zap, Brain, BarChart3 } from "lucide-react"
import { useEffect, useRef } from "react"

const aiFeatures = [
  {
    icon: Sparkles,
    title: "Speech-to-Text",
    description: "Accurate transcription of meeting audio in real-time",
  },
  {
    icon: Brain,
    title: "Smart Summarization",
    description: "AI generates concise, actionable meeting summaries",
  },
  {
    icon: Zap,
    title: "Automatic Action Extraction",
    description: "Identifies and assigns action items without manual entry",
  },
  {
    icon: BarChart3,
    title: "Intelligent Categorization",
    description: "Classifies insights into Business Goals, Actions, Concerns, Suggestions",
  },
]

export default function AIPoweredSection() {
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">AI-Powered Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Enterprise AI at Your Fingertips</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning transforms meeting chaos into structured, actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
