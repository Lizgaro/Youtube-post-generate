import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') as 'youtube' | 'telegram' | null

    const where = type ? { type } : {}

    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    // Parse JSON fields
    const parsedAnalyses = analyses.map((analysis) => ({
      ...analysis,
      metadata: analysis.metadata ? JSON.parse(analysis.metadata) : {},
      insights: analysis.insights ? JSON.parse(analysis.insights) : {},
      posts: analysis.posts.map((post) => ({
        ...post,
        hashtags: JSON.parse(post.hashtags),
      })),
    }))

    return NextResponse.json({
      success: true,
      data: parsedAnalyses,
    })
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    await prisma.analysis.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete analysis' },
      { status: 500 }
    )
  }
}
