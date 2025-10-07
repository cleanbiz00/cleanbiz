-- Execute no Supabase SQL Editor
-- Criar tabela de agendamentos

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  client_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendado',
  service TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  client_email TEXT,
  google_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);

-- Criar índice para busca por data
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Desabilitar RLS (já que estamos usando service role key)
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Comentários explicativos
COMMENT ON TABLE appointments IS 'Agendamentos de serviços de limpeza';
COMMENT ON COLUMN appointments.google_event_id IS 'ID do evento no Google Calendar para sincronização';
