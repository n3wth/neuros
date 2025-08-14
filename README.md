![Neuros - AI-Powered Learning Platform](https://raw.githubusercontent.com/n3wth/neuros/main/public/cover.jpg)

# Neuros - Enterprise Learning Intelligence Platform

> **An AI-powered learning platform that uses spaced repetition to help you remember information better**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/n3wth/neuros)

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Available Commands](#available-commands)
- [Features](#features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## About

Neuros is a cutting-edge learning platform that leverages AI to transform how you retain and recall information through scientifically-proven spaced repetition and active recall techniques.

**Live Demo**: [https://neuros.newth.ai](https://neuros.newth.ai)

### What It Does

- **AI-Powered Card Generation**: Transform any text into structured learning cards using OpenAI GPT-4
- **Spaced Repetition**: Evidence-based learning algorithm for optimal retention
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Progress Tracking**: Monitor your learning progress with an intuitive dashboard
- **Modern UI**: Clean, responsive interface built with Tailwind CSS v4
- **Mobile-First**: Optimized for all devices and screen sizes

### Enterprise-Grade Integrations

Seamlessly integrate with your existing tech stack:

| Category        | Tools                             | Purpose                                    |
| --------------- | --------------------------------- | ------------------------------------------ |
| **AI & ML**     | OpenAI GPT-4, Sequential Thinking | Content generation & problem-solving       |
| **Testing**     | Playwright                        | Browser automation & E2E testing           |
| **Knowledge**   | Context7, Exa, Qdrant             | Documentation retrieval & knowledge graphs |
| **Development** | GitHub, 21st.dev                  | Repository management & UI generation      |

## Tech Stack

| Layer             | Technology                                                            | Version            |
| ----------------- | --------------------------------------------------------------------- | ------------------ |
| **Framework**     | [Next.js](https://nextjs.org/)                                        | 15.4 (App Router)  |
| **Language**      | [TypeScript](https://www.typescriptlang.org/)                         | 5.x                |
| **Database**      | [Supabase](https://supabase.com/)                                     | PostgreSQL + Auth  |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/)                              | 4.0                |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/)                                   | Latest             |
| **AI Services**   | [OpenAI GPT-4](https://openai.com/)                                   | Content generation |
| **Testing**       | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit + E2E         |
| **Deployment**    | [Vercel](https://vercel.com/)                                         | Hosting platform   |

## Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm/yarn/pnpm** package manager
- **Supabase CLI** (`npm i -g supabase`)

### Installation

```bash
# Clone the repository
git clone https://github.com/n3wth/neuros.git
cd neuros

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

```bash
# Start local Supabase instance
npm run db:start

# Reset database and apply migrations
npm run db:reset

# Generate TypeScript types from schema
npm run db:types
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Documentation

All project documentation is organized in the `docs/` folder:

| Category           | Description                           | Key Files           |
| ------------------ | ------------------------------------- | ------------------- |
| **📖 Setup Guides** | Local development, OAuth, testing     | `docs/setup/`       |
| **🚀 Deployment**   | Production deployment guides          | `docs/deployment/`  |
| **⚙️ Development**  | Architecture, AI systems, testing     | `docs/development/` |
| **📊 Analysis**     | UX audits and improvement proposals   | `docs/analysis/`    |
| **🔧 Refactoring**  | Code refactoring and migration guides | `docs/refactoring/` |

**Complete Documentation**: See [`docs/README.md`](docs/README.md) for the full index.

## Project Structure

```
neuros/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard
│   └── (public)/           # Public pages
├── components/            
│   ├── ui/                 # Reusable UI components
│   ├── features/           # Feature-specific components
│   ├── learning/           # Learning functionality
│   └── landing/            # Landing page components
├── docs/                   # Project documentation
├── scripts/                # Automation & utilities
├── server/
│   ├── actions/            # Server Actions
│   └── queries/            # Database queries
├── supabase/
│   └── migrations/         # Database schema
└── types/                  # TypeScript definitions
```

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

## Features

### ✅ Implemented
- **Authentication**: Complete user management (sign up, sign in, password reset)
- **AI Card Generation**: Transform any text into structured learning cards
- **Spaced Repetition**: Evidence-based algorithm for optimal retention
- **Dashboard**: Comprehensive learning progress tracking
- **Review Interface**: Intuitive card review system
- **Responsive Design**: Mobile-first, cross-device compatibility
- **Theme Support**: Dark/light mode with smooth transitions
- **Security**: Rate limiting, input validation, secure authentication

### In Development
- **Advanced Analytics**: Detailed learning insights and metrics
- **Collaborative Learning**: Team-based learning features
- **Enhanced AI**: More sophisticated content generation and personalization
- **Mobile App**: Native mobile application
- **API Integration**: Third-party learning platform connections

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/n3wth/neuros)

**One-click deployment:**
1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Additional Deployment Resources

- [📖 Deployment Guide](docs/deployment/DEPLOYMENT.md)
- [🎭 Playwright Setup](docs/setup/PLAYWRIGHT_SETUP.md)
- [🧪 Testing Coverage](docs/development/TEST_COVERAGE.md)
- [⚡ Rate Limiting](docs/development/RATE_LIMITING_SUMMARY.md)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 🎯 Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🧠 Built with ❤️ by [Oliver Newth](https://github.com/n3wth)**

*Empowering learners worldwide with AI-driven education technology* 🚀
