"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useCloudProviders,
  useCloudProviderCredential,
  useCreateCloudProviderCredential,
  useUpdateCloudProviderCredential,
} from "@/hooks/use-cloud-providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, CloudIcon } from "lucide-react"

// Form schemas for different providers
const awsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  aws_access_key_id: z.string().min(1, "Access Key ID is required"),
  aws_secret_access_key: z.string().min(1, "Secret Access Key is required"),
  aws_region: z.string().min(1, "Region is required"),
  is_default: z.boolean().default(false),
})

const digitaloceanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  api_token: z.string().min(1, "API Token is required"),
  is_default: z.boolean().default(false),
})

const gcpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  project_id: z.string().min(1, "Project ID is required"),
  client_email: z.string().email("Invalid email").min(1, "Client Email is required"),
  private_key: z.string().min(1, "Private Key is required"),
  is_default: z.boolean().default(false),
})

const azureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subscription_id: z.string().min(1, "Subscription ID is required"),
  tenant_id: z.string().min(1, "Tenant ID is required"),
  client_id: z.string().min(1, "Client ID is required"),
  client_secret: z.string().min(1, "Client Secret is required"),
  is_default: z.boolean().default(false),
})

const linodeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  api_token: z.string().min(1, "API Token is required"),
  is_default: z.boolean().default(false),
})

const vultrSchema = z.object({
  name: z.string().min(1, "Name is required"),
  api_key: z.string().min(1, "API Key is required"),
  is_default: z.boolean().default(false),
})

