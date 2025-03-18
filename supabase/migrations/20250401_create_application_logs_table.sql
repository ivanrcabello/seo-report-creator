
-- Create application_logs table for storing structured logs
CREATE TABLE IF NOT EXISTS public.application_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  component TEXT,
  user_id UUID REFERENCES auth.users(id),
  client_id UUID,
  path TEXT,
  context JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS application_logs_timestamp_idx ON public.application_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS application_logs_user_id_idx ON public.application_logs (user_id);
CREATE INDEX IF NOT EXISTS application_logs_level_idx ON public.application_logs (level);

-- Enable RLS
ALTER TABLE public.application_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all logs
CREATE POLICY "Admins can view all logs" 
  ON public.application_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create policy for users to view only their own logs
CREATE POLICY "Users can view their own logs"
  ON public.application_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policy to allow the service role to insert logs
CREATE POLICY "Service role can insert logs"
  ON public.application_logs
  FOR INSERT
  WITH CHECK (true);

-- Add scheduled maintenance function to clean old logs
-- This function will run daily and remove logs older than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.application_logs
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$;
