import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedAnalysis = {
      ...analysis,
      metadata: analysis.metadata ? JSON.parse(analysis.metadata) : {},
      insights: analysis.insights ? JSON.parse(analysis.insights) : {},
      posts: analysis.posts.map((post) => ({
        ...post,
        hashtags: JSON.parse(post.hashtags),
      })),
    }

    return NextResponse.json({
      success: true,
      data: parsedAnalysis,
    })
  } catch (error) {
    console.error('Analysis fetch error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}