export function CloudProviderForm({ credentialId }: { credentialId?: string }) {
  const router = useRouter()
  const { providers, isLoading: isLoadingProviders } = useCloudProviders()
  const { credential, isLoading: isLoadingCredential } = useCloudProviderCredential(credentialId || "")
  const { createCredential, isCreating } = useCreateCloudProviderCredential()
  const { updateCredential, isUpdating } = useUpdateCloudProviderCredential()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  // Set up form based on provider
  const awsForm = useForm<z.infer<typeof awsSchema>>({
    resolver: zodResolver(awsSchema),
    defaultValues: {
      name: "",
      aws_access_key_id: "",
      aws_secret_access_key: "",
      aws_region: "us-east-1",
      is_default: false,
    },
  })

  const digitaloceanForm = useForm<z.infer<typeof digitaloceanSchema>>({
    resolver: zodResolver(digitaloceanSchema),
    defaultValues: {
      name: "",
      api_token: "",
      is_default: false,
    },
  })

  const gcpForm = useForm<z.infer<typeof gcpSchema>>({
    resolver: zodResolver(gcpSchema),
    defaultValues: {
      name: "",
      project_id: "",
      client_email: "",
      private_key: "",
      is_default: false,
    },
  })

  const azureForm = useForm<z.infer<typeof azureSchema>>({
    resolver: zodResolver(azureSchema),
    defaultValues: {
      name: "",
      subscription_id: "",
      tenant_id: "",
      client_id: "",
      client_secret: "",
      is_default: false,
    },
  })

  const linodeForm = useForm<z.infer<typeof linodeSchema>>({
    resolver: zodResolver(linodeSchema),
    defaultValues: {
      name: "",
      api_token: "",
      is_default: false,
    },
  })

  const vultrForm = useForm<z.infer<typeof vultrSchema>>({
    resolver: zodResolver(vultrSchema),
    defaultValues: {
      name: "",
      api_key: "",
      is_default: false,
    },
  })

  // Set form values when editing
  useEffect(() => {
    if (credential && !isLoadingCredential) {
      const providerSlug = credential.cloud_providers?.slug
      setSelectedProvider(providerSlug || null)

      if (providerSlug === "aws") {
        awsForm.reset({
          name: credential.name,
          aws_access_key_id: (credential.credentials.aws_access_key_id as string) || "",
          aws_secret_access_key: (credential.credentials.aws_secret_access_key as string) || "",
          aws_region: (credential.credentials.aws_region as string) || "us-east-1",
          is_default: credential.is_default,
        })
      } else if (providerSlug === "digitalocean") {
        digitaloceanForm.reset({
          name: credential.name,
          api_token: (credential.credentials.api_token as string) || "",
          is_default: credential.is_default,
        })
      } else if (providerSlug === "gcp") {
        gcpForm.reset({
          name: credential.name,
          project_id: (credential.credentials.project_id as string) || "",
          client_email: (credential.credentials.client_email as string) || "",
          private_key: (credential.credentials.private_key as string) || "",
          is_default: credential.is_default,
        })
      } else if (providerSlug === "azure") {
        azureForm.reset({
          name: credential.name,
          subscription_id: (credential.credentials.subscription_id as string) || "",
          tenant_id: (credential.credentials.tenant_id as string) || "",
          client_id: (credential.credentials.client_id as string) || "",
          client_secret: (credential.credentials.client_secret as string) || "",
          is_default: credential.is_default,
        })
      } else if (providerSlug === "linode") {
        linodeForm.reset({
          name: credential.name,
          api_token: (credential.credentials.api_token as string) || "",
          is_default: credential.is_default,
        })
      } else if (providerSlug === "vultr") {
        vultrForm.reset({
          name: credential.name,
          api_key: (credential.credentials.api_key as string) || "",
          is_default: credential.is_default,
        })
      }
    }
  }, [credential, isLoadingCredential, awsForm, digitaloceanForm, gcpForm, azureForm, linodeForm, vultrForm])

  // Set initial selected provider
  useEffect(() => {
    if (!selectedProvider && providers && providers.length > 0) {
      setSelectedProvider(providers[0].slug)
    }
  }, [providers, selectedProvider])

  const onSubmitAWS = async (data: z.infer<typeof awsSchema>) => {
    const provider = providers?.find((p) => p.slug === "aws")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            aws_access_key_id: data.aws_access_key_id,
            aws_secret_access_key: data.aws_secret_access_key,
            aws_region: data.aws_region,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          aws_access_key_id: data.aws_access_key_id,
          aws_secret_access_key: data.aws_secret_access_key,
          aws_region: data.aws_region,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  const onSubmitDigitalOcean = async (data: z.infer<typeof digitaloceanSchema>) => {
    const provider = providers?.find((p) => p.slug === "digitalocean")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            api_token: data.api_token,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          api_token: data.api_token,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  const onSubmitGCP = async (data: z.infer<typeof gcpSchema>) => {
    const provider = providers?.find((p) => p.slug === "gcp")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            project_id: data.project_id,
            client_email: data.client_email,
            private_key: data.private_key,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          project_id: data.project_id,
          client_email: data.client_email,
          private_key: data.private_key,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  const onSubmitAzure = async (data: z.infer<typeof azureSchema>) => {
    const provider = providers?.find((p) => p.slug === "azure")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            subscription_id: data.subscription_id,
            tenant_id: data.tenant_id,
            client_id: data.client_id,
            client_secret: data.client_secret,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          subscription_id: data.subscription_id,
          tenant_id: data.tenant_id,
          client_id: data.client_id,
          client_secret: data.client_secret,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  const onSubmitLinode = async (data: z.infer<typeof linodeSchema>) => {
    const provider = providers?.find((p) => p.slug === "linode")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            api_token: data.api_token,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          api_token: data.api_token,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  const onSubmitVultr = async (data: z.infer<typeof vultrSchema>) => {
    const provider = providers?.find((p) => p.slug === "vultr")
    if (!provider) return

    if (credentialId) {
      await updateCredential({
        id: credentialId,
        updates: {
          name: data.name,
          credentials: {
            api_key: data.api_key,
          },
          is_default: data.is_default,
        },
      })
    } else {
      await createCredential({
        providerId: provider.id,
        name: data.name,
        credentials: {
          api_key: data.api_key,
        },
        isDefault: data.is_default,
      })
    }

    router.push("/cloud-providers")
  }

  if (isLoadingProviders || (credentialId && isLoadingCredential)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!credentialId && (
        <Tabs
          value={selectedProvider || undefined}
          onValueChange={setSelectedProvider as (value: string) => void}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            {providers?.map((provider) => (
              <TabsTrigger key={provider.id} value={provider.slug} className="flex flex-col gap-1 h-auto py-2">
                {provider.logo_url ? (
                  <div className="h-8 w-8 overflow-hidden">
                    <Image
                      src={provider.logo_url || "/placeholder.svg"}
                      alt={provider.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <CloudIcon className="h-8 w-8" />
                )}
                <span className="text-xs">{provider.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            {selectedProvider === "aws" && (
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>AWS Credentials</CardTitle>
                  <CardDescription>Enter your AWS credentials to connect to your AWS account</CardDescription>
                </CardHeader>
                <Form {...awsForm}>
                  <form onSubmit={awsForm.handleSubmit(onSubmitAWS)}>
                    <CardContent className="space-y-4 pt-6">
                      <FormField
                        control={awsForm.control}
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
                        control={awsForm.control}
                        name="aws_access_key_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Key ID</FormLabel>
                            <FormControl>
                              <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                            </FormControl>
                            <FormDescription>Your AWS access key ID</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={awsForm.control}
                        name="aws_secret_access_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Access Key</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Your AWS secret access key</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={awsForm.control}
                        name="aws_region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input placeholder="us-east-1" {...field} />
                            </FormControl>
                            <FormDescription>The AWS region to use</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={awsForm.control}
                        name="is_default"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Set as Default</FormLabel>
                              <FormDescription>Use this credential by default when creating servers</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50">
                      <Button
                        type="submit"
                        className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                        disabled={isCreating || isUpdating}
                      >
                        {isCreating || isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {credentialId ? "Updating..." : "Adding..."}
                          </>
                        ) : credentialId ? (
                          "Update Credentials"
                        ) : (
                          "Add Credentials"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {selectedProvider === "digitalocean" && (
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>DigitalOcean Credentials</CardTitle>
                  <CardDescription>
                    Enter your DigitalOcean credentials to connect to your DigitalOcean account
                  </CardDescription>
                </CardHeader>
                <Form {...digitaloceanForm}>
                  <form onSubmit={digitaloceanForm.handleSubmit(onSubmitDigitalOcean)}>
                    <CardContent className="space-y-4 pt-6">
                      <FormField
                        control={digitaloceanForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credential Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My DigitalOcean Account" {...field} />
                            </FormControl>
                            <FormDescription>A friendly name to identify this credential</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={digitaloceanForm.control}
                        name="api_token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Token</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="dop_v1_..." {...field} />
                            </FormControl>
                            <FormDescription>Your DigitalOcean API token</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={digitaloceanForm.control}
                        name="is_default"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Set as Default</FormLabel>
                              <FormDescription>Use this credential by default when creating servers</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50">
                      <Button
                        type="submit"
                        className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                        disabled={isCreating || isUpdating}
                      >
                        {isCreating || isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {credentialId ? "Updating..." : "Adding..."}
                          </>
                        ) : credentialId ? (
                          "Update Credentials"
                        ) : (
                          "Add Credentials"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {/* Similar forms for other providers */}
            {selectedProvider === "gcp" && (
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Google Cloud Platform Credentials</CardTitle>
                  <CardDescription>Enter your GCP credentials to connect to your Google Cloud account</CardDescription>
                </CardHeader>
                <Form {...gcpForm}>
                  <form onSubmit={gcpForm.handleSubmit(onSubmitGCP)}>
                    <CardContent className="space-y-4 pt-6">
                      {/* Form fields for GCP */}
                      <FormField
                        control={gcpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credential Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My GCP Account" {...field} />
                            </FormControl>
                            <FormDescription>A friendly name to identify this credential</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={gcpForm.control}
                        name="project_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project ID</FormLabel>
                            <FormControl>
                              <Input placeholder="my-project-123" {...field} />
                            </FormControl>
                            <FormDescription>Your GCP project ID</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={gcpForm.control}
                        name="client_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Email</FormLabel>
                            <FormControl>
                              <Input placeholder="service-account@project.iam.gserviceaccount.com" {...field} />
                            </FormControl>
                            <FormDescription>Your service account email</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={gcpForm.control}
                        name="private_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Private Key</FormLabel>
                            <FormControl>
                              <Textarea placeholder="-----BEGIN PRIVATE KEY-----..." className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>Your service account private key</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={gcpForm.control}
                        name="is_default"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Set as Default</FormLabel>
                              <FormDescription>Use this credential by default when creating servers</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50">
                      <Button
                        type="submit"
                        className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                        disabled={isCreating || isUpdating}
                      >
                        {isCreating || isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {credentialId ? "Updating..." : "Adding..."}
                          </>
                        ) : credentialId ? (
                          "Update Credentials"
                        ) : (
                          "Add Credentials"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {/* Forms for other providers would go here */}
          </div>
        </Tabs>
      )}

      {/* When editing, show only the form for the selected provider */}
      {credentialId && credential && (
        <>
          {credential.cloud_providers?.slug === "aws" && (
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>AWS Credentials</CardTitle>
                <CardDescription>Update your AWS credentials</CardDescription>
              </CardHeader>
              <Form {...awsForm}>
                <form onSubmit={awsForm.handleSubmit(onSubmitAWS)}>
                  <CardContent className="space-y-4 pt-6">
                    {/* AWS form fields */}
                    <FormField
                      control={awsForm.control}
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
                      control={awsForm.control}
                      name="aws_access_key_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Key ID</FormLabel>
                          <FormControl>
                            <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                          </FormControl>
                          <FormDescription>Your AWS access key ID</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={awsForm.control}
                      name="aws_secret_access_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Access Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
                          </FormControl>
                          <FormDescription>Your AWS secret access key</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={awsForm.control}
                      name="aws_region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <Input placeholder="us-east-1" {...field} />
                          </FormControl>
                          <FormDescription>The AWS region to use</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={awsForm.control}
                      name="is_default"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Set as Default</FormLabel>
                            <FormDescription>Use this credential by default when creating servers</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t border-border/50">
                    <Button
                      type="submit"
                      className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Credentials"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          )}

          {/* Similar forms for other providers when editing */}
        </>
      )}
    </div>
  )
}
