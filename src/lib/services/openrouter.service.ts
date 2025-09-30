import { API_CONFIG } from '@/lib/config/constants'

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  max_tokens?: number
  temperature?: number
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenRouterService {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || ''
    this.baseUrl = API_CONFIG.openrouter.baseUrl
    this.model = API_CONFIG.openrouter.model
  }

  async chat(messages: OpenRouterMessage[], options?: { maxTokens?: number; temperature?: number }): Promise<string> {
    if (!this.apiKey) {
      return this.getMockResponse(messages)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'YouTube Post Generator',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: options?.maxTokens || API_CONFIG.openrouter.maxTokens,
          temperature: options?.temperature || 0.7,
        } as OpenRouterRequest),
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`)
      }

      const data: OpenRouterResponse = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenRouter API error:', error)
      return this.getMockResponse(messages)
    }
  }

  private getMockResponse(messages: OpenRouterMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content || ''
    
    if (lastMessage.includes('analyze') || lastMessage.includes('insights')) {
      return JSON.stringify({
        keyTopics: ['Artificial Intelligence', 'Technology', 'Innovation', 'Future'],
        sentiment: 'positive',
        mainPoints: [
          'Discussion about the impact of AI on modern society',
          'Exploration of emerging technologies and their potential',
          'Analysis of current trends in the tech industry',
          'Future predictions and expert insights'
        ],
        targetAudience: 'Tech enthusiasts, professionals, and students interested in AI and technology',
        keywords: ['AI', 'technology', 'innovation', 'future', 'machine learning', 'digital transformation'],
        summary: 'A comprehensive discussion about artificial intelligence and its transformative impact on various industries, exploring both opportunities and challenges in the evolving technological landscape.'
      })
    }

    if (lastMessage.includes('generate') || lastMessage.includes('post')) {
      return `🚀 Интересное видео о технологиях будущего!

В этом материале рассматриваются ключевые тренды в области искусственного интеллекта и их влияние на нашу жизнь. Особенно впечатлили практические примеры применения AI в различных индустриях.

Главные инсайты:
✨ AI меняет способы работы и коммуникации
💡 Новые возможности для бизнеса и творчества
🎯 Важность этичного подхода к развитию технологий

Рекомендую к просмотру всем, кто интересуется инновациями!

#AI #Technology #Innovation #FutureTech #DigitalTransformation`
    }

    return 'Mock response: API key not configured. Please add your OpenRouter API key in Settings.'
  }

  async analyzeContent(content: string, title: string): Promise<{
    keyTopics: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    mainPoints: string[]
    targetAudience: string
    keywords: string[]
    summary: string
  }> {
    const prompt = `Analyze the following content and extract key insights. Return a JSON object with:
- keyTopics: array of main topics (3-5 items)
- sentiment: 'positive', 'neutral', or 'negative'
- mainPoints: array of key points (3-5 items)
- targetAudience: description of the target audience
- keywords: array of relevant keywords (5-10 items)
- summary: brief summary (2-3 sentences)

Title: ${title}

Content: ${content.substring(0, 3000)}...

Return only valid JSON, no additional text.`

    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'You are an expert content analyst. Return only valid JSON responses.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages)
    
    try {
      return JSON.parse(response)
    } catch {
      // Fallback mock data if parsing fails
      return {
        keyTopics: ['Content Analysis', 'Key Topics', 'Insights'],
        sentiment: 'neutral',
        mainPoints: ['Point 1', 'Point 2', 'Point 3'],
        targetAudience: 'General audience',
        keywords: ['content', 'analysis', 'insights'],
        summary: 'Content summary generated.',
      }
    }
  }

  async generatePost(
    analysis: { title: string; insights?: { keyTopics?: string[]; mainPoints?: string[]; summary?: string } },
    format: string,
    style: string,
    language: string,
    includeHashtags: boolean,
    includeEmoji: boolean
  ): Promise<string> {
    const langInstruction = language === 'ru' ? 'Пиши на русском языке.' : 'Write in English.'
    const emojiInstruction = includeEmoji ? 'Use relevant emojis.' : 'Do not use emojis.'
    const hashtagInstruction = includeHashtags ? 'Include relevant hashtags at the end.' : 'Do not include hashtags.'

    let formatInstruction = ''
    switch (format) {
      case 'linkedin':
        formatInstruction = 'Professional LinkedIn post format. Focus on insights and value.'
        break
      case 'twitter':
        formatInstruction = 'Twitter/X thread format. Keep it concise and engaging. Use thread format if needed (1/n).'
        break
      case 'telegram':
        formatInstruction = 'Telegram post format. Conversational and informative.'
        break
      case 'instagram':
        formatInstruction = 'Instagram caption format. Visual and engaging, hook in first line.'
        break
    }

    let styleInstruction = ''
    switch (style) {
      case 'professional':
        styleInstruction = 'Professional, formal tone. Business-oriented language.'
        break
      case 'casual':
        styleInstruction = 'Casual, friendly tone. Conversational and approachable.'
        break
      case 'enthusiastic':
        styleInstruction = 'Enthusiastic, energetic tone. Inspiring and motivational.'
        break
    }

    const prompt = `Generate a social media post based on the following content analysis.

Format: ${formatInstruction}
Style: ${styleInstruction}
Language: ${langInstruction}
${emojiInstruction}
${hashtagInstruction}

Content Title: ${analysis.title}
Key Topics: ${analysis.insights?.keyTopics?.join(', ') || 'N/A'}
Main Points: ${analysis.insights?.mainPoints?.join('; ') || 'N/A'}
Summary: ${analysis.insights?.summary || 'N/A'}

Generate an engaging post that captures the essence of this content.`

    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'You are an expert social media content creator. Generate engaging posts optimized for each platform.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    return await this.chat(messages)
  }
}

export const openRouterService = new OpenRouterService()
