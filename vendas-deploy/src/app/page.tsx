'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  Shield, 
  Zap,
  ArrowRight,
  Play,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Rocket,
  Globe,
  FileText,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Medal
} from 'lucide-react'

export default function VendasPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 40
  })

  // Contador regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const scrollToCTA = (section: string) => {
    const element = document.getElementById(section)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CleanBiz360</h1>
              </div>
            </div>
            <button 
              onClick={() => scrollToCTA('pricing')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              COMECE AGORA COM 7 DIAS GRÁTIS
            </button>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              {/* Tag */}
              <div className="inline-block bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                O que fazemos por você
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                TRANSFORME SUA{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  EMPRESA DE LIMPEZA
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Torne seu negócio profissional e escalável com nossa plataforma completa de gestão empresarial.
              </p>
              
              <button 
                onClick={() => scrollToCTA('pricing')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-2"
              >
                <span>COMECE AGORA COM 7 DIAS GRÁTIS</span>
                <Rocket className="h-5 w-5" />
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                Não precisa de cartão de crédito
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
                <div className="w-full h-80 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Área de apresentação</h3>
                    <p className="text-cyan-200 text-sm">
                      Assista ao vídeo de apresentação do CleanBiz360
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="text-center mb-8">
            <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Nossa Empresa
            </div>
            </div>
            
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              GESTÃO EMPRESARIAL COMPLETA{' '}
              <span className="text-blue-600">PARA SUA EMPRESA DE LIMPEZA</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma completa que transforma sua empresa de limpeza em um negócio profissional e escalável.
            </p>
          </div>
          
          {/* Main Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Interativo</h3>
              <p className="text-gray-600 mb-6">
                Visualize todas as métricas importantes do seu negócio em tempo real.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Screenshot do Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agenda Inteligente</h3>
              <p className="text-gray-600 mb-6">
                Gerencie todos os seus agendamentos de forma eficiente e organizada.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Screenshot da Agenda</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Relatórios Avançados</h3>
              <p className="text-gray-600 mb-6">
                Acompanhe o crescimento do seu negócio com relatórios detalhados.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Screenshot dos Relatórios</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Icons Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">CRM e Gestão de Clientes</h3>
              <p className="text-gray-600 text-sm">Organize todos os seus clientes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gestão de Documentos</h3>
              <p className="text-gray-600 text-sm">Mantenha tudo organizado</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agenda Integrada</h3>
              <p className="text-gray-600 text-sm">Nunca perca um agendamento</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Controle Financeiro</h3>
              <p className="text-gray-600 text-sm">Acompanhe receitas e despesas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Acesso Online</h3>
              <p className="text-gray-600 text-sm">Funciona em qualquer dispositivo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Segurança Total</h3>
              <p className="text-gray-600 text-sm">Seus dados protegidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Nossos Benefícios
            </div>
            </div>
            
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              BENEFÍCIOS QUE TRANSFORMAM{' '}
              <span className="text-green-600">SEU NEGÓCIO</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como nossa plataforma pode revolucionar a gestão da sua empresa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economia de Tempo</h3>
              <p className="text-gray-600">
                Automatize processos e economize horas de trabalho manual todos os dias.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Crescimento Acelerado</h3>
              <p className="text-gray-600">
                Escale seu negócio com ferramentas profissionais de gestão.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Aumento de Receita</h3>
              <p className="text-gray-600">
                Maximize seus lucros com melhor controle financeiro e gestão.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Eficiência Máxima</h3>
              <p className="text-gray-600">
                Otimize todos os processos da sua empresa de limpeza.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acesso Mobile</h3>
              <p className="text-gray-600">
                Gerencie seu negócio de qualquer lugar, a qualquer hora.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Segurança Garantida</h3>
              <p className="text-gray-600">
                Seus dados protegidos com tecnologia de ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Depoimentos
            </div>
            </div>
            
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O QUE NOSSOS CLIENTES{' '}
              <span className="text-blue-600">DIZEM</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como nossa plataforma transformou o negócio de outros empresários.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "O CleanBiz360 revolucionou minha empresa. Agora consigo gerenciar tudo de forma muito mais eficiente e profissional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">CS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Carla S.</p>
                  <p className="text-gray-600 text-sm">Empresária em Goiânia, GO</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "A plataforma é incrível! Me ajudou a organizar minha agenda e aumentar significativamente minha receita."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">RF</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rafael F.</p>
                  <p className="text-gray-600 text-sm">CEO da Fast Clean</p>
                </div>
              </div>
                </div>
                
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Recomendo para qualquer empresário que quer profissionalizar seu negócio. Vale cada centavo investido!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">AP</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ana P.</p>
                  <p className="text-gray-600 text-sm">Proprietária em São Paulo, SP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag */}
          <div className="mb-8">
            <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Plano Mais Popular
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            PLANOS SIMPLES E{' '}
            <span className="text-cyan-400">TRANSPARENTES</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Escolha o plano ideal para o seu negócio e comece a transformar sua empresa hoje mesmo.
          </p>

          <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Plano Profissional</h3>
              <div className="text-6xl font-bold text-white mb-4">$30/mês</div>
              <p className="text-gray-300 text-lg">Tudo que você precisa para profissionalizar sua empresa</p>
                </div>
                
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h4 className="font-bold text-white mb-4 text-lg">✅ O que está incluído:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Dashboard completo
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Gestão de clientes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Agenda integrada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Controle financeiro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Suporte 24/7
                  </li>
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="font-bold text-white mb-4 text-lg">🎯 Benefícios extras:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Acesso mobile
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Backup automático
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Integração com Google
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Atualizações gratuitas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Sem taxa de setup
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-3" />
                    Cancelamento fácil
                  </li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => scrollToCTA('cta-main')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl px-12 py-6 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>COMECE SEU TESTE GRÁTIS AGORA</span>
              <Rocket className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section id="cta-main" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            PRONTO PARA TRANSFORMAR{' '}
            <span className="text-cyan-400">SEU NEGÓCIO?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Junte-se a centenas de empresários que já transformaram suas empresas com o CleanBiz360.
          </p>
          
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl px-16 py-8 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-3 mx-auto">
            <span>QUERO MEU TESTE GRÁTIS DE 7 DIAS</span>
            <Rocket className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Dúvidas Frequentes
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              PERGUNTAS{' '}
              <span className="text-purple-600">FREQUENTES</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossa plataforma e como ela pode ajudar seu negócio.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Como funciona o teste gratuito?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-gray-600 mt-4">
                Você tem 7 dias completos para testar todas as funcionalidades da plataforma sem compromisso. Não precisa de cartão de crédito para começar.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">A plataforma é fácil de usar?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-gray-600 mt-4">
                Sim! Nossa interface foi desenvolvida para ser intuitiva e fácil de usar, mesmo para quem não tem experiência com tecnologia.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Posso cancelar a qualquer momento?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-gray-600 mt-4">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas ou multas. Seu acesso permanece ativo até o final do período pago.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Meus dados estão seguros?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-gray-600 mt-4">
                Absolutamente! Utilizamos criptografia de ponta e seguimos os mais altos padrões de segurança para proteger seus dados e os de seus clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            NOSSA MISSÃO{' '}
            <span className="text-blue-600">SEU SUCESSO</span>
          </h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Acreditamos que toda empresa de limpeza merece ter acesso a ferramentas profissionais de gestão, independentemente do seu tamanho ou experiência.
            </p>
            <p>
              Nossa missão é democratizar o acesso à tecnologia empresarial, oferecendo uma plataforma completa, acessível e fácil de usar que transforma pequenos negócios em empresas profissionais e escaláveis.
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag */}
          <div className="mb-8">
            <div className="inline-block bg-orange-400/20 text-orange-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Oferta Limitada
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            OFERTA EXCLUSIVA DE{' '}
            <span className="text-yellow-300">LANÇAMENTO!</span>
          </h2>
          <p className="text-xl text-white mb-12">
            Esta condição especial de $30/mês é válida por tempo limitado. Não perca!
          </p>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">O Preço de $30/Mês Termina Em:</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white">Dias</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white">Horas</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white">Minutos</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white">Segundos</div>
              </div>
            </div>
          </div>

          <button className="bg-white text-orange-600 text-xl px-12 py-6 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-2 mx-auto">
            <span>GARANTA SEU PREÇO AGORA!</span>
            <Rocket className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag */}
          <div className="mb-8">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Garantia Total
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            RISCO ZERO PARA{' '}
            <span className="text-green-600">VOCÊ</span>
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Medal className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">GARANTIA INCONDICIONAL DE 7 DIAS</h3>
            <p className="text-lg text-gray-600 mb-6">
              Temos tanta confiança na qualidade da nossa plataforma que oferecemos uma garantia de satisfação total.
            </p>
            <p className="text-gray-600 mb-8">
              Teste o CleanBiz360 por 7 dias completos. Se por qualquer motivo você não ficar satisfeito, faremos o reembolso de 100% do valor pago. Sem perguntas, sem complicações.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xl px-12 py-6 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-2 mx-auto">
              <span>COMECE SEU TESTE GRÁTIS AGORA</span>
              <CheckCircle2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CleanBiz360</h3>
                <p className="text-gray-400 text-sm">Transformando Limpeza em Lucro</p>
              </div>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CleanBiz360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}