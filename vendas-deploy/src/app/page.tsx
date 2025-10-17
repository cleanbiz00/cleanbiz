'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
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
  Award
} from 'lucide-react'
import { 
  DashboardScreenshot, 
  AgendaScreenshot, 
  FinanceiroScreenshot, 
  ClientTestimonial 
} from '@/components/Images/Screenshots'

export default function VendasPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">CleanBiz360</h1>
                <p className="text-slate-600 text-sm">Sistema Premium</p>
              </div>
            </div>
            <button 
              onClick={() => scrollToCTA('cta-principal')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              QUERO PROFISSIONALIZAR MINHA EMPRESA AGORA!
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-indigo-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Transforme Sua Empresa de Limpeza em um 
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Negócio 100% Profissional</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              Chega de gerenciar seu House Cleaning em inglês! Descubra o software criado para brasileiros nos EUA que querem escalar seus resultados.
            </p>
            
            {/* Video Placeholder */}
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">VÍDEO DE APRESENTAÇÃO</h3>
                  <p className="text-cyan-200 text-sm">
                    RESERVE ESTE ESPAÇO PARA O VÍDEO PRONTO - TAXA DE CONVERSÃO ATÉ 80% MAIOR COM VÍDEO
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Principal */}
            <div id="cta-principal" className="mb-16">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl px-12 py-6 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                QUERO PROFISSIONALIZAR MINHA EMPRESA AGORA!
                <ArrowRight className="inline-block ml-2 h-6 w-6" />
              </button>
              <p className="text-slate-500 text-sm mt-4">✨ Garantia de 7 dias • Sem taxa de setup • Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Descrição do Produto */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              O CleanBiz360 é a Gestão Empresarial Completa que Você Sempre Quis, 
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> no Idioma que Você Domina</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Desenvolvido exclusivamente para o setor de limpeza residencial (House Cleaning), o CleanBiz360 elimina a confusão das ferramentas genéricas.
            </p>
          </div>

          {/* Screenshots do Sistema */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">📊 Dashboard</h3>
                <DashboardScreenshot />
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">📅 Agenda</h3>
                <AgendaScreenshot />
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">💰 Financeiro</h3>
                <FinanceiroScreenshot />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard */}
            <div className="bg-gradient-to-br from-white to-cyan-50 p-8 rounded-2xl border border-cyan-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Dashboard Inteligente</h3>
              <p className="text-slate-600 mb-4">
                Tenha a visão geral do seu negócio em tempo real. Saiba quantos agendamentos tem na semana, qual o lucro esperado e o desempenho da sua equipe, tudo em português.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Métricas em tempo real</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Interface 100% em português</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Relatórios automáticos</li>
              </ul>
            </div>

            {/* CRM */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Gestão de Clientes (CRM)</h3>
              <p className="text-slate-600 mb-4">
                Mantenha o histórico de serviço, endereços, preferências de limpeza e dados de contato organizados, permitindo um atendimento personalizado.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Histórico completo</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Busca inteligente</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Atendimento personalizado</li>
              </ul>
            </div>

            {/* Funcionários */}
            <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Gestão de Funcionários</h3>
              <p className="text-slate-600 mb-4">
                Controle total da sua equipe, registro de tarefas e acompanhamento de produtividade, garantindo que você aumente a eficiência em até 30%.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Controle de equipe</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Acompanhamento de produtividade</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Registro de tarefas</li>
              </ul>
            </div>

            {/* Agenda */}
            <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Agenda Integrada</h3>
              <p className="text-slate-600 mb-4">
                Nunca mais perca um agendamento. Sincronização automática e nativa com o Google Calendar e sistema de notificação automática de e-mail.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Google Calendar integrado</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Notificações automáticas</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Visualização em calendário</li>
              </ul>
            </div>

            {/* Financeiro */}
            <div className="bg-gradient-to-br from-white to-yellow-50 p-8 rounded-2xl border border-yellow-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Controle Financeiro</h3>
              <p className="text-slate-600 mb-4">
                Registre receitas e despesas com terminologia adequada ao seu negócio de limpeza, e gere relatórios claros para você e seu contador.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Receitas e despesas</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Relatórios automáticos</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Análise de lucratividade</li>
              </ul>
            </div>

            {/* Segurança */}
            <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-2xl border border-red-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Segurança Total</h3>
              <p className="text-slate-600 mb-4">
                Seus dados estão seguros com backup automático, acesso 24/7 via cloud e criptografia de ponta a ponta.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Backup automático</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Acesso 24/7</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Criptografia total</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Não Vendemos Software, Vendemos 
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Tranquilidade e Crescimento</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Veja o que você ganha com o CleanBiz360 - resultados mensuráveis que transformam seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Economia de Tempo</h3>
              </div>
              <p className="text-slate-600 mb-4">
                <strong>Característica:</strong> Interface 100% em Português
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Benefício:</strong> Paz de Espírito - Você finalmente gerencia seu negócio sem as frustrações da barreira linguística.
              </p>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-green-800 font-bold text-lg">50% de Redução no Estresse</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Produtividade</h3>
              </div>
              <p className="text-slate-600 mb-4">
                <strong>Característica:</strong> Fluxo Otimizado para House Cleaning
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Benefício:</strong> Eficiência Imediata - Funções pensadas para o seu dia a dia.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-800 font-bold text-lg">Economia de 10-15 horas/semana</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Controle Financeiro</h3>
              </div>
              <p className="text-slate-600 mb-4">
                <strong>Característica:</strong> Controle Financeiro Simples
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Benefício:</strong> Mais Lucro no Seu Bolso - Tenha relatórios que você entende.
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-purple-800 font-bold text-lg">Melhoria de 15-25% no Controle</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Gestão de Equipe</h3>
              </div>
              <p className="text-slate-600 mb-4">
                <strong>Característica:</strong> Gestão de Equipe Centralizada
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Benefício:</strong> Produtividade em Alta - Maximize o tempo da sua equipe.
              </p>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="text-yellow-800 font-bold text-lg">Aumento de 20-30% na Produtividade</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Liberdade Total</h3>
              </div>
              <p className="text-slate-600 mb-4">
                <strong>Característica:</strong> Cloud-based e Design Responsivo
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Benefício:</strong> Liberdade Total - Acesse os dados 24/7, de onde estiver.
              </p>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <p className="text-cyan-800 font-bold text-lg">Acesso Ilimitado aos Dados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Confiança de Quem Já Vive a Realidade do 
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> CleanBiz360</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Eu estava desistindo. Tentar usar aqueles CRMs em inglês era um pesadelo. Com o CleanBiz360, parece que estou falando com um amigo. O suporte em português é um diferencial que vale ouro! Meu dia a dia ficou leve."
              </p>
              <div className="flex items-center">
                <ClientTestimonial name="Carla" initials="CS" color="#06b6d4" />
                <div className="ml-4">
                  <p className="font-semibold text-slate-800">Carla S.</p>
                  <p className="text-slate-600 text-sm">Empresária de Limpeza em Boston, MA</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Antes era uma confusão de mensagens e papel. Agora, consigo coordenar minha equipe de 5 pessoas e os agendamentos pelo celular, em tempo real. Minha produtividade aumentou muito. Consegui pegar mais 3 clientes fixos só na última semana!"
              </p>
              <div className="flex items-center">
                <ClientTestimonial name="Rafael" initials="RF" color="#10b981" />
                <div className="ml-4">
                  <p className="font-semibold text-slate-800">Rafael F.</p>
                  <p className="text-slate-600 text-sm">CEO da 'Fast Clean' em Miami, FL</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Eu faturava bem, mas não sabia para onde o dinheiro ia. Agora, com o controle financeiro do CleanBiz360, a surpresa foi que eu estava perdendo 15% em gastos invisíveis. Consegui cortar o excesso e meu lucro real disparou."
              </p>
              <div className="flex items-center">
                <ClientTestimonial name="Ana" initials="AP" color="#8b5cf6" />
                <div className="ml-4">
                  <p className="font-semibold text-slate-800">Ana P.</p>
                  <p className="text-slate-600 text-sm">Proprietária em Newark, NJ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preço */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Pare de Pagar Caro por Ferramentas que Você 
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"> Não Usa e Não Entende</span>
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-800 text-lg">
              <strong>Quanto custa perder 10 horas por semana em burocracia?</strong><br/>
              Se você cobrar apenas $20 por hora, isso representa <strong>$800 perdidos por mês</strong> em tempo administrativo.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">O CleanBiz360 custa menos que o seu almoço semanal:</h3>
            
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
              $30 USD/Mês
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="text-left">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">✅ O que está incluído:</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Acesso COMPLETO a todas as funcionalidades</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Suporte em Português via email</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Uso Ilimitado de clientes e funcionários</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Integração nativa com Google Calendar</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Backup automático e segurança total</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">❌ Sem taxas extras:</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-red-500 mr-2" />Sem Taxa de Setup</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-red-500 mr-2" />Sem Taxa de Cancelamento</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-red-500 mr-2" />Sem Limite de Usuários</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-red-500 mr-2" />Sem Custos Ocultos</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-red-500 mr-2" />Sem Fidelidade</li>
                </ul>
              </div>
            </div>

            <p className="text-slate-600 mt-6">
              <strong>Formas de Pagamento:</strong> Cartão de Crédito (Visa, Mastercard, Amex), PayPal
            </p>
          </div>

          <button 
            onClick={() => scrollToCTA('cta-meio')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl px-12 py-6 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
          >
            CLIQUE E COMECE A ECONOMIZAR TEMPO HOJE!
            <ArrowRight className="inline-block ml-2 h-6 w-6" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Tire suas Dúvidas e 
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Elimine Objeções</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3">P: Eu sou leigo em tecnologia. O CleanBiz360 é fácil de usar?</h3>
              <p className="text-slate-600">
                <strong>R:</strong> Sim! O sistema foi desenhado para ser totalmente intuitivo (Navegação Intuitiva). Além disso, ele é 100% em Português, eliminando a complicação de ter que se adaptar a um sistema em outra língua.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3">P: Meu negócio é pequeno, com apenas 2 funcionários. Este software é para mim?</h3>
              <p className="text-slate-600">
                <strong>R:</strong> Com certeza. O CleanBiz360 é focado em Micro e Pequenas Empresas (1 a 50 funcionários). Ele é a ferramenta ideal para você que está começando a profissionalizar e precisa de um sistema que cresça com você.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3">P: O suporte é realmente em Português? E o horário de atendimento?</h3>
              <p className="text-slate-600">
                <strong>R:</strong> Sim, o suporte é totalmente em Português, via e-mail. Atendemos em horário comercial brasileiro, garantindo que você seja assistido por alguém que entende sua cultura e seu desafio.
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3">P: Existe fidelidade ou taxa de cancelamento?</h3>
              <p className="text-slate-600">
                <strong>R:</strong> Não. Você não tem taxa de setup, nem taxa de cancelamento. Você paga mensalmente e pode cancelar a qualquer momento. Nossa meta é que você permaneça porque está tendo resultados.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3">P: Meus dados e os dados dos meus clientes estarão seguros?</h3>
              <p className="text-slate-600">
                <strong>R:</strong> Sim. Utilizamos tecnologia moderna Cloud-based com Backup Automático de todos os seus dados. Sua informação está totalmente segura e acessível apenas por você, de qualquer lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Marca */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Somos Brasileiros, 
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Entendemos Sua Luta</span>
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-slate-600 mb-6">
              O CleanBiz360 não foi criado por uma corporação americana. Ele nasceu da necessidade da comunidade brasileira de House Cleaning nos EUA.
            </p>
            
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Nossa Missão:</h3>
              <p className="text-slate-600 italic">
                "Democratizar o acesso a ferramentas profissionais de gestão empresarial para brasileiros empreendedores nos EUA, oferecendo soluções em português que realmente funcionam."
              </p>
            </div>

            <p className="text-lg text-slate-600">
              Somos o <strong>primeiro e único</strong> software de gestão especializado em limpeza residencial com interface e suporte totalmente em português nos EUA. Escolher o CleanBiz360 é escolher um parceiro que está 100% comprometido com o seu sucesso neste país.
            </p>
          </div>
        </div>
      </section>

      {/* Contador Regressivo */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ⚠️ ATENÇÃO: Oferta Exclusiva de Lançamento!
          </h2>
          <p className="text-xl mb-8">
            Esta condição especial de $30/mês é válida por tempo limitado.
          </p>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">O Preço de $30/Mês Termina Em:</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-sm">Dias</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm">Horas</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm">Minutos</div>
              </div>
              <div className="bg-white/30 rounded-xl p-4">
                <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm">Segundos</div>
              </div>
            </div>
          </div>

          <p className="text-xl font-bold mb-8">Não perca a chance de travar este preço!</p>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Sua Decisão com 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Risco Zero</span>
          </h2>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Garantia Incondicional de 7 Dias</h3>
            <p className="text-lg text-slate-600 mb-6">
              Temos tanta confiança no poder do CleanBiz360 que oferecemos uma garantia de satisfação total.
            </p>
            <p className="text-slate-600 mb-6">
              Teste o CleanBiz360 por 7 dias. Se por qualquer motivo você não se adaptar, ou se achar que ele não é a ferramenta que vai transformar seu negócio, basta nos enviar um e-mail dentro do prazo de 7 dias e faremos o reembolso de 100% do valor pago. <strong>Sem letras miúdas, sem perguntas.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="cta-meio" className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Não Espere Mais para Transformar seu Negócio!
          </h2>
          <p className="text-xl mb-8">
            Junte-se a centenas de empresários brasileiros que já descobriram o poder do CleanBiz360
          </p>
          
          <button className="bg-white text-cyan-600 text-2xl px-16 py-8 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
            EXPERIMENTE O CLEANBIZ360 SEM RISCO!
            <ArrowRight className="inline-block ml-3 h-8 w-8" />
          </button>
          
          <p className="text-cyan-100 text-sm mt-4">
            ✨ Garantia de 7 dias • Sem taxa de setup • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">CleanBiz360</h3>
                  <p className="text-slate-400 text-sm">Sistema Premium</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                Transformando Limpeza em Lucro - O software de gestão criado especialmente para brasileiros nos EUA.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Links Legais</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Reembolso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>suporte@cleanbiz360.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Suporte em Português</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Serviços nos EUA</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CleanBiz360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}