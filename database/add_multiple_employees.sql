-- =============================================
-- ADICIONAR SUPORTE A MÚLTIPLOS FUNCIONÁRIOS POR AGENDAMENTO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar tabela de relacionamento appointment_employees (muitos para muitos)
-- =============================================

CREATE TABLE IF NOT EXISTS public.appointment_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Evitar duplicatas
  UNIQUE(appointment_id, employee_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_appointment_employees_appointment 
  ON public.appointment_employees(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_employees_employee 
  ON public.appointment_employees(employee_id);

-- 2. Migrar dados existentes (employee_id único para múltiplos)
-- =============================================

-- Copiar relacionamentos existentes para a nova tabela
INSERT INTO public.appointment_employees (appointment_id, employee_id)
SELECT id, employee_id 
FROM public.appointments 
WHERE employee_id IS NOT NULL
ON CONFLICT (appointment_id, employee_id) DO NOTHING;

-- 3. Habilitar RLS na nova tabela
-- =============================================

ALTER TABLE public.appointment_employees ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (baseadas no user_id do appointment)
CREATE POLICY "Users can view own appointment employees"
ON public.appointment_employees
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments
    WHERE appointments.id = appointment_employees.appointment_id
    AND appointments.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own appointment employees"
ON public.appointment_employees
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.appointments
    WHERE appointments.id = appointment_employees.appointment_id
    AND appointments.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own appointment employees"
ON public.appointment_employees
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments
    WHERE appointments.id = appointment_employees.appointment_id
    AND appointments.user_id = auth.uid()
  )
);

-- 4. Verificar resultado
-- =============================================

-- Ver relacionamentos criados
SELECT 
  ae.appointment_id,
  ae.employee_id,
  a.service,
  e.name as employee_name
FROM appointment_employees ae
JOIN appointments a ON ae.appointment_id = a.id
JOIN employees e ON ae.employee_id = e.id
ORDER BY a.date DESC
LIMIT 10;

-- =============================================
-- NOTA: NÃO remova a coluna employee_id da tabela appointments ainda!
-- Vamos manter para compatibilidade e depois remover quando tudo estiver funcionando.
-- =============================================

