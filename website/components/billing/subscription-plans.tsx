"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateSubscription } from "@/lib/actions/billing"

interface Plan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  description: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "basic-monthly",
    name: "Basic",
    price: 9.99,
    interval: "month",
    description: "Essential features for small deployments",
    features: ["Up to 5 servers", "10 software installations", "Basic monitoring", "Email support"],
  },
  {
    id: "pro-monthly",
    name: "Professional",
    price: 29.99,
    interval: "month",
    description: "Advanced features for growing teams",
    features: [
      "Up to 20 servers",
      "Unlimited software installations",
      "Advanced monitoring",
      "Priority support",
      "API access",
      "Custom server groups",
    ],
    popular: true,
  },
  {
    id: "enterprise-monthly",
    name: "Enterprise",
    price: 99.99,
    interval: "month",
    description: "Complete solution for large organizations",
    features: [
      "Unlimited servers",
      "Unlimited software installations",
      "Advanced monitoring with alerts",
      "24/7 dedicated support",
      "Full API access",
      "Custom integrations",
      "SSO authentication",
      "Audit logs",
    ],
  },
]

export function SubscriptionPlans() {
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState("basic-monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month")

  const handleChangePlan = async (planId: string) => {
    if (planId === currentPlan) return

    setIsLoading(true)

    try {
      await updateSubscription(planId)

      toast({
        title: "Subscription updated",
        description: "Your subscription plan has been updated successfully.",
      })

      setCurrentPlan(planId)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the {plans.find((p) => p.id === currentPlan)?.name} plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-lg p-1 inline-flex">
              <Button
                variant={billingInterval === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("month")}
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === "year" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("year")}
              >
                Yearly
                <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                  Save 20%
                </Badge>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = billingInterval === "year" ? (plan.price * 12 * 0.8).toFixed(2) : plan.price.toFixed(2)

              const isCurrentPlan = currentPlan === plan.id

              return (
                <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/{billingInterval}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex items-center">
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isLoading || isCurrentPlan}
                      onClick={() => handleChangePlan(plan.id)}
                    >
                      {isCurrentPlan ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
