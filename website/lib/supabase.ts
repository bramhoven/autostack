import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export type Software = {
  id: number
  name: string
  description: string
  category: string
  version: string
  image_url: string
}

export type Server = {
  id: number
  user_id: string
  name: string
  ip_address: string
  ssh_port: string
  username: string
  status: string
  created_at: string
}

export type Installation = {
  id: number
  user_id: string
  server_id: number
  software_id: number
  status: string
  version: string
  installed_at: string
  server: Server
  software: Software
}

// Database schema for reference:
/*
-- Create tables
CREATE TABLE software (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL,
  image_url TEXT NOT NULL
);

CREATE TABLE servers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  ssh_port TEXT NOT NULL DEFAULT '22',
  username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE installations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  server_id INTEGER REFERENCES servers(id) NOT NULL,
  software_id INTEGER REFERENCES software(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  version TEXT NOT NULL,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

