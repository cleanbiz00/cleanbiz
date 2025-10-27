-- Add comments column to appointments table
-- Execute this script in Supabase SQL Editor

ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS comments TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.appointments.comments IS 'Optional comments about the appointment that will be sent to clients and employees via email and Google Calendar';

