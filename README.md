![Neuros - AI-Powered Learning Platform](https://raw.githubusercontent.com/n3wth/neuros/main/public/cover.jpg)

# Neuros - Enterprise Learning Intelligence Platform

**An AI-powered learning platform that uses spaced repetition to help you remember information better**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Run Development Server](#run-development-server)
- [Project Structure](#project-structure)
- [Available Commands](#available-commands)
  - [Development](#development)
  - [Database](#database)
  - [Testing](#testing)
- [Features](#features)
  - [Implemented](#implemented)
  - [In Development](#in-development)
- [Deployment](#deployment)
  - [Deploy to Vercel](#deploy-to-vercel)
  - [Manual Deployment](#manual-deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About

Neuros is a learning platform that uses AI to help you remember information better through spaced repetition and active recall techniques.

**Live Demo**: [https://neuros.newth.ai](https://neuros.newth.ai)

### What It Does

- **AI-Powered Card Generation**: Transform any text into structured learning cards using OpenAI GPT-4
- **Spaced Repetition**: Evidence-based learning algorithm for optimal retention
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Progress Tracking**: Monitor your learning progress with a clean dashboard
- **Modern UI**: Clean, responsive interface built with Tailwind CSS v4

### Enterprise-Grade Integrations
 origin/main
Seamlessly integrate with your existing tech stack:
- Sequential Thinking - Complex problem-solving workflows
- Playwright - Browser automation and testing
- Context7 - Technical documentation retrieval
- Exa - Web search and research
- Qdrant - Personal knowledge graph
- GitHub - Repository management
- 21st.dev - UI component generation

---

## Tech Stack

- **Framework**: [Next.js 15.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI**: [OpenAI GPT-4](https://openai.com/) for content generation
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase CLI (`npm i -g supabase`)

### Installation

```bash
# Clone the repository
git clone https://github.com/n3wth/neuros.git
cd neuros

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

```bash
# Start local Supabase
npm run db:start

# Apply migrations
npm run db:reset

# Generate TypeScript types
npm run db:types
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
neuros/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard
│   └── (public)/          # Public pages
├── components/            
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── learning/          # Learning functionality
│   └── landing/           # Landing page components
├── server/
│   ├── actions/           # Server Actions
│   └── queries/           # Database queries
├── supabase/
│   └── migrations/        # Database schema
└── types/                 # TypeScript definitions
```

---

## Available Commands

### Development
```bash
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript checking
```

### Database
```bash
npm run db:start        # Start local Supabase
npm run db:stop         # Stop local Supabase
npm run db:reset        # Reset & apply migrations
npm run db:types        # Generate TypeScript types
```

### Testing
```bash
npm run test            # Run unit tests once
npm run test:watch      # Run unit tests in watch mode
npm run test:ui         # Interactive test UI
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

---

## Features

### Implemented
- ✅ User authentication (sign up, sign in, password reset)
- ✅ AI-powered flashcard generation from any text
- ✅ Spaced repetition algorithm
- ✅ Learning dashboard with progress tracking
- ✅ Card review interface
- ✅ Responsive design
- ✅ Dark/light theme support

### In Development
- 🚧 Advanced analytics
- 🚧 Collaborative learning features
- 🚧 Enhanced AI capabilities

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/n3wth/neuros)

1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## Additional Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Playwright Setup](PLAYWRIGHT_SETUP.md)
- [Testing Coverage](TEST_COVERAGE.md)
- [Rate Limiting Summary](RATE_LIMITING_SUMMARY.md)

---

## Contributing

We welcome contributions from our developer community:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

<div align="center">

**Built by [Oliver Newth](https://github.com/n3wth)**

Accelerating human learning through artificial intelligence

</div>
