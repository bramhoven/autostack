import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionPlans } from "@/components/billing/subscription-plans"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { BillingHistory } from "@/components/billing/billing-history"

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <PageHeader
          heading="Billing & Subscription"
          subheading="Manage your subscription plan, payment methods, and billing history"
        />

        <div className="mt-8">
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              <TabsTrigger value="history">Billing History</TabsTrigger>
            </TabsList>
            <TabsContent value="subscription">
              <SubscriptionPlans />
            </TabsContent>
            <TabsContent value="payment">
              <PaymentMethods />
            </TabsContent>
            <TabsContent value="history">
              <BillingHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
