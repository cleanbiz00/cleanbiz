-- Adicionar coluna client_email na tabela appointments
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS client_email text;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
ORDER BY ordinal_position;

