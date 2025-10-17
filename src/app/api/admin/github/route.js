import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simular dados do GitHub (em produção, você usaria a API real do GitHub)
    const githubData = {
      repository: {
        name: 'cleanbiz',
        stars: 12,
        forks: 3,
        watchers: 8,
        lastCommit: '1 hora atrás'
      },
      api: {
        calls: '1.2K',
        limit: '5K',
        percentage: 24,
        remaining: '3.8K'
      },
      activity: {
        commits: 45,
        pullRequests: 3,
        issues: 2,
        contributors: 1
      },
      uptime: '99.5%',
      status: 'warning', // Simulando um aviso
      lastCheck: new Date().toISOString()
    }

    return NextResponse.json(githubData)
  } catch (error) {
    console.error('Erro ao buscar dados do GitHub:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do GitHub' },
      { status: 500 }
    )
  }
}
