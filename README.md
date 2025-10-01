# 🎥 YouTube Post Generator

AI-powered content analysis and social media post generation for YouTube videos and Telegram channels.

## ✨ Features

- 🎯 **YouTube Video Analysis** - Extract key insights, topics, and summaries from any YouTube video
- 🤖 **AI-Powered Post Generation** - Generate engaging social media posts optimized for different platforms
- 📊 **Smart Content Insights** - Automatic extraction of key topics, main points, sentiment, and target audience
- 🌐 **Multi-Platform Support** - LinkedIn, Twitter/X, Telegram, Instagram post formats
- 🎨 **Multiple Styles** - Professional, Casual, and Enthusiastic tones
- 🌍 **Multilingual** - Russian and English content generation
- 💾 **History Tracking** - Save and review all your analyses
- 🎭 **Mock Mode** - Works without API keys for testing (uses sample data)
- 🌙 **Dark Mode Support** - Beautiful UI with light/dark themes

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lizgaro/Youtube-post-generate.git
   cd Youtube-post-generate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your API keys (optional for testing):
   ```env
   # OpenRouter API (Free models available!)
   OPENROUTER_API_KEY=sk-or-v1-...
   
   # YouTube Data API v3
   YOUTUBE_API_KEY=AIzaSy...
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup Guide

### 1. OpenRouter API (FREE!) 🆓

OpenRouter provides free access to AI models like `llama-3.2-3b-instruct:free`.

**Steps:**
1. Visit [https://openrouter.ai/](https://openrouter.ai/)
2. Sign in with Google/GitHub
3. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
4. Click "Create Key"
5. Copy your generated API key
6. Add to `.env` as OPENROUTER_API_KEY

**Free Models:**
- `meta-llama/llama-3.2-3b-instruct:free` ⭐ (Recommended)
- `mistralai/mistral-7b-instruct:free`
- `google/gemini-flash-1.5-8b` (often free)

### 2. YouTube Data API v3 (FREE with limits) 🎥

Get 10,000 units/day quota - enough for 100-300 video analyses!

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "YouTube Post Generator"
3. Enable "YouTube Data API v3":
   - Navigate to "APIs & Services" → "Library"
   - Search "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "API Key"
   - Copy your key (starts with `AIza`)
5. Add to `.env`: `YOUTUBE_API_KEY=your_key_here`

**Optional:** Restrict API key to YouTube Data API v3 for security.

### 3. Telegram API (Optional, FREE) 💬

For Telegram channel analysis (coming soon).

**Steps:**
1. Visit [https://my.telegram.org/](https://my.telegram.org/)
2. Login with your phone number
3. Click "API development tools"
4. Create application:
   - App title: "YouTube Post Generator"
   - Short name: "ytpostgen"
   - Platform: "Web"
5. Copy api_id and api_hash values
6. Add both values to your `.env` file as TELEGRAM_API_ID and TELEGRAM_API_HASH

## 📖 Usage

### Analyze YouTube Video

1. Copy any YouTube video URL
2. Paste it into the input field
3. Click "🔍 Analyze"
4. View insights: topics, main points, summary, statistics

### Generate Social Media Post

1. After analysis, choose:
   - **Format**: LinkedIn, Twitter, Telegram, or Instagram
   - **Style**: Professional, Casual, or Enthusiastic
   - **Language**: Russian or English
2. Click "✨ Generate Post"
3. Copy and use your generated post!

### Example URLs to Try

- `https://youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- Or just the video ID: `dQw4w9WgXcQ`

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **AI**: OpenRouter API (Free Llama models)
- **APIs**: YouTube Data API v3, Telegram API
- **Deployment**: Vercel-ready

## 📂 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── analyze/      # Video analysis endpoint
│   │   ├── generate/     # Post generation endpoint
│   │   ├── history/      # History management
│   │   └── analysis/     # Single analysis retrieval
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   ├── services/         # External API services
│   │   ├── openrouter.service.ts
│   │   ├── youtube.service.ts
│   │   └── telegram.service.ts (coming soon)
│   ├── db/               # Database connection
│   ├── config/           # Configuration constants
│   └── utils/            # Utility functions
├── types/                # TypeScript type definitions
└── prisma/
    └── schema.prisma     # Database schema
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🗄️ Database

The app uses SQLite by default (no setup required). To migrate to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Supabase PostgreSQL Setup (Recommended for Production) 🚀

**Free Tier Benefits:**
- 500MB database storage
- 2GB bandwidth per month
- 50,000 monthly active users  
- Automatic backups

**Quick Setup:**

1. **Create Supabase Account**
   - Visit https://supabase.com
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Name: `youtube-post-generator`
   - Database Password: **Create and save a strong password!**
   - Region: Choose closest to your users
   - Plan: Free Tier ✅

3. **Wait 2-3 Minutes** ☕ (for database provisioning)

4. **Get Connection String**
   - Go to Project Settings ⚙️ → Database
   - Find "Connection String" section
   - Select "URI" mode
   - Copy the complete connection string

5. **Configure on Vercel**
   - Vercel Dashboard → Your Project → Settings
   - Navigate to "Environment Variables"
   - Add new variable:
     - **Name:** `DATABASE_URL`
     - **Value:** Your Supabase connection string
     - **Environments:** ✅ Production ✅ Preview ✅ Development
   - Click "Save"

6. **Redeploy Application**
   - Go to Deployments tab
   - Select latest deployment
   - Click "Redeploy"
   - Vercel will automatically set up database schema
   - Done! Your app now uses PostgreSQL 🎉

**Local Development with Supabase:**

```bash
# Add to your .env file
DATABASE_URL="your-supabase-connection-string"

# Push schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

**Note:** The app is now configured for PostgreSQL by default. For local SQLite development, update `prisma/schema.prisma` provider to `"sqlite"` and use `DATABASE_URL="file:./dev.db"`

## 🎨 Customization

### Change AI Model

Edit `OPENROUTER_MODEL` in `.env`:

```env
# Free options:
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

# Paid options (better quality):
OPENROUTER_MODEL=anthropic/claude-3-opus
OPENROUTER_MODEL=openai/gpt-4-turbo
```

### Add New Post Format

1. Update `POST_FORMATS` in `src/lib/config/constants.ts`
2. Add format logic in `openRouterService.generatePost()`

## 🐛 Troubleshooting

### "Mock Mode" Warning

**Issue**: Yellow banner showing "Mock Mode: Using sample data"

**Solution**: Add API keys to `.env` file. The app works with mock data for testing, but real API keys enable actual analysis.

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues

```bash
# Reset database
npx prisma db push --force-reset
npx prisma generate
```

## 📄 License

MIT License - feel free to use this project however you want!

## 👨‍💻 Author

**Артём Лизгаро**

Made with ❤️ using Next.js, OpenRouter, and passion for great developer tools.

---

## 🎯 Roadmap

- [x] YouTube video analysis
- [x] AI-powered post generation
- [x] Multi-platform support
- [x] Mock mode for testing
- [ ] Telegram channel analysis
- [ ] Batch processing (multiple URLs)
- [ ] Post templates and presets
- [ ] Chrome extension
- [ ] Analytics dashboard
- [ ] Export to PDF/DOCX

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Star ⭐ this repo if you find it useful!**                                        