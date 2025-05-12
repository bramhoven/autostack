"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCreateCloudProviderCredential, useUpdateCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the form schema based on provider type
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  providerId: z.string().min(1, "Provider is required"),
})

const awsSchema = baseSchema.extend({
  aws_access_key_id: z.string().min(1, "Access Key ID is required"),
  aws_secret_access_key: z.string().min(1, "Secret Access Key is required"),
  aws_region: z.string().min(1, "Region is required"),
})

const digitalOceanSchema = baseSchema.extend({
  api_token: z.string().min(1, "API Token is required"),
})

const gcpSchema = baseSchema.extend({
  project_id: z.string().min(1, "Project ID is required"),
  client_email: z.string().email("Invalid email format"),
  private_key: z.string().min(1, "Private Key is required"),
})

const azureSchema = baseSchema.extend({
  tenant_id: z.string().min(1, "Tenant ID is required"),
  client_id: z.string().min(1, "Client ID is required"),
  client_secret: z.string().min(1, "Client Secret is required"),
  subscription_id: z.string().min(1, "Subscription ID is required"),
})

const linodeSchema = baseSchema.extend({
  api_token: z.string().min(1, "API Token is required"),
})

const vultrSchema = baseSchema.extend({
  api_key: z.string().min(1, "API Key is required"),
})

// Define the form schema for each provider type
const formSchema = z.discriminatedUnion("providerType", [
  z.object({ providerType: z.literal("aws"), ...awsSchema.shape }),
  z.object({ providerType: z.literal("digitalocean"), ...digitalOceanSchema.shape }),
  z.object({ providerType: z.literal("gcp"), ...gcpSchema.shape }),
  z.object({ providerType: z.literal("azure"), ...azureSchema.shape }),
  z.object({ providerType: z.literal("linode"), ...linodeSchema.shape }),
  z.object({ providerType: z.literal("vultr"), ...vultrSchema.shape }),
])

type FormValues = z.infer<typeof formSchema>

interface CloudProviderFormProps {
  providers: any[]
  credential?: any
  defaultProviderId?: string
  onSuccess?: () => void
}

export function CloudProviderForm({ providers, credential, defaultProviderId, onSuccess }: CloudProviderFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedProvider, setSelectedProvider] = useState<string>(
    credential?.cloud_provider_id?.toString() || defaultProviderId || "",
  )
  const [providerType, setProviderType] = useState<string>("")
  const [isDefault, setIsDefault] = useState<boolean>(credential?.is_default || false)

  const { mutate: createCredential, isPending: isCreating } = useCreateCloudProviderCredential()
  const { mutate: updateCredential, isPending: isUpdating } = useUpdateCloudProviderCredential()

  const isSubmitting = isCreating || isUpdating

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: credential?.name || "",
      providerId: credential?.cloud_provider_id?.toString() || defaultProviderId || "",
      providerType: providerType,
      ...(credential?.credentials || {}),
    },
  })

  // Update provider type when selected provider changes
  useEffect(() => {
    if (selectedProvider) {
      const provider = providers.find((p) => p.id.toString() === selectedProvider)
      if (provider) {
        setProviderType(provider.slug)
        form.setValue("providerType", provider.slug as any)
      }
    }
  }, [selectedProvider, providers, form])

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Extract credentials based on provider type
    const { name, providerId, providerType, ...credentials } = data

    if (credential) {
      // Update existing credential
      updateCredential(
        {
          id: credential.id,
          updates: {
            name,
            credentials,
            is_default: isDefault,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Cloud provider credential updated successfully",
            })
            if (onSuccess) onSuccess()
          },
        },
      )
    } else {
      // Create new credential
      createCredential(
        {
          providerId: Number.parseInt(providerId),
          name,
          credentials,
          isDefault,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Cloud provider credential created successfully",
            })
            if (onSuccess) onSuccess()
          },
        },
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{credential ? "Edit" : "Add"} Cloud Provider Credential</CardTitle>
        <CardDescription>
          {credential
            ? "Update your cloud provider credential details"
            : "Add a new cloud provider credential to manage your cloud resources"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My AWS Account" {...field} />
                  </FormControl>
                  <FormDescription>A friendly name to identify this credential</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud Provider</FormLabel>
                  <Select
                    disabled={!!credential}
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedProvider(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cloud provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your cloud provider</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AWS Fields */}
            {providerType === "aws" && (
              <>
                <FormField
                  control={form.control}
                  name="aws_access_key_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Key ID</FormLabel>
                      <FormControl>
                        <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aws_secret_access_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Access Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aws_region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                          <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                          <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* DigitalOcean Fields */}
            {providerType === "digitalocean" && (
              <FormField
                control={form.control}
                name="api_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Token</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="dop_v1_..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Generate a token in the DigitalOcean control panel with read and write access
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* GCP Fields */}
            {providerType === "gcp" && (
              <>
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project ID</FormLabel>
                      <FormControl>
                        <Input placeholder="my-project-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input placeholder="service-account@my-project-123.iam.gserviceaccount.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="private_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Key</FormLabel>
                      <FormControl>
                        <Textarea placeholder="-----BEGIN PRIVATE KEY-----..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Azure Fields */}
            {providerType === "azure" && (
              <>
                <FormField
                  control={form.control}
                  name="tenant_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant ID</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscription_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription ID</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Linode Fields */}
            {providerType === "linode" && (
              <FormField
                control={form.control}
                name="api_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Token</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="..." {...field} />
                    </FormControl>
                    <FormDescription>Generate a Personal Access Token in the Linode Cloud Manager</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Vultr Fields */}
            {providerType === "vultr" && (
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="..." {...field} />
                    </FormControl>
                    <FormDescription>Generate an API Key in the Vultr Customer Portal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="is_default">Set as default for this provider</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/cloud-providers")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {credential ? "Update" : "Add"} Credential
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
