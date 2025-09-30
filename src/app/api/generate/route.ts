import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { openRouterService } from '@/lib/services/openrouter.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysisId, format, style, includeHashtags, includeEmoji, language } = body

    if (!analysisId || !format || !style) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get analysis from database
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
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
    }

    // Generate post with AI
    const content = await openRouterService.generatePost(
      parsedAnalysis,
      format,
      style,
      language || 'en',
      includeHashtags !== false,
      includeEmoji !== false
    )

    // Extract hashtags from content
    const hashtagMatches = content.match(/#\w+/g) || []
    const hashtags = hashtagMatches.map((tag) => tag.substring(1))

    // Save post to database
    const post = await prisma.post.create({
      data: {
        analysisId,
        content,
        format,
        style,
        hashtags: JSON.stringify(hashtags),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        hashtags: JSON.parse(post.hashtags),
      },
    })
  } catch (error) {
    console.error('Post generation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Post generation failed' },
      { status: 500 }
    )
  }
}
