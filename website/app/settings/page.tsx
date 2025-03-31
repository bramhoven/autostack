import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServerGroups } from "@/components/settings/server-groups"
import { GeneralSettings } from "@/components/settings/general-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <PageHeader heading="Settings" subheading="Manage application settings and server groups" />

        <div className="mt-8">
          <Tabs defaultValue="server-groups" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="server-groups">Server Groups</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            <TabsContent value="server-groups">
              <ServerGroups />
            </TabsContent>
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

