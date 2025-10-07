-- Execute no Supabase SQL Editor
-- Criar todas as tabelas necessárias com user_id

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  service_type TEXT,
  price DECIMAL(10,2),
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Verificar se as colunas já existem antes de adicionar
DO $$ 
BEGIN
  -- Adicionar user_id em clients se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='clients' AND column_name='user_id') THEN
    ALTER TABLE clients ADD COLUMN user_id UUID;
  END IF;

  -- Adicionar user_id em employees se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='employees' AND column_name='user_id') THEN
    ALTER TABLE employees ADD COLUMN user_id UUID;
  END IF;
END $$;
