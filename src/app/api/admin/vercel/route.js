import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simular dados do Vercel (em produção, você usaria a API real do Vercel)
    const vercelData = {
      deployments: {
        total: 12,
        thisMonth: 8,
        lastDeployment: '2 horas atrás'
      },
      bandwidth: {
        used: '2.3GB',
        limit: '100GB',
        percentage: 2.3
      },
      functions: {
        invocations: '1.2K',
        errors: 0,
        avgDuration: '45ms'
      },
      uptime: '99.9%',
      status: 'online',
      lastCheck: new Date().toISOString()
    }

    return NextResponse.json(vercelData)
  } catch (error) {
    console.error('Erro ao buscar dados do Vercel:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do Vercel' },
      { status: 500 }
    )
  }
}
