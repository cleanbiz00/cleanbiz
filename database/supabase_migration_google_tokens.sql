-- Migration: Add Google OAuth tokens to app_users table
-- Execute this script in Supabase SQL Editor

-- Add columns for Google OAuth tokens
ALTER TABLE app_users 
ADD COLUMN IF NOT EXISTS google_access_token TEXT,
ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_connected_at TIMESTAMP WITH TIME ZONE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_app_users_google_token ON app_users(google_access_token) WHERE google_access_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN app_users.google_access_token IS 'Google Calendar OAuth access token';
COMMENT ON COLUMN app_users.google_refresh_token IS 'Google Calendar OAuth refresh token';
COMMENT ON COLUMN app_users.google_token_expires_at IS 'Expiration time of the access token';
COMMENT ON COLUMN app_users.google_connected_at IS 'When the user connected their Google Calendar';

