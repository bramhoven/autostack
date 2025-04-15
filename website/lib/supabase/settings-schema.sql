-- Create server_groups table
CREATE TABLE server_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create server_group_members table for the many-to-many relationship
CREATE TABLE server_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES server_groups(id) ON DELETE CASCADE NOT NULL,
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, server_id)
);

-- Create user_settings table
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  theme TEXT NOT NULL DEFAULT 'system',
  auto_refresh BOOLEAN NOT NULL DEFAULT true,
  refresh_interval INTEGER NOT NULL DEFAULT 30,
  show_offline_servers BOOLEAN NOT NULL DEFAULT true,
  enable_notifications BOOLEAN NOT NULL DEFAULT true,
  compact_view BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update user_settings table to include notification settings
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS server_alerts BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS installation_updates BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS security_alerts BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN NOT NULL DEFAULT false;

-- Create RLS policies
ALTER TABLE server_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for server_groups
CREATE POLICY "Users can view their own server groups"
  ON server_groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own server groups"
  ON server_groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own server groups"
  ON server_groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own server groups"
  ON server_groups FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for server_group_members
CREATE POLICY "Users can view their own server group members"
  ON server_group_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM server_groups
    WHERE server_groups.id = server_group_members.group_id
    AND server_groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own server group members"
  ON server_group_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM server_groups
    WHERE server_groups.id = server_group_members.group_id
    AND server_groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own server group members"
  ON server_group_members FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM server_groups
    WHERE server_groups.id = server_group_members.group_id
    AND server_groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own server group members"
  ON server_group_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM server_groups
    WHERE server_groups.id = server_group_members.group_id
    AND server_groups.user_id = auth.uid()
  ));

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
