'use client'

import { useState } from 'react'
import { MOCK_MODE } from '@/lib/config/constants'
import type { Analysis } from '@/types'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [generatedPost, setGeneratedPost] = useState('')
  const [postFormat, setPostFormat] = useState('linkedin')
  const [postStyle, setPostStyle] = useState('professional')
  const [language, setLanguage] = useState('ru')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)
    setGeneratedPost('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'youtube' }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Analysis failed')
        return
      }

      setAnalysis(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content')
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePost = async () => {
    if (!analysis) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId: analysis.id,
          format: postFormat,
          style: postStyle,
          language,
          includeHashtags: true,
          includeEmoji: true,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Post generation failed')
        return
      }

      setGeneratedPost(data.data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate post')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
    alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎥 YouTube Post Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Analyze videos and generate engaging social media posts with AI
          </p>
          {MOCK_MODE.enabled && (
            <div className="mt-4 inline-block bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg">
              {MOCK_MODE.message}
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here... (e.g., https://youtube.com/watch?v=...)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading && !analysis ? '⏳ Analyzing...' : '🔍 Analyze'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Video Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                📊 Analysis Results
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">{analysis.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {analysis.description?.substring(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      👁️ <span className="font-semibold">{analysis.metadata?.views?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      👍 <span className="font-semibold">{analysis.metadata?.likes?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      💬 <span className="font-semibold">{analysis.metadata?.comments?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      ⏱️ <span className="font-semibold">{analysis.metadata?.duration}</span>
                    </div>
                  </div>
                </div>
                {analysis.metadata?.thumbnailUrl && (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={analysis.metadata.thumbnailUrl}
                      alt={analysis.title}
                      className="rounded-lg w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Insights */}
              {analysis.insights && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Key Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.insights.keyTopics?.map((topic: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">💡 Main Points:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {analysis.insights.mainPoints?.map((point: string, idx: number) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📝 Summary:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{analysis.insights.summary}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Post Generation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                ✍️ Generate Post
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Format:</label>
                  <select
                    value={postFormat}
                    onChange={(e) => setPostFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="twitter">🐦 Twitter/X</option>
                    <option value="telegram">✈️ Telegram</option>
                    <option value="instagram">📸 Instagram</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Style:</label>
                  <select
                    value={postStyle}
                    onChange={(e) => setPostStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="professional">👔 Professional</option>
                    <option value="casual">😊 Casual</option>
                    <option value="enthusiastic">🚀 Enthusiastic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGeneratePost}
                disabled={loading}
                className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6"
              >
                {loading ? '⏳ Generating...' : '✨ Generate Post'}
              </button>

              {generatedPost && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">
                      {generatedPost}
                    </pre>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>Made with ❤️ by Артём Лизгаро | Powered by OpenRouter & Next.js</p>
        </div>
      </div>
    </div>
  )
}
