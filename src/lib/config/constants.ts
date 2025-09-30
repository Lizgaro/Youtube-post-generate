export const APP_CONFIG = {
  name: 'YouTube Post Generator',
  description: 'AI-powered content analysis and post generation',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const API_CONFIG = {
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
    maxTokens: 2000,
  },
  youtube: {
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  },
}

export const MOCK_MODE = {
  enabled: !process.env.OPENROUTER_API_KEY && !process.env.YOUTUBE_API_KEY,
  message: '🎭 Mock Mode: Using sample data. Add API keys in Settings to enable real analysis.',
}

export const POST_FORMATS = [
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'telegram', label: 'Telegram', icon: '✈️' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
] as const

export const POST_STYLES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
  { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and inspiring' },
] as const

export const SUPPORTED_LANGUAGES = [
  { value: 'ru', label: '🇷🇺 Русский' },
  { value: 'en', label: '🇬🇧 English' },
] as const
