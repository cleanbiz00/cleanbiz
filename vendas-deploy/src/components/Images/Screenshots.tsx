'use client'

import React from 'react'

export const DashboardScreenshot = () => (
  <svg viewBox="0 0 800 600" className="w-full h-auto">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
      <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f8fafc" />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="800" height="600" fill="url(#bg)" rx="12" />
    
    {/* Header */}
    <rect x="20" y="20" width="760" height="80" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    
    {/* Logo */}
    <circle cx="60" cy="60" r="20" fill="#06b6d4" />
    <text x="90" y="50" fontSize="20" fontWeight="bold" fill="#1e293b">CleanBiz360</text>
    <text x="90" y="70" fontSize="12" fill="#64748b">Sistema Premium</text>
    
    {/* Stats Cards */}
    <rect x="20" y="120" width="180" height="120" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="30" y="140" fontSize="14" fill="#64748b">Receita Mensal</text>
    <text x="30" y="170" fontSize="24" fontWeight="bold" fill="#10b981">$12,450</text>
    
    <rect x="220" y="120" width="180" height="120" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="230" y="140" fontSize="14" fill="#64748b">Total de Clientes</text>
    <text x="230" y="170" fontSize="24" fontWeight="bold" fill="#3b82f6">247</text>
    
    <rect x="420" y="120" width="180" height="120" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="430" y="140" fontSize="14" fill="#64748b">Funcionários</text>
    <text x="430" y="170" fontSize="24" fontWeight="bold" fill="#8b5cf6">12</text>
    
    <rect x="620" y="120" width="160" height="120" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="630" y="140" fontSize="14" fill="#64748b">Agendamentos</text>
    <text x="630" y="170" fontSize="24" fontWeight="bold" fill="#f59e0b">8</text>
    
    {/* Chart */}
    <rect x="20" y="260" width="380" height="200" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="30" y="280" fontSize="16" fontWeight="bold" fill="#1e293b">Receita dos Últimos 6 Meses</text>
    
    {/* Simple Chart */}
    <polyline 
      points="50,350 120,300 190,320 260,280 330,290 400,250" 
      fill="none" 
      stroke="#06b6d4" 
      strokeWidth="3"
    />
    <circle cx="50" cy="350" r="4" fill="#06b6d4" />
    <circle cx="120" cy="300" r="4" fill="#06b6d4" />
    <circle cx="190" cy="320" r="4" fill="#06b6d4" />
    <circle cx="260" cy="280" r="4" fill="#06b6d4" />
    <circle cx="330" cy="290" r="4" fill="#06b6d4" />
    <circle cx="400" cy="250" r="4" fill="#06b6d4" />
    
    {/* Recent Appointments */}
    <rect x="420" y="260" width="360" height="200" fill="url(#card)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="430" y="280" fontSize="16" fontWeight="bold" fill="#1e293b">Próximos Agendamentos</text>
    
    <rect x="430" y="290" width="340" height="40" fill="#f8fafc" rx="4" />
    <text x="440" y="310" fontSize="12" fill="#64748b">Hoje, 14:00</text>
    <text x="440" y="325" fontSize="14" fill="#1e293b">Maria Silva - Limpeza Completa</text>
    
    <rect x="430" y="340" width="340" height="40" fill="#f8fafc" rx="4" />
    <text x="440" y="360" fontSize="12" fill="#64748b">Amanhã, 09:00</text>
    <text x="440" y="375" fontSize="14" fill="#1e293b">João Santos - Limpeza Residencial</text>
    
    <rect x="430" y="390" width="340" height="40" fill="#f8fafc" rx="4" />
    <text x="440" y="410" fontSize="12" fill="#64748b">Amanhã, 15:30</text>
    <text x="440" y="425" fontSize="14" fill="#1e293b">Ana Costa - Limpeza Pós-Obra</text>
  </svg>
)

export const AgendaScreenshot = () => (
  <svg viewBox="0 0 800 600" className="w-full h-auto">
    <defs>
      <linearGradient id="agendaBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      <linearGradient id="agendaCard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#fefce8" />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="800" height="600" fill="url(#agendaBg)" rx="12" />
    
    {/* Header */}
    <rect x="20" y="20" width="760" height="80" fill="url(#agendaCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="40" y="50" fontSize="24" fontWeight="bold" fill="#1e293b">📅 Agenda</text>
    <text x="40" y="70" fontSize="14" fill="#64748b">Gerencie seus agendamentos em português</text>
    
    {/* Calendar Grid */}
    <rect x="20" y="120" width="760" height="400" fill="url(#agendaCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    
    {/* Calendar Header */}
    <rect x="20" y="120" width="760" height="40" fill="#06b6d4" rx="8" />
    <text x="380" y="145" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">Dezembro 2024</text>
    
    {/* Days of week */}
    <text x="40" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Dom</text>
    <text x="120" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Seg</text>
    <text x="200" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Ter</text>
    <text x="280" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Qua</text>
    <text x="360" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Qui</text>
    <text x="440" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Sex</text>
    <text x="520" y="175" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Sáb</text>
    
    {/* Calendar Days with appointments */}
    <rect x="30" y="185" width="100" height="60" fill="#f0f9ff" stroke="#e2e8f0" rx="4" />
    <text x="80" y="205" fontSize="12" fill="#64748b" textAnchor="middle">1</text>
    
    <rect x="150" y="185" width="100" height="60" fill="#dcfce7" stroke="#22c55e" rx="4" />
    <text x="200" y="205" fontSize="12" fill="#16a34a" textAnchor="middle">2</text>
    <text x="200" y="220" fontSize="10" fill="#16a34a" textAnchor="middle">Maria - 14:00</text>
    
    <rect x="270" y="185" width="100" height="60" fill="#fef3c7" stroke="#f59e0b" rx="4" />
    <text x="320" y="205" fontSize="12" fill="#d97706" textAnchor="middle">3</text>
    <text x="320" y="220" fontSize="10" fill="#d97706" textAnchor="middle">João - 09:00</text>
    
    {/* Google Calendar Integration */}
    <rect x="20" y="520" width="760" height="60" fill="#e0f2fe" stroke="#06b6d4" rx="8" />
    <text x="40" y="545" fontSize="14" fontWeight="bold" fill="#0c4a6e">🔗 Integração com Google Calendar</text>
    <text x="40" y="565" fontSize="12" fill="#0369a1">Sincronização automática • Notificações por email • Acesso em qualquer dispositivo</text>
  </svg>
)

export const FinanceiroScreenshot = () => (
  <svg viewBox="0 0 800 600" className="w-full h-auto">
    <defs>
      <linearGradient id="financeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ecfdf5" />
        <stop offset="100%" stopColor="#d1fae5" />
      </linearGradient>
      <linearGradient id="financeCard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f0fdf4" />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="800" height="600" fill="url(#financeBg)" rx="12" />
    
    {/* Header */}
    <rect x="20" y="20" width="760" height="80" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="40" y="50" fontSize="24" fontWeight="bold" fill="#1e293b">💰 Financeiro</text>
    <text x="40" y="70" fontSize="14" fill="#64748b">Controle total das suas finanças</text>
    
    {/* Summary Cards */}
    <rect x="20" y="120" width="180" height="100" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="30" y="140" fontSize="12" fill="#64748b">Receita Total</text>
    <text x="30" y="165" fontSize="20" fontWeight="bold" fill="#10b981">$15,420</text>
    <text x="30" y="180" fontSize="10" fill="#059669">+12% vs mês anterior</text>
    
    <rect x="220" y="120" width="180" height="100" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="230" y="140" fontSize="12" fill="#64748b">Despesas</text>
    <text x="230" y="165" fontSize="20" fontWeight="bold" fill="#ef4444">$8,750</text>
    <text x="230" y="180" fontSize="10" fill="#dc2626">+5% vs mês anterior</text>
    
    <rect x="420" y="120" width="180" height="100" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="430" y="140" fontSize="12" fill="#64748b">Lucro Líquido</text>
    <text x="430" y="165" fontSize="20" fontWeight="bold" fill="#3b82f6">$6,670</text>
    <text x="430" y="180" fontSize="10" fill="#2563eb">+18% vs mês anterior</text>
    
    <rect x="620" y="120" width="160" height="100" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="630" y="140" fontSize="12" fill="#64748b">Margem</text>
    <text x="630" y="165" fontSize="20" fontWeight="bold" fill="#8b5cf6">43.2%</text>
    <text x="630" y="180" fontSize="10" fill="#7c3aed">Excelente!</text>
    
    {/* Chart */}
    <rect x="20" y="240" width="380" height="200" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="30" y="260" fontSize="16" fontWeight="bold" fill="#1e293b">Evolução Financeira</text>
    
    {/* Bar Chart */}
    <rect x="50" y="350" width="40" height="60" fill="#10b981" rx="4" />
    <text x="70" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Jan</text>
    
    <rect x="110" y="320" width="40" height="90" fill="#10b981" rx="4" />
    <text x="130" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Fev</text>
    
    <rect x="170" y="300" width="40" height="110" fill="#10b981" rx="4" />
    <text x="190" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Mar</text>
    
    <rect x="230" y="280" width="40" height="130" fill="#10b981" rx="4" />
    <text x="250" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Abr</text>
    
    <rect x="290" y="260" width="40" height="150" fill="#10b981" rx="4" />
    <text x="310" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Mai</text>
    
    <rect x="350" y="240" width="40" height="170" fill="#06b6d4" rx="4" />
    <text x="370" y="425" fontSize="10" fill="#64748b" textAnchor="middle">Jun</text>
    
    {/* Recent Transactions */}
    <rect x="420" y="240" width="360" height="200" fill="url(#financeCard)" rx="8" stroke="#e2e8f0" strokeWidth="1" />
    <text x="430" y="260" fontSize="16" fontWeight="bold" fill="#1e293b">Últimas Transações</text>
    
    <rect x="430" y="270" width="340" height="35" fill="#f0fdf4" rx="4" />
    <circle cx="445" cy="285" r="8" fill="#10b981" />
    <text x="460" y="285" fontSize="12" fill="#1e293b">Limpeza Residencial</text>
    <text x="460" y="300" fontSize="10" fill="#64748b">Maria Silva</text>
    <text x="750" y="290" fontSize="14" fontWeight="bold" fill="#10b981" textAnchor="end">+$150</text>
    
    <rect x="430" y="315" width="340" height="35" fill="#fef2f2" rx="4" />
    <circle cx="445" cy="330" r="8" fill="#ef4444" />
    <text x="460" y="330" fontSize="12" fill="#1e293b">Produtos de Limpeza</text>
    <text x="460" y="345" fontSize="10" fill="#64748b">Fornecedor</text>
    <text x="750" y="335" fontSize="14" fontWeight="bold" fill="#ef4444" textAnchor="end">-$85</text>
    
    <rect x="430" y="360" width="340" height="35" fill="#f0fdf4" rx="4" />
    <circle cx="445" cy="375" r="8" fill="#10b981" />
    <text x="460" y="375" fontSize="12" fill="#1e293b">Limpeza Comercial</text>
    <text x="460" y="390" fontSize="10" fill="#64748b">Empresa ABC</text>
    <text x="750" y="380" fontSize="14" fontWeight="bold" fill="#10b981" textAnchor="end">+$320</text>
  </svg>
)

export const ClientTestimonial = ({ name, initials, color }: { name: string, initials: string, color: string }) => (
  <svg viewBox="0 0 120 120" className="w-20 h-20 rounded-full">
    <defs>
      <linearGradient id={`gradient-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} style={{ stopOpacity: 0.8 }} />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="60" fill={`url(#gradient-${name})`} />
    <text x="60" y="70" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle">{initials}</text>
  </svg>
)
