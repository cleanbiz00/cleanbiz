# 👥 Feature: Múltiplos Funcionários por Agendamento

## 📋 Descrição

Permite alocar **múltiplos funcionários** em um único agendamento.

## 🗄️ Estrutura do Banco

### Nova Tabela: `appointment_employees`

```sql
CREATE TABLE appointment_employees (
  id uuid PRIMARY KEY,
  appointment_id uuid REFERENCES appointments(id),
  employee_id uuid REFERENCES employees(id),
  created_at timestamptz,
  UNIQUE(appointment_id, employee_id)
);
```

**Relacionamento:** Muitos-para-muitos entre `appointments` e `employees`

### Migração de Dados

✅ Dados existentes foram migrados automaticamente da coluna `employee_id` para a nova tabela
✅ Coluna `employee_id` mantida para compatibilidade (armazena o primeiro funcionário selecionado)

## 🔒 Segurança

✅ RLS habilitado na tabela `appointment_employees`
✅ Políticas garantem que cada usuário vê apenas seus próprios relacionamentos

## 💻 Implementação no Código

### Carregamento de Agendamentos

```typescript
// Carrega appointments com array de employeeIds
const appointmentsWithEmployees = await Promise.all(
  data.map(async (apt) => {
    const { data: empRelations } = await supabase
      .from('appointment_employees')
      .select('employee_id')
      .eq('appointment_id', apt.id)
    
    return {
      ...apt,
      employeeIds: empRelations?.map(rel => rel.employee_id) || []
    }
  })
)
```

### Salvamento de Agendamentos

```typescript
// 1. Salva o agendamento
const { data: newApt } = await supabase
  .from('appointments')
  .insert({
    ...appointmentData,
    employee_id: employeeIds[0] // Primeiro para compatibilidade
  })

// 2. Salva os relacionamentos
const employeeRelations = employeeIds.map(empId => ({
  appointment_id: newApt[0].id,
  employee_id: empId
}))

await supabase
  .from('appointment_employees')
  .insert(employeeRelations)
```

### Atualização de Agendamentos

```typescript
// 1. Atualiza o agendamento
await supabase
  .from('appointments')
  .update(appointmentData)
  .eq('id', appointmentId)

// 2. Remove relacionamentos antigos
await supabase
  .from('appointment_employees')
  .delete()
  .eq('appointment_id', appointmentId)

// 3. Insere novos relacionamentos
await supabase
  .from('appointment_employees')
  .insert(newEmployeeRelations)
```

## 🎨 Interface do Usuário

### Formulário de Agendamento

**Antes:** Select simples (um funcionário)
```jsx
<select value={employeeId}>
  <option value="">Selecione</option>
  {employees.map(...)}
</select>
```

**Depois:** Checkboxes multi-seleção
```jsx
<div>
  <label>Funcionários (selecione um ou mais):</label>
  {employees.map(emp => (
    <label>
      <input 
        type="checkbox"
        checked={employeeIds.includes(emp.id)}
        onChange={handleToggle}
      />
      {emp.name}
    </label>
  ))}
  <p>{employeeIds.length} funcionário(s) selecionado(s)</p>
</div>
```

### Exibição de Agendamentos

**Tabela:**
- Mostra todos os funcionários separados por vírgula
- Ex: "André, Arthur, João"

**Cards Mobile:**
- Mostra todos os funcionários
- Linha mais compacta

**Modal de Detalhes:**
- "Funcionário(s) Responsável(is):"
- Lista completa de nomes

## ✅ Compatibilidade

### Agendamentos Antigos
- ✅ Automaticamente migrados para a nova estrutura
- ✅ Continuam funcionando normalmente
- ✅ Campo `employee_id` preservado para compatibilidade

### Google Calendar & Email
- ✅ Envia o nome do primeiro funcionário selecionado
- ✅ Mantém compatibilidade com APIs existentes

## 📊 Benefícios

1. **Flexibilidade:** Alocar quantos funcionários forem necessários
2. **Realidade:** Reflete melhor como serviços reais funcionam
3. **Escalabilidade:** Fácil adicionar/remover funcionários
4. **UX:** Interface intuitiva com checkboxes
5. **Compatibilidade:** Zero breaking changes

## 🧪 Testes

### Criar Novo Agendamento:
1. Abrir modal de novo agendamento
2. Selecionar múltiplos funcionários (checkbox)
3. Salvar
4. ✅ Deve aparecer todos os nomes na lista/tabela

### Editar Agendamento Existente:
1. Clicar em um agendamento
2. Botão "Editar"
3. Checkboxes devem estar marcados corretamente
4. Mudar seleção
5. Salvar
6. ✅ Deve atualizar os funcionários

### Visualização:
- ✅ Tabela desktop: lista completa
- ✅ Cards mobile: lista completa
- ✅ Modal detalhes: lista completa
- ✅ Calendário: mostra todos (se implementado)

## 📝 Notas Técnicas

- Validação: Requer pelo menos 1 funcionário
- Formato: `employeeIds` é um array de UUIDs
- Fallback: Se `employeeIds` vazio, usa `employeeId` legado
- Performance: Carrega relacionamentos com Promise.all (paralelo)

