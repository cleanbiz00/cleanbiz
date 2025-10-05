import React, { useMemo, useState } from 'react';

const CATEGORIES = [
  'Despesas com Pessoal',
  'Materiais e Suprimentos',
  'Transporte/Veículos',
  'Despesas Administrativas',
  'Seguros e Licenças'
];

const FREQUENCIES = ['Única', 'Semanal', 'Mensal', 'Anual'];
const TYPES = ['Fixa', 'Variável'];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function getPeriodRange(option) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  if (option === 'mes_atual') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (option === 'ultimos_3_meses') {
    start.setMonth(start.getMonth() - 2, 1);
    start.setHours(0, 0, 0, 0);
  } else if (option === 'ano_atual') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end };
}

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function generateMonthlyLabels(monthsBack = 6) {
  const labels = [];
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return labels;
}

const Financial = ({ 
  financialData, 
  clients 
}) => {
  const [expenses, setExpenses] = useState([]);
  const [recurringTemplates, setRecurringTemplates] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('mes_atual');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    category: CATEGORIES[0],
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Fixa',
    frequency: 'Única'
  });

  // Generate recurring instances for selected period
  const ensureRecurringForPeriod = (list, templates, periodKey) => {
    const { start, end } = getPeriodRange(periodKey);
    const instances = [];
    templates.forEach((t) => {
      if (t.frequency === 'Única') return;
      let cursor = new Date(start);
      // Start from the greater of template start date or period start
      const tmplStart = new Date(t.date);
      if (tmplStart > cursor) cursor = new Date(tmplStart);
      while (cursor <= end) {
        instances.push({
          id: `rec-${t.id}-${cursor.toISOString().slice(0,10)}`,
          isAuto: true,
          category: t.category,
          description: t.description,
          amount: t.amount,
          date: cursor.toISOString().slice(0, 10),
          type: t.type,
          frequency: t.frequency
        });
        if (t.frequency === 'Semanal') {
          cursor.setDate(cursor.getDate() + 7);
        } else if (t.frequency === 'Mensal') {
          cursor.setMonth(cursor.getMonth() + 1);
        } else if (t.frequency === 'Anual') {
          cursor.setFullYear(cursor.getFullYear() + 1);
        } else {
          break;
        }
      }
    });
    // Avoid duplicates with same category/description/date/amount
    const signature = (e) => `${e.category}|${e.description}|${e.date}|${e.amount}`;
    const existing = new Set(list.map(signature));
    const merged = [...list];
    instances.forEach((e) => {
      const sig = signature(e);
      if (!existing.has(sig)) {
        merged.push(e);
        existing.add(sig);
      }
    });
    return merged;
  };

  const filteredExpenses = useMemo(() => {
    const { start, end } = getPeriodRange(filterPeriod);
    const withRecurring = ensureRecurringForPeriod(expenses, recurringTemplates, filterPeriod);
    return withRecurring.filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
  }, [expenses, recurringTemplates, filterPeriod]);

  const totalsByCategory = useMemo(() => {
    const map = new Map();
    filteredExpenses.forEach((e) => {
      map.set(e.category, (map.get(e.category) || 0) + Number(e.amount || 0));
    });
    return map;
  }, [filteredExpenses]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filteredExpenses]);

  const revenue = financialData?.revenue || 0;
  const realProfit = revenue - totalExpenses;
  const margin = revenue > 0 ? (realProfit / revenue) * 100 : 0;

  const monthlyLabels = useMemo(() => generateMonthlyLabels(6), []);
  const monthlyTotals = useMemo(() => {
    const totals = Object.fromEntries(monthlyLabels.map((k) => [k, 0]));
    const all = ensureRecurringForPeriod(expenses, recurringTemplates, 'ano_atual');
    all.forEach((e) => {
      const key = monthKey(e.date);
      if (key in totals) totals[key] += Number(e.amount || 0);
    });
    return monthlyLabels.map((k) => totals[k]);
  }, [expenses, recurringTemplates, monthlyLabels]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      category: CATEGORIES[0],
      description: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      type: 'Fixa',
      frequency: 'Única'
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || Date.now(),
      category: form.category,
      description: form.description,
      amount: Number(form.amount || 0),
      date: form.date,
      type: form.type,
      frequency: form.frequency
    };
    if (editingId) {
      setExpenses((prev) => prev.map((x) => (x.id === editingId ? payload : x)));
      setEditingId(null);
    } else {
      setExpenses((prev) => [...prev, payload]);
    }
    // Manage recurring templates if fixed and not one-time
    if (payload.type === 'Fixa' && payload.frequency !== 'Única') {
      setRecurringTemplates((prev) => {
        const exists = prev.find(
          (t) => t.category === payload.category && t.description === payload.description && t.frequency === payload.frequency && t.type === payload.type
        );
        if (exists) return prev;
        return [
          ...prev,
          { id: Date.now(), category: payload.category, description: payload.description, amount: payload.amount, date: payload.date, type: payload.type, frequency: payload.frequency }
        ];
      });
    }
    resetForm();
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      category: item.category,
      description: item.description,
      amount: item.amount,
      date: item.date,
      type: item.type,
      frequency: item.frequency
    });
  };

  const onDelete = (id) => {
    setExpenses((prev) => prev.filter((x) => x.id !== id));
  };

  // Simple Pie Chart (SVG)
  const PieChart = ({ dataMap }) => {
    const entries = Array.from(dataMap.entries());
    const total = entries.reduce((s, [, v]) => s + v, 0);
    let cumulative = 0;
    const radius = 50;
    const center = 60;
    const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#14b8a6'];
    const arcs = entries.map(([label, value], idx) => {
      const fraction = total > 0 ? value / total : 0;
      const startAngle = cumulative * 2 * Math.PI;
      const endAngle = (cumulative + fraction) * 2 * Math.PI;
      cumulative += fraction;
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const largeArc = fraction > 0.5 ? 1 : 0;
      const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      return (
        <path key={label} d={d} fill={colors[idx % colors.length]} />
      );
    });
    return (
      <div className="flex items-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mr-4">{arcs}</svg>
        <div className="space-y-1 text-sm">
          {entries.map(([label, value], idx) => (
            <div key={label} className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#14b8a6'][idx % 6] }} />
              <span>{label}</span>
              <span className="text-gray-500">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple Line Chart (SVG)
  const LineChart = ({ labels, values }) => {
    const width = 320;
    const height = 140;
    const padding = 30;
    const maxVal = Math.max(1, ...values);
    const points = values.map((v, i) => {
      const x = padding + (i * (width - padding * 2)) / (values.length - 1 || 1);
      const y = height - padding - (v / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={width} height={height} className="w-full">
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" />
        {/* Labels */}
        {labels.map((l, i) => {
          const x = padding + (i * (width - padding * 2)) / (labels.length - 1 || 1);
          return (
            <text key={l} x={x} y={height - padding + 14} fontSize="10" textAnchor="middle" fill="#475569">{l.slice(5)}</text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Financeiro</h2>

      {/* Resumo topo com comparação Receita vs Despesas e Margem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Receita</h3>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(revenue)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Despesas (período)</h3>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-1">Lucro Real</h3>
          <div className="text-2xl font-bold text-blue-700">{formatCurrency(realProfit)}</div>
          <div className="text-sm text-gray-600">Margem: {margin.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gestão de Despesas - Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Gestão de Despesas</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select className="w-full border rounded p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input className="w-full border rounded p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex.: Salários, Produtos de limpeza" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input type="number" step="0.01" className="w-full border rounded p-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input type="date" className="w-full border rounded p-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select className="w-full border rounded p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequência</label>
                <select className="w-full border rounded p-2" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingId ? 'Salvar alterações' : 'Adicionar despesa'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-600 hover:underline">Cancelar</button>
              )}
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-4">Despesas fixas com frequência diferente de "Única" serão adicionadas como recorrentes automaticamente.</p>
        </div>

        {/* Lista + Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold">Despesas cadastradas</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Período</label>
              <select className="border rounded p-2" value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
                <option value="mes_atual">Mês atual</option>
                <option value="ultimos_3_meses">Últimos 3 meses</option>
                <option value="ano_atual">Ano atual</option>
              </select>
            </div>
          </div>
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-left p-2">Descrição</th>
                  <th className="text-right p-2">Valor</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Frequência</th>
                  <th className="text-right p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2">{e.description}</td>
                    <td className="p-2 text-right">{formatCurrency(e.amount)}</td>
                    <td className="p-2">{e.type}</td>
                    <td className="p-2">{e.frequency}</td>
                    <td className="p-2 text-right space-x-2">
                      {!e.isAuto && (
                        <button onClick={() => onEdit(e)} className="text-blue-600 hover:underline">Editar</button>
                      )}
                      {!e.isAuto && (
                        <button onClick={() => onDelete(e.id)} className="text-red-600 hover:underline">Excluir</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td className="p-3 text-center text-gray-500" colSpan={7}>Nenhuma despesa para o período selecionado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dashboard de resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Total por categoria</h3>
          {totalsByCategory.size > 0 ? (
            <PieChart dataMap={totalsByCategory} />
          ) : (
            <p className="text-gray-500 text-sm">Cadastre despesas para visualizar o gráfico.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Evolução mensal</h3>
          <LineChart labels={monthlyLabels} values={monthlyTotals} />
        </div>
      </div>

      {/* Receita por Cliente (mantido) */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">Receita por Cliente</h3>
        <div className="space-y-3">
          {clients.map(client => (
            <div key={client.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-600">{client.frequency}</p>
              </div>
              <span className="text-green-600 font-bold">${client.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financial;
