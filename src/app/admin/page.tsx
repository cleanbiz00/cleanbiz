'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Crown,
  CreditCard,
  Activity,
  Database,
  Zap,
  Globe,
  Github,
  Shield,
  Target,
  PieChart
} from 'lucide-react'

interface SaaSMetrics {
  revenue: {
    monthly: number
    yearly: number
    growth: number
    mrr: number
  }
  customers: {
    total: number
    active: number
    paying: number
    churn: number
    newThisMonth: number
  }
  usage: {
    totalApiCalls: number
    totalStorage: number
    totalBandwidth: number
    avgUsagePerCustomer: number
  }
  systems: {
    vercel: any
    supabase: any
    github: any
    domains: any
  }
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<SaaSMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  useEffect(() => {
    const fetchSaaSMetrics = async () => {
      try {
        const [vercelRes, supabaseRes, githubRes, domainsRes] = await Promise.all([
          fetch('/api/admin/vercel'),
          fetch('/api/admin/supabase'),
          fetch('/api/admin/github'),
          fetch('/api/admin/domains')
        ])

        const [vercelData, supabaseData, githubData, domainsData] = await Promise.all([
          vercelRes.json(),
          supabaseRes.json(),
          githubRes.json(),
          domainsRes.json()
        ])

        // Simular métricas de SaaS (em produção, você buscaria dados reais de pagamentos)
        const saasMetrics: SaaSMetrics = {
          revenue: {
            monthly: 12500,
            yearly: 150000,
            growth: 18.5,
            mrr: 12500
          },
          customers: {
            total: supabaseData.database?.users || 0,
            active: Math.floor((supabaseData.database?.users || 0) * 0.85),
            paying: Math.floor((supabaseData.database?.users || 0) * 0.65),
            churn: 2.3,
            newThisMonth: 12
          },
          usage: {
            totalApiCalls: parseInt(supabaseData.api?.calls?.replace('K', '000') || '8200'),
            totalStorage: 156,
            totalBandwidth: 2.3,
            avgUsagePerCustomer: Math.floor(8200 / (supabaseData.database?.users || 1))
          },
          systems: {
            vercel: vercelData,
            supabase: supabaseData,
            github: githubData,
            domains: domainsData
          }
        }

        setMetrics(saasMetrics)
      } catch (error) {
        console.error('Erro ao carregar métricas SaaS:', error)
        // Fallback para dados simulados
        setMetrics({
          revenue: {
            monthly: 12500,
            yearly: 150000,
            growth: 18.5,
            mrr: 12500
          },
          customers: {
            total: 0,
            active: 0,
            paying: 0,
            churn: 2.3,
            newThisMonth: 12
          },
          usage: {
            totalApiCalls: 8200,
            totalStorage: 156,
            totalBandwidth: 2.3,
            avgUsagePerCustomer: 0
          },
          systems: {
            vercel: { status: 'online', uptime: '99.9%' },
            supabase: { status: 'online', uptime: '99.8%' },
            github: { status: 'warning', uptime: '99.5%' },
            domains: { status: 'online', uptime: '100%' }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSaaSMetrics()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 dark:text-green-400'
    if (growth < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  if (loading || !metrics) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Painel SaaS - CleanBiz360
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Controle completo do seu negócio SaaS - Métricas, clientes e receita
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Receita Mensal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Receita Mensal</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {formatCurrency(metrics.revenue.monthly)}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className={`text-sm font-medium ${getGrowthColor(metrics.revenue.growth)}`}>
              +{metrics.revenue.growth}% este mês
            </span>
          </div>
        </div>

        {/* MRR */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">MRR</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {formatCurrency(metrics.revenue.mrr)}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">
              Recurring
            </span>
          </div>
        </div>

        {/* Clientes Pagantes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Clientes Pagantes</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {metrics.customers.paying}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              de {metrics.customers.total} total
            </span>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Churn Rate</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {metrics.customers.churn}%
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-orange-600 dark:text-orange-400">
              Últimos 30 dias
            </span>
          </div>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status dos Sistemas */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Status dos Sistemas</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Vercel</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.systems.vercel.status)}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {metrics.systems.vercel.uptime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-green-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Supabase</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.systems.supabase.status)}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {metrics.systems.supabase.uptime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Github className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">GitHub</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.systems.github.status)}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {metrics.systems.github.uptime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-cyan-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Domínios</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.systems.domains.status)}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {metrics.systems.domains.uptime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Uso de Recursos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Uso de Recursos</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">API Calls</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {metrics.usage.totalApiCalls.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '16%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {metrics.usage.totalStorage}MB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '31%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Bandwidth</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {metrics.usage.totalBandwidth}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '2%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Clientes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Resumo de Clientes</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.customers.total}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total de Clientes</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.customers.active}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Clientes Ativos</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.customers.paying}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Pagantes</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {metrics.customers.newThisMonth}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Novos Este Mês</div>
          </div>
        </div>
      </div>
    </div>
  )
}
