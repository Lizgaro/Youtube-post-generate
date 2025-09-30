// Analysis Types
export type AnalysisType = 'youtube' | 'telegram'

export interface AnalysisMetadata {
  views?: number
  likes?: number
  comments?: number
  duration?: string
  publishedAt?: string
  channelTitle?: string
  channelId?: string
  thumbnailUrl?: string
}

export interface AnalysisInsights {
  keyTopics: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  mainPoints: string[]
  targetAudience?: string
  keywords: string[]
  summary: string
}

export interface Analysis {
  id: string
  type: AnalysisType
  sourceUrl: string
  sourceId: string
  title: string
  description?: string
  transcript?: string
  metadata?: AnalysisMetadata
  insights?: AnalysisInsights
  createdAt: Date
}

// Post Types
export type PostFormat = 'linkedin' | 'twitter' | 'telegram' | 'instagram'
export type PostStyle = 'professional' | 'casual' | 'enthusiastic'

export interface Post {
  id: string
  analysisId: string
  content: string
  format: PostFormat
  style: PostStyle
  hashtags: string[]
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Settings Types
export interface Settings {
  id: string
  openrouterApiKey?: string
  youtubeApiKey?: string
  telegramApiId?: string
  telegramApiHash?: string
  updatedAt: Date
}

// Form Types
export interface AnalyzeFormData {
  url: string
  type: AnalysisType
}

export interface GeneratePostFormData {
  analysisId: string
  format: PostFormat
  style: PostStyle
  includeHashtags: boolean
  includeEmoji: boolean
  language: 'ru' | 'en'
}
