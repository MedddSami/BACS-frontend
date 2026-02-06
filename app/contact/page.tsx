"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import ShowcaseNavbar from "@/components/showcase/navbar"
import Footer from "@/components/showcase/footer"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@bacsplus.com",
      href: "mailto:hello@bacsplus.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Office",
      value: "San Francisco, CA",
      href: "#",
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
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto" ref={ref}>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8 fade-in-up">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Contact Information</h2>
                  <p className="text-muted-foreground">
                    Have questions? We're here to help. Reach out using any of these methods.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactMethods.map((method, i) => {
                    const Icon = method.icon
                    return (
                      <a
                        key={i}
                        href={method.href}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 glow-effect transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{method.title}</h3>
                          <p className="text-muted-foreground">{method.value}</p>
                        </div>
                      </a>
                    )
                  })}
                </div>

                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-6 opacity-0 fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <div className="space-y-4 fade-in-up">
                <h2 className="text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find answers to common questions about BACS+</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "What is the free trial period?",
                    a: "We offer a 14-day free trial with full access to all features.",
                  },
                  {
                    q: "Can I cancel anytime?",
                    a: "Yes, you can cancel your subscription at any time with no penalties.",
                  },
                  {
                    q: "Do you offer team training?",
                    a: "Yes, we provide onboarding and training for teams on the Professional plan and above.",
                  },
                  {
                    q: "Is my data secure?",
                    a: "We use enterprise-grade encryption and comply with all major data protection standards.",
                  },
                ].map((faq, i) => (
                  <details
                    key={i}
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 glow-effect transition-all duration-300 cursor-pointer group"
                  >
                    <summary className="font-semibold text-foreground flex items-center justify-between">
                      {faq.q}
                      <span className="transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
