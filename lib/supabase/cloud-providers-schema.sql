-- Create cloud_providers table
CREATE TABLE IF NOT EXISTS public.cloud_providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cloud_provider_credentials table
CREATE TABLE IF NOT EXISTS public.cloud_provider_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id INTEGER NOT NULL REFERENCES public.cloud_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  credentials JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, name)
);

-- Insert default cloud providers
INSERT INTO public.cloud_providers (name, slug, description, logo_url)
VALUES 
  ('Amazon Web Services', 'aws', 'Amazon Web Services (AWS) is a comprehensive cloud platform offering compute, storage, databases, and more.', '/images/providers/aws.svg'),
  ('DigitalOcean', 'digitalocean', 'DigitalOcean is a cloud infrastructure provider focused on simplifying web infrastructure for developers.', '/images/providers/digitalocean.svg'),
  ('Google Cloud Platform', 'gcp', 'Google Cloud Platform (GCP) offers a suite of cloud computing services running on Google infrastructure.', '/images/providers/gcp.svg'),
  ('Microsoft Azure', 'azure', 'Microsoft Azure is a cloud computing service for building, testing, deploying, and managing applications.', '/images/providers/azure.svg'),
  ('Linode', 'linode', 'Linode offers cloud computing and hosting services through virtual private servers.', '/images/providers/linode.svg'),
  ('Vultr', 'vultr', 'Vultr provides cloud compute environments with high-performance SSD storage.', '/images/providers/vultr.svg')
ON CONFLICT (slug) DO NOTHING;

-- Add RLS policies
ALTER TABLE public.cloud_provider_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cloud provider credentials"
  ON public.cloud_provider_credentials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cloud provider credentials"
  ON public.cloud_provider_credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cloud provider credentials"
  ON public.cloud_provider_credentials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cloud provider credentials"
  ON public.cloud_provider_credentials
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
