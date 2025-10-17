import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simular dados dos domínios
    const domainsData = {
      domains: [
        {
          name: 'app.cleanbiz360.com',
          status: 'online',
          ssl: true,
          lastCheck: '1 min atrás',
          responseTime: '30ms'
        },
        {
          name: 'vendas.cleanbiz360.com',
          status: 'online',
          ssl: true,
          lastCheck: '1 min atrás',
          responseTime: '25ms'
        }
      ],
      dns: {
        status: 'healthy',
        propagation: '100%',
        lastUpdate: '2 horas atrás'
      },
      ssl: {
        status: 'valid',
        expiresIn: '89 dias',
        autoRenewal: true
      },
      uptime: '100%',
      status: 'online',
      lastCheck: new Date().toISOString()
    }

    return NextResponse.json(domainsData)
  } catch (error) {
    console.error('Erro ao buscar dados dos domínios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados dos domínios' },
      { status: 500 }
    )
  }
}
