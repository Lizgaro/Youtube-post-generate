import { API_CONFIG } from '@/lib/config/constants'

interface YouTubeVideoDetails {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  publishedAt: string
  thumbnailUrl: string
  duration: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
}

export class YouTubeService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || ''
    this.baseUrl = API_CONFIG.youtube.baseUrl
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideoDetails> {
    if (!this.apiKey) {
      return this.getMockVideoDetails(videoId)
    }

    try {
      const url = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found')
      }

      const video = data.items[0]
      const snippet = video.snippet
      const statistics = video.statistics
      const contentDetails = video.contentDetails

      return {
        id: videoId,
        title: snippet.title,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        channelId: snippet.channelId,
        publishedAt: snippet.publishedAt,
        thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        duration: contentDetails.duration,
        viewCount: parseInt(statistics.viewCount || '0'),
        likeCount: parseInt(statistics.likeCount || '0'),
        commentCount: parseInt(statistics.commentCount || '0'),
        tags: snippet.tags || [],
      }
    } catch (error) {
      console.error('YouTube API error:', error)
      return this.getMockVideoDetails(videoId)
    }
  }

  async getVideoTranscript(videoId: string): Promise<string> {
    // Note: YouTube API v3 doesn't provide transcripts directly
    // For production, you would need to use youtube-transcript or similar library
    // For now, returning mock data
    if (!this.apiKey) {
      return this.getMockTranscript()
    }

    // In production, implement actual transcript fetching
    // For now, using video description as fallback
    try {
      const details = await this.getVideoDetails(videoId)
      return details.description || this.getMockTranscript()
    } catch {
      return this.getMockTranscript()
    }
  }

  private getMockVideoDetails(videoId: string): YouTubeVideoDetails {
    return {
      id: videoId,
      title: 'The Future of Artificial Intelligence and Technology',
      description: `This video explores the cutting-edge developments in artificial intelligence and their impact on various industries. 

Key topics covered:
- Machine Learning advancements
- AI in everyday applications
- Ethical considerations in AI development
- Future predictions and trends

Join us as we dive deep into how AI is reshaping our world and what it means for the future of technology.`,
      channelTitle: 'Tech Insights Channel',
      channelId: 'UCmockchannelid',
      publishedAt: new Date().toISOString(),
      thumbnailUrl: 'https://picsum.photos/1280/720',
      duration: 'PT15M30S',
      viewCount: 125000,
      likeCount: 8500,
      commentCount: 432,
      tags: ['AI', 'Technology', 'Machine Learning', 'Innovation', 'Future Tech'],
    }
  }

  private getMockTranscript(): string {
    return `Welcome to today's discussion about artificial intelligence and its transformative impact on our world. 

In recent years, we've seen incredible advancements in machine learning and AI technologies. These developments are not just theoretical - they're changing how we work, communicate, and solve complex problems.

Let's start with the basics. Artificial intelligence refers to computer systems that can perform tasks that typically require human intelligence. This includes things like visual perception, speech recognition, decision-making, and language translation.

One of the most exciting areas is natural language processing. AI can now understand and generate human-like text with remarkable accuracy. This technology powers chatbots, virtual assistants, and content generation tools that millions of people use every day.

Machine learning, a subset of AI, enables systems to learn from data without being explicitly programmed. This has led to breakthroughs in areas like healthcare diagnostics, financial fraud detection, and autonomous vehicles.

However, with great power comes great responsibility. As AI becomes more prevalent, we need to address important ethical questions. How do we ensure AI systems are fair and unbiased? How do we protect privacy while leveraging the power of data? These are challenges that researchers, policymakers, and tech companies are actively working to address.

Looking ahead, the potential applications of AI seem limitless. From personalized education to climate change solutions, AI could help us tackle some of humanity's biggest challenges. The key is to develop and deploy these technologies thoughtfully, with consideration for their broader impact on society.

Thank you for watching. Don't forget to subscribe for more insights on technology and innovation.`
  }

  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return duration

    const hours = parseInt(match[1]?.replace('H', '') || '0')
    const minutes = parseInt(match[2]?.replace('M', '') || '0')
    const seconds = parseInt(match[3]?.replace('S', '') || '0')

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

export const youtubeService = new YouTubeService()
