"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useCreateCloudProviderCredential, useUpdateCloudProviderCredential } from "@/hooks/use-cloud-providers"
import type { Database } from "@/lib/supabase/database.types"

type CloudProvider = Database["public"]["Tables"]["cloud_providers"]["Row"]
type CloudProviderCredential = Database["public"]["Tables"]["cloud_provider_credentials"]["Row"]

// Define form schema based on provider type
const awsSchema = z.object({
  provider_id: z.string(),
  name: z.string().min(1, "Name is required"),
  access_key: z.string().min(1, "Access Key is required"),
  secret_key: z.string().min(1, "Secret Key is required"),
  region: z.string().min(1, "Region is required"),
})

const azureSchema = z.object({
  provider_id: z.string(),
  name: z.string().min(1, "Name is required"),
  tenant_id: z.string().min(1, "Tenant ID is required"),
  client_id: z.string().min(1, "Client ID is required"),
  client_secret: z.string().min(1, "Client Secret is required"),
  subscription_id: z.string().min(1, "Subscription ID is required"),
})

const gcpSchema = z.object({
  provider_id: z.string(),
  name: z.string().min(1, "Name is required"),
  project_id: z.string().min(1, "Project ID is required"),
  service_account_key: z.string().min(1, "Service Account Key is required"),
})

const digitalOceanSchema = z.object({
  provider_id: z.string(),
  name: z.string().min(1, "Name is required"),
  api_token: z.string().min(1, "API Token is required"),
})

// Union type for all provider schemas
const formSchema = z.discriminatedUnion("provider_id", [awsSchema, azureSchema, gcpSchema, digitalOceanSchema])

interface CloudProviderFormProps {
  providers: CloudProvider[]
  credential?: CloudProviderCredential
  defaultProvider?: string
  onSuccess?: () => void
}

export function CloudProviderForm({ providers, credential, defaultProvider, onSuccess }: CloudProviderFormProps) {
  const { toast } = useToast()
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null)

  const createMutation = useCreateCloudProviderCredential()
  const updateMutation = useUpdateCloudProviderCredential()

  // Set up form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider_id: credential?.provider_id || defaultProvider || "",
      name: credential?.name || "",
      // Other fields will be populated based on the selected provider
    },
  })

  // Update form when provider changes
  useEffect(() => {
    const providerId = form.getValues("provider_id")
    if (providerId) {
      const provider = providers.find((p) => p.id === providerId)
      setSelectedProvider(provider || null)
    }
  }, [form, providers])

  // Update form when credential changes
  useEffect(() => {
    if (credential) {
      // Reset form with credential values
      form.reset({
        provider_id: credential.provider_id,
        name: credential.name,
        ...(credential.credentials as any),
      })

      // Update selected provider
      const provider = providers.find((p) => p.id === credential.provider_id)
      setSelectedProvider(provider || null)
    }
  }, [credential, providers, form])

  // Handle provider change
  const handleProviderChange = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    setSelectedProvider(provider || null)
    form.setValue("provider_id", providerId)

    // Reset provider-specific fields
    if (provider) {
      switch (provider.type) {
        case "aws":
          form.setValue("access_key", credential?.credentials?.access_key || "")
          form.setValue("secret_key", credential?.credentials?.secret_key || "")
          form.setValue("region", credential?.credentials?.region || "")
          break
        case "azure":
          form.setValue("tenant_id", credential?.credentials?.tenant_id || "")
          form.setValue("client_id", credential?.credentials?.client_id || "")
          form.setValue("client_secret", credential?.credentials?.client_secret || "")
          form.setValue("subscription_id", credential?.credentials?.subscription_id || "")
          break
        case "gcp":
          form.setValue("project_id", credential?.credentials?.project_id || "")
          form.setValue("service_account_key", credential?.credentials?.service_account_key || "")
          break
        case "digitalocean":
          form.setValue("api_token", credential?.credentials?.api_token || "")
          break
      }
    }
  }

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (credential) {
        // Update existing credential
        await updateMutation.mutateAsync({
          id: credential.id,
          provider_id: data.provider_id,
          name: data.name,
          credentials: getCredentialsFromData(data),
        })
        toast({
          title: "Cloud provider updated",
          description: "Your cloud provider credentials have been updated successfully.",
        })
      } else {
        // Create new credential
        await createMutation.mutateAsync({
          provider_id: data.provider_id,
          name: data.name,
          credentials: getCredentialsFromData(data),
        })
        toast({
          title: "Cloud provider added",
          description: "Your cloud provider has been added successfully.",
        })
      }

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving cloud provider:", error)
      toast({
        title: "Error",
        description: "There was an error saving your cloud provider. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Extract credentials from form data based on provider type
  const getCredentialsFromData = (data: z.infer<typeof formSchema>) => {
    if (!selectedProvider) return {}

    switch (selectedProvider.type) {
      case "aws":
        return {
          access_key: data.access_key,
          secret_key: data.secret_key,
          region: data.region,
        }
      case "azure":
        return {
          tenant_id: data.tenant_id,
          client_id: data.client_id,
          client_secret: data.client_secret,
          subscription_id: data.subscription_id,
        }
      case "gcp":
        return {
          project_id: data.project_id,
          service_account_key: data.service_account_key,
        }
      case "digitalocean":
        return {
          api_token: data.api_token,
        }
      default:
        return {}
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{credential ? "Edit Cloud Provider" : "Add Cloud Provider"}</CardTitle>
        <CardDescription>
          {credential
            ? "Update your cloud provider credentials"
            : "Connect your cloud provider to manage your infrastructure"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <FormField
              control={form.control}
              name="provider_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud Provider</FormLabel>
                  <Select
                    disabled={!!credential}
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleProviderChange(value)
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
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the cloud provider you want to connect to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My AWS Account" {...field} />
                  </FormControl>
                  <FormDescription>A friendly name to identify this cloud provider</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Provider-specific fields */}
            {selectedProvider && selectedProvider.type === "aws" && (
              <>
                <FormField
                  control={form.control}
                  name="access_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Key</FormLabel>
                      <FormControl>
                        <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secret_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="us-west-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {selectedProvider && selectedProvider.type === "azure" && (
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
                        <Input type="password" placeholder="Your client secret" {...field} />
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

            {selectedProvider && selectedProvider.type === "gcp" && (
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
                  name="service_account_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Account Key (JSON)</FormLabel>
                      <FormControl>
                        <Input
                          as="textarea"
                          className="min-h-[100px]"
                          placeholder="Paste your service account key JSON here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {selectedProvider && selectedProvider.type === "digitalocean" && (
              <FormField
                control={form.control}
                name="api_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Token</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your DigitalOcean API token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : credential
                  ? "Update Provider"
                  : "Add Provider"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
