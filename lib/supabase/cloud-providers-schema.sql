-- Cloud Providers Schema

-- Create cloud_providers table
CREATE TABLE IF NOT EXISTS public.cloud_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  provider_type VARCHAR(50) NOT NULL,
  required_fields JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create cloud_provider_credentials table
CREATE TABLE IF NOT EXISTS public.cloud_provider_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id INTEGER NOT NULL REFERENCES public.cloud_providers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  credentials JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create cloud_servers table
CREATE TABLE IF NOT EXISTS public.cloud_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id UUID NOT NULL REFERENCES public.cloud_provider_credentials(id) ON DELETE CASCADE,
  server_id INTEGER REFERENCES public.servers(id) ON DELETE SET NULL,
  cloud_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS cloud_provider_credentials_user_id_idx ON public.cloud_provider_credentials(user_id);
CREATE INDEX IF NOT EXISTS cloud_provider_credentials_provider_id_idx ON public.cloud_provider_credentials(provider_id);
CREATE INDEX IF NOT EXISTS cloud_servers_user_id_idx ON public.cloud_servers(user_id);
CREATE INDEX IF NOT EXISTS cloud_servers_credential_id_idx ON public.cloud_servers(credential_id);
CREATE INDEX IF NOT EXISTS cloud_servers_server_id_idx ON public.cloud_servers(server_id);

-- Add RLS policies
ALTER TABLE public.cloud_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_provider_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_servers ENABLE ROW LEVEL SECURITY;

-- Cloud providers policies (anyone can read, only admins can modify)
CREATE POLICY "Allow public read access to cloud_providers" 
  ON public.cloud_providers FOR SELECT 
  USING (true);

-- Cloud provider credentials policies (users can only access their own)
CREATE POLICY "Users can manage their own cloud_provider_credentials" 
  ON public.cloud_provider_credentials FOR ALL 
  USING (auth.uid() = user_id);

-- Cloud servers policies (users can only access their own)
CREATE POLICY "Users can manage their own cloud_servers" 
  ON public.cloud_servers FOR ALL 
  USING (auth.uid() = user_id);

-- Insert sample cloud providers
INSERT INTO public.cloud_providers (name, slug, description, provider_type, required_fields, is_active)
VALUES
  ('Amazon Web Services', 'aws', 'Amazon Web Services (AWS) is a comprehensive cloud computing platform.', 'iaas', '{"aws_access_key_id": {"type": "text", "required": true}, "aws_secret_access_key": {"type": "password", "required": true}, "aws_region": {"type": "select", "required": true, "options": ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-northeast-1", "ap-southeast-1", "ap-southeast-2"]}}', true),
  ('DigitalOcean', 'digitalocean', 'DigitalOcean is a cloud infrastructure provider focused on simplifying web infrastructure for developers.', 'iaas', '{"api_token": {"type": "password", "required": true}}', true),
  ('Google Cloud Platform', 'gcp', 'Google Cloud Platform (GCP) is a suite of cloud computing services.', 'iaas', '{"project_id": {"type": "text", "required": true}, "client_email": {"type": "text", "required": true}, "private_key": {"type": "textarea", "required": true}}', true),
  ('Microsoft Azure', 'azure', 'Microsoft Azure is a cloud computing service for building, testing, deploying, and managing applications.', 'iaas', '{"tenant_id": {"type": "text", "required": true}, "client_id": {"type": "text", "required": true}, "client_secret": {"type": "password", "required": true}, "subscription_id": {"type": "text", "required": true}}', true),
  ('Linode', 'linode', 'Linode is a cloud hosting provider focused on providing virtual private servers.', 'iaas', '{"api_token": {"type": "password", "required": true}}', true),
  ('Vultr', 'vultr', 'Vultr is a cloud infrastructure provider that offers cloud compute, cloud storage, and bare metal.', 'iaas', '{"api_key": {"type": "password", "required": true}}', true)
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  provider_type = EXCLUDED.provider_type,
  required_fields = EXCLUDED.required_fields,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
