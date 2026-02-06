import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams",
    price: "$29",
    period: "/month",
    features: ["Up to 5 users", "Unlimited meetings", "Basic BACS tracking", "Email support", "1 workspace"],
  },
  {
    name: "Professional",
    description: "For growing organizations",
    price: "$99",
    period: "/month",
    popular: true,
    features: [
      "Up to 50 users",
      "Unlimited meetings",
      "Advanced analytics",
      "AI transcription",
      "5 workspaces",
      "Priority support",
      "Custom templates",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    description: "For large enterprises",
    price: "Custom",
    period: "pricing",
    features: [
      "Unlimited users",
      "Dedicated support",
      "Custom integrations",
      "On-premise option",
      "SLA guarantee",
      "Advanced security",
      "Audit logs",
      "Custom features",
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose the plan that works for your team</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-8 border transition-all ${
                plan.popular
                  ? "border-primary bg-primary/5 md:scale-105 shadow-xl"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>

              <Link href="/login" className="w-full mb-8">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
