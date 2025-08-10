# AI Coding & MCP Experimentation Project

<div align="center">

**A playground for testing AI-powered development tools and MCP integrations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## About This Project

This is Oliver Newth's experimental playground for testing and evaluating AI-powered coding tools and newer Model Context Protocol (MCP) integrations. The project serves as a testbed for exploring how various AI assistants and MCP servers can accelerate development workflows.

**Author**: [Oliver Newth](https://newth.ai) • [GitHub: @n3wth](https://github.com/n3wth)

### MCP Servers Being Tested

- **Sequential Thinking** - Complex problem-solving workflows with iterative reasoning
- **Playwright** - Browser automation and E2E testing capabilities  
- **Context7** - Technical documentation retrieval with up-to-date library references
- **Exa** - Advanced web search and research capabilities
- **Qdrant** - Personal knowledge graph for storing and retrieving contextual information
- **GitHub** - Repository management and code operations
- **21st.dev** - UI component generation and refinement

### Key Highlights

- **AI-Powered Content Generation** - Turn any text into structured learning cards
- **Adaptive Learning Paths** - Personalized progression based on your performance
- **Advanced Analytics** - Deep insights into your learning patterns
- **Beautiful Modern Interface** - Carefully crafted with attention to detail
- **Secure & Private** - Your data is protected with enterprise-grade security

---

## Features

### Intelligent Learning Engine

- **Smart Card Generation**: Transform any content into optimized learning cards with AI
- **Adaptive Difficulty**: Content automatically adjusts to your skill level
- **Spaced Repetition**: Research-backed algorithms optimize retention
- **Multi-Modal Learning**: Text images and interactive elements

### Analytics & Insights

- **Learning Analytics**: Detailed progress tracking and performance metrics
- **Knowledge Mapping**: Visualize connections between concepts
- **Streak Tracking**: Maintain learning momentum with gamification
- **Performance Predictions**: AI insights into your learning trajectory

### Premium Experience

- **Apple-Inspired Design**: Polished intuitive interface
- **Dark/Light Themes**: Seamless theme switching
- **Responsive Design**: Perfect experience across all devices
- **Accessibility First**: WCAG compliant for inclusive learning

### Developer Features

- **Modern Tech Stack**: Next.js 15 TypeScript Supabase Tailwind CSS v4
- **Real-time Sync**: Instant updates across all your devices
- **Offline Support**: Learn anywhere sync when connected
- **API Integration**: OpenAI GPT-4 for intelligent content processing

---

## Perfect For

| **Students** | **Professionals** | **Educators** | **Teams** |
|--------------|-------------------|---------------|-----------|
| Study efficiently with AI-generated flashcards | Upskill with personalized learning paths | Create engaging course content | Onboard new team members |
| Track progress across subjects | Stay current with industry trends | Analyze student performance | Share knowledge effectively |
| Prepare for exams with spaced repetition | Build expertise systematically | Generate assessments automatically | Measure learning outcomes |

---

## 🛠️ Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm/yarn/pnpm**
- **Supabase CLI** (`npm i -g supabase`)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/n3wth/neuros.git
cd neuros
npm install
```

### 2️⃣ Environment Setup

Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key
```

### 3️⃣ Database Setup

```bash
# Start local Supabase
npm run db:start

# Apply migrations
npm run db:reset

# Generate types
npm run db:types
```

### 4️⃣ Launch Development Server

```bash
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** - Your learning journey begins!

---

## 📂 Project Architecture

```
neuros/
├── 🎨 app/                    # Next.js App Router
│   ├── (auth)/               # Authentication routes
│   ├── (dashboard)/          # Protected learning dashboard  
│   └── (public)/             # Marketing & landing pages
├── 🧩 components/            
│   ├── ui/                   # Reusable UI components
│   ├── features/             # Feature-specific components
│   ├── learning/             # Core learning functionality
│   └── landing/              # Marketing components
├── 🔧 server/
│   ├── actions/              # Server Actions (AI, Auth, CRUD)
│   └── queries/              # Database queries
├── 🗄️ supabase/
│   ├── migrations/           # Database schema
│   └── config.toml           # Supabase configuration
├── 📝 types/                 # TypeScript definitions
└── 🎭 styles/                # Global styles & themes
```

---

## 🎛️ Available Commands

### Development
```bash
npm run dev              # Start development server (Turbopack)
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Code linting
npm run typecheck       # TypeScript checking
```

### Database Management
```bash
npm run db:start        # Start local Supabase stack
npm run db:stop         # Stop local Supabase
npm run db:reset        # Reset & apply migrations  
npm run db:types        # Generate TypeScript types
npm run db:push         # Deploy migrations to production
```

### Testing & Quality
```bash
npm run test            # Run unit tests (Vitest)
npm run test:ui         # Interactive test UI
npm run test:e2e        # End-to-end tests (Playwright)
npm run test:coverage   # Test coverage report
```

---

## 🧪 Technology Stack

### Core Framework
- **[Next.js 15.4](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - Latest React features

### Backend & Database  
- **[Supabase](https://supabase.com/)** - PostgreSQL, Auth, Real-time, Storage
- **[Prisma](https://www.prisma.io/)** - Database ORM & migrations
- **Row Level Security** - Enterprise-grade data protection

### AI & ML
- **[OpenAI GPT-4](https://openai.com/)** - Advanced language processing
- **[LangChain](https://langchain.com/)** - AI application framework
- **Embeddings** - Semantic search and content similarity

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

### Testing & Quality
- **[Vitest](https://vitest.dev/)** - Fast unit testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality

---

## 🎨 Design Philosophy

Neuros follows Apple's design principles with a focus on:

- **Clarity**: Every element has a purpose
- **Deference**: Content is king, UI supports it
- **Depth**: Visual layers create understanding
- **Consistency**: Familiar patterns reduce cognitive load

### Color Palette
```css
/* Primary Colors */
--primary: #007AFF;     /* iOS Blue */
--secondary: #5856D6;   /* iOS Purple */

/* Neutral Scale */
--gray-50: #F9FAFB;
--gray-900: #111827;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;  
--error: #EF4444;
```

---

## 🔐 Security & Privacy

- **🛡️ Row Level Security**: Database-level access control
- **🔐 JWT Authentication**: Secure, stateless authentication
- **🌐 HTTPS Everywhere**: All communications encrypted
- **📊 Privacy by Design**: Minimal data collection, maximum protection
- **🔒 SOC 2 Compliant**: Enterprise security standards

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/n3wth/neuros)

1. **Connect Repository**: Link your GitHub fork
2. **Configure Environment**: Add required environment variables
3. **Deploy**: Automatic builds and deployments

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables for Production

```env
# Database
DATABASE_URL=your_production_db_url
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

---

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent ratings
- **Bundle Size**: Optimized with code splitting
- **Caching Strategy**: Static generation + ISR where appropriate

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: Check `CLAUDE.md` for guidelines
4. **Add tests**: Ensure your code is well tested
5. **Submit a pull request**: Describe your changes clearly

### Code Standards

- **TypeScript**: Strict mode, proper typing
- **Testing**: Unit tests for business logic, E2E for user flows  
- **Commits**: Conventional commit messages
- **Documentation**: Update README and inline docs

---

## 📚 Documentation

### Getting Started
- [🚀 Quick Start Guide](#quick-start)
- [⚙️ Configuration](docs/configuration.md)
- [🏗️ Architecture Overview](docs/architecture.md)

### Development  
- [🛠️ Development Setup](docs/development.md)
- [🧪 Testing Guide](docs/testing.md)
- [🎨 UI Components](docs/components.md)

### Deployment & Operations
- [🚀 Deployment Guide](docs/deployment.md)
- [📊 Monitoring](docs/monitoring.md)
- [🔐 Security](docs/security.md)

---

## 📊 Roadmap

### 🎯 Current Focus (Q1 2024)
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Collaborative Learning**: Study groups and shared decks
- [ ] **Advanced Analytics**: ML-powered learning insights
- [ ] **Plugin System**: Third-party integrations

### 🚀 Coming Soon (Q2 2024)  
- [ ] **Voice Learning**: Audio-based learning modes
- [ ] **AR/VR Support**: Immersive learning experiences
- [ ] **Enterprise Features**: SSO, team management, analytics
- [ ] **API Platform**: Public API for developers

---

## 💬 Community & Support

### Get Help
- **📖 Documentation**: Comprehensive guides and API reference
- **💬 Discord**: Join our community chat
- **🐛 Issues**: Report bugs or request features
- **📧 Email**: hello@neuros.app for direct support

### Stay Updated
- **⭐ Star** this repository for updates
- **🐦 Follow** [@neuros_app](https://twitter.com/neuros_app) on Twitter  
- **📧 Subscribe** to our newsletter for product updates

---

## 📄 License

**MIT License** - feel free to use Neuros for personal and commercial projects.

See [LICENSE](LICENSE) for full details.

---

## 🙏 Acknowledgments

Built with ❤️ using amazing open-source tools:

- **Next.js Team** - For the incredible React framework
- **Supabase** - For the backend-as-a-service platform  
- **OpenAI** - For GPT-4 and advanced AI capabilities
- **Vercel** - For seamless deployment and hosting
- **shadcn** - For beautiful, accessible UI components

---

<div align="center">

**Ready to revolutionize your learning?**

[🚀 **Get Started**](https://neuros.vercel.app) • [⭐ **Star on GitHub**](https://github.com/n3wth/neuros) • [💬 **Join Community**](https://discord.gg/neuros)

Made with 🧠 and ☕ by the Neuros team

</div>