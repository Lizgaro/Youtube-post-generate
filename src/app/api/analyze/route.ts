import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { youtubeService } from '@/lib/services/youtube.service'
import { openRouterService } from '@/lib/services/openrouter.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, type } = body

    if (!url || !type) {
      return NextResponse.json(
        { success: false, error: 'URL and type are required' },
        { status: 400 }
      )
    }

    if (type === 'youtube') {
      return await analyzeYouTube(url)
    } else if (type === 'telegram') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Telegram analysis coming soon! Currently supporting YouTube only.' 
        },
        { status: 501 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}

async function analyzeYouTube(url: string) {
  try {
    // Extract video ID
    const videoId = youtubeService.extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Get video details
    const videoDetails = await youtubeService.getVideoDetails(videoId)
    
    // Get transcript
    const transcript = await youtubeService.getVideoTranscript(videoId)

    // Analyze content with AI
    const insights = await openRouterService.analyzeContent(
      `${videoDetails.description}\n\n${transcript}`,
      videoDetails.title
    )

    // Save to database
    const analysis = await prisma.analysis.create({
      data: {
        type: 'youtube',
        sourceUrl: url,
        sourceId: videoId,
        title: videoDetails.title,
        description: videoDetails.description,
        transcript: transcript,
        metadata: JSON.stringify({
          views: videoDetails.viewCount,
          likes: videoDetails.likeCount,
          comments: videoDetails.commentCount,
          duration: youtubeService.formatDuration(videoDetails.duration),
          publishedAt: videoDetails.publishedAt,
          channelTitle: videoDetails.channelTitle,
          channelId: videoDetails.channelId,
          thumbnailUrl: videoDetails.thumbnailUrl,
          tags: videoDetails.tags,
        }),
        insights: JSON.stringify(insights),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        metadata: JSON.parse(analysis.metadata || '{}'),
        insights: JSON.parse(analysis.insights || '{}'),
      },
    })
  } catch (error) {
    console.error('YouTube analysis error:', error)
    throw error
  }
}
