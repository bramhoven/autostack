import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServerOverview } from "@/components/servers/server-overview"
import { ServerInstallations } from "@/components/servers/server-installations"
import { ServerSettings } from "@/components/servers/server-settings"
import { ServerMonitoring } from "@/components/servers/server-monitoring"
import { getServerById } from "@/lib/actions/servers"
import { notFound } from "next/navigation"

interface ServerDetailPageProps {
  params: {
    id: string
  }
}

export default async function ServerDetailPage({ params }: ServerDetailPageProps) {
  const serverId = Number.parseInt(params.id)

  if (isNaN(serverId)) {
    notFound()
  }

  try {
    const server = await getServerById(serverId)

    return (
      <DashboardLayout>
        <div className="container py-6">
          <PageHeader
            heading={server.name}
            subheading={`${server.hostname} • ${server.ip_address}`}
            backButton={{ href: "/servers", label: "Back to Servers" }}
          />

          <div className="mt-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="installations">Installations</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <ServerOverview server={server} />
              </TabsContent>
              <TabsContent value="installations">
                <ServerInstallations serverId={server.id} />
              </TabsContent>
              <TabsContent value="monitoring">
                <ServerMonitoring server={server} />
              </TabsContent>
              <TabsContent value="settings">
                <ServerSettings server={server} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    notFound()
  }
}

