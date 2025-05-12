# Supabase Database Setup

This directory contains SQL migration files for setting up the database schema in Supabase.

## Running Migrations

To set up the database schema, run the following SQL files in the Supabase SQL editor in this order:

1. `schema.sql` - Creates the core tables for servers, software, and installations
2. `settings-schema.sql` - Creates tables for user settings
3. `webhooks-schema.sql` - Creates tables for webhooks
4. `cloud-providers-schema.sql` - Creates tables for cloud providers integration

## Cloud Providers Schema

The `cloud-providers-schema.sql` file creates the following tables:

- `cloud_providers` - Stores information about available cloud providers
- `cloud_provider_credentials` - Stores user credentials for cloud providers
- `cloud_servers` - Tracks servers created through cloud providers

It also sets up Row Level Security (RLS) policies to ensure that users can only access their own data.

## Sample Data

The migration files include sample data to get you started. The `cloud-providers-schema.sql` file includes sample data for popular cloud providers like AWS, DigitalOcean, GCP, Azure, Linode, and Vultr.
