"use client"

import { Calendar, MessageSquare, FileText, Brain, Users, BarChart3, Shield, Zap } from "lucide-react"
import { useEffect, useRef } from "react"

const features = [
  {
    icon: Calendar,
    title: "Smart Meeting Management",
    description: "Create, schedule, and manage meetings with intelligent BACS structure templates.",
    gradient: "from-blue-50 to-blue-100",
    borderGradient: "from-blue-300 to-blue-400",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    accent: "text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Action Tracking",
    description: "Assign, track, and manage action items with priorities and deadlines.",
    gradient: "from-emerald-50 to-emerald-100",
    borderGradient: "from-emerald-300 to-emerald-400",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    accent: "text-emerald-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Automatic meeting transcription and intelligent BACS data extraction.",
    gradient: "from-purple-50 to-purple-100",
    borderGradient: "from-purple-300 to-purple-400",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    accent: "text-purple-600",
  },
  {
    icon: FileText,
    title: "Transcript Management",
    description: "Upload and analyze meeting transcripts with automatic categorization.",
    gradient: "from-orange-50 to-orange-100",
    borderGradient: "from-orange-300 to-orange-400",
    iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
    accent: "text-orange-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration with role-based access control and permissions.",
    gradient: "from-pink-50 to-pink-100",
    borderGradient: "from-pink-300 to-pink-400",
    iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
    accent: "text-pink-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed reports and insights on meeting performance and action completion.",
    gradient: "from-cyan-50 to-cyan-100",
    borderGradient: "from-cyan-300 to-cyan-400",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    accent: "text-cyan-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, audit logs, and compliance management.",
    gradient: "from-red-50 to-red-100",
    borderGradient: "from-red-300 to-red-400",
    iconBg: "bg-gradient-to-br from-red-500 to-red-600",
    accent: "text-red-600",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Real-time alerts for action items, deadlines, and meeting updates.",
    gradient: "from-amber-50 to-amber-100",
    borderGradient: "from-amber-300 to-amber-400",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    accent: "text-amber-600",
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".feature-card").forEach((el, i) => {
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
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/3 to-transparent"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-gradient-to-tl from-emerald-400/12 to-transparent rounded-full blur-3xl glow-pulse animate-delay-2000" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-l from-purple-400/10 to-transparent rounded-full blur-3xl glow-pulse animate-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            <span className="gradient-text">Powerful</span> Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run productive meetings and track accountability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`feature-card group p-6 rounded-xl border-2 bg-gradient-to-br ${feature.gradient} border-gradient-to-r ${feature.borderGradient} hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 cursor-pointer shine-effect animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div
                  className={`mb-4 inline-flex p-3 rounded-lg ${feature.iconBg} text-white shadow-lg group-hover:scale-125 group-hover:shadow-xl transition-all duration-300`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
