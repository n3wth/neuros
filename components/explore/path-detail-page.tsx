'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Star, CheckCircle, Lock, Play } from 'lucide-react'

interface PathDetailPageProps {
  pathId: string
}

const pathData: Record<string, {
  title: string
  author: string
  authorBio: string
  duration: string
  students: string
  rating: number
  reviews: number
  description: string
  longDescription: string
  skills: string[]
  prerequisites: string[]
  modules: Array<{
    title: string
    duration: string
    cards: number
    completed?: boolean
    locked?: boolean
    topics: string[]
  }>
}> = {
  'ai-engineer-path': {
    title: 'The AI Engineer Path',
    author: 'Sarah Chen',
    authorBio: 'Senior ML Engineer at Google, 10+ years in AI',
    duration: '12 weeks',
    students: '45.2k',
    rating: 4.9,
    reviews: 1823,
    description: 'From ML basics to deploying production models',
    longDescription: 'This comprehensive path takes you from fundamental machine learning concepts to building and deploying production-ready AI systems. Perfect for software engineers looking to transition into AI or deepen their ML expertise.',
    skills: [
      'Neural network architectures',
      'Training and optimization',
      'Model deployment',
      'MLOps best practices',
      'Transformer models',
      'Computer vision & NLP'
    ],
    prerequisites: [
      'Basic Python programming',
      'Linear algebra fundamentals',
      'Basic statistics knowledge'
    ],
    modules: [
      {
        title: 'ML Foundations',
        duration: '2 weeks',
        cards: 120,
        completed: true,
        topics: ['Linear regression', 'Gradient descent', 'Classification basics']
      },
      {
        title: 'Neural Networks',
        duration: '2 weeks',
        cards: 150,
        completed: true,
        topics: ['Perceptrons', 'Backpropagation', 'Activation functions']
      },
      {
        title: 'Deep Learning',
        duration: '3 weeks',
        cards: 200,
        topics: ['CNNs', 'RNNs', 'Regularization', 'Batch normalization']
      },
      {
        title: 'Transformers & Attention',
        duration: '2 weeks',
        cards: 180,
        topics: ['Self-attention', 'BERT', 'GPT architecture']
      },
      {
        title: 'MLOps & Deployment',
        duration: '2 weeks',
        cards: 140,
        topics: ['Model serving', 'Monitoring', 'A/B testing']
      },
      {
        title: 'Advanced Topics',
        duration: '1 week',
        cards: 100,
        locked: true,
        topics: ['Few-shot learning', 'Model distillation', 'Edge deployment']
      }
    ]
  },
  'modern-full-stack': {
    title: 'Modern Full-Stack',
    author: 'Alex Rivera',
    authorBio: 'Principal Engineer at Vercel, Next.js core team',
    duration: '8 weeks',
    students: '32.1k',
    rating: 4.8,
    reviews: 1456,
    description: 'Next.js, TypeScript, and the modern web stack',
    longDescription: 'Master the modern web development stack with Next.js, TypeScript, and React. Learn to build performant, scalable applications using industry best practices and cutting-edge tools.',
    skills: [
      'React & Next.js',
      'TypeScript mastery',
      'Server components',
      'Database design',
      'API development',
      'Performance optimization'
    ],
    prerequisites: [
      'HTML, CSS, JavaScript basics',
      'Basic React knowledge',
      'Command line familiarity'
    ],
    modules: [
      {
        title: 'TypeScript Fundamentals',
        duration: '1 week',
        cards: 80,
        completed: true,
        topics: ['Types & interfaces', 'Generics', 'Advanced patterns']
      },
      {
        title: 'React Deep Dive',
        duration: '2 weeks',
        cards: 160,
        topics: ['Hooks mastery', 'Context & state', 'Performance']
      },
      {
        title: 'Next.js Essentials',
        duration: '2 weeks',
        cards: 140,
        topics: ['App router', 'Server components', 'Data fetching']
      },
      {
        title: 'Database & Backend',
        duration: '1 week',
        cards: 100,
        topics: ['Prisma ORM', 'PostgreSQL', 'API routes']
      },
      {
        title: 'Authentication & Security',
        duration: '1 week',
        cards: 80,
        topics: ['NextAuth', 'JWT', 'Security best practices']
      },
      {
        title: 'Deployment & DevOps',
        duration: '1 week',
        cards: 90,
        locked: true,
        topics: ['Vercel deployment', 'CI/CD', 'Monitoring']
      }
    ]
  },
  'quantum-fundamentals': {
    title: 'Quantum Fundamentals',
    author: 'Dr. James Liu',
    authorBio: 'Quantum Computing Researcher at IBM, PhD Physics MIT',
    duration: '10 weeks',
    students: '12.3k',
    rating: 4.9,
    reviews: 892,
    description: 'Demystifying quantum computing for developers',
    longDescription: 'Bridge the gap between classical and quantum computing. This path introduces quantum mechanics principles and their application in quantum algorithms and programming.',
    skills: [
      'Quantum mechanics basics',
      'Qubit manipulation',
      'Quantum gates & circuits',
      'Quantum algorithms',
      'Qiskit programming',
      'Error correction'
    ],
    prerequisites: [
      'Linear algebra',
      'Complex numbers',
      'Basic programming knowledge'
    ],
    modules: [
      {
        title: 'Quantum Mechanics Primer',
        duration: '2 weeks',
        cards: 100,
        topics: ['Superposition', 'Entanglement', 'Measurement']
      },
      {
        title: 'Qubits & Gates',
        duration: '2 weeks',
        cards: 120,
        topics: ['Bloch sphere', 'Pauli gates', 'Hadamard gate']
      },
      {
        title: 'Quantum Circuits',
        duration: '2 weeks',
        cards: 140,
        topics: ['Circuit design', 'Bell states', 'Teleportation']
      },
      {
        title: 'Quantum Algorithms',
        duration: '2 weeks',
        cards: 160,
        topics: ['Shor\'s algorithm', 'Grover\'s search', 'VQE']
      },
      {
        title: 'Qiskit Programming',
        duration: '1 week',
        cards: 80,
        topics: ['Circuit creation', 'Simulation', 'Real hardware']
      },
      {
        title: 'Advanced Topics',
        duration: '1 week',
        cards: 90,
        locked: true,
        topics: ['Error correction', 'NISQ era', 'Applications']
      }
    ]
  }
}

export default function PathDetailPage({ pathId }: PathDetailPageProps) {
  const path = pathData[pathId]
  
  if (!path) return null

  const completedModules = path.modules.filter(m => m.completed).length
  const progress = (completedModules / path.modules.length) * 100

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link 
            href="/explore" 
            className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-black/30" />
                <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
                  Learning Path
                </p>
              </div>
              
              <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-6">
                {path.title}
              </h1>
              
              <p className="text-xl text-black/60 font-light leading-relaxed mb-8">
                {path.longDescription}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 p-6 bg-[#FAFAF9] rounded-2xl mb-8">
                <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center">
                  <span className="text-xl font-serif">{path.author.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{path.author}</div>
                  <div className="text-sm text-black/60">{path.authorBio}</div>
                </div>
              </div>

              {/* Skills You'll Learn */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Skills you&apos;ll master</h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-white border border-black/10 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Prerequisites</h3>
                <ul className="space-y-2">
                  {path.prerequisites.map(prereq => (
                    <li key={prereq} className="flex items-start gap-2 text-black/70">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                      <span className="text-sm">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Stats Card */}
                <div className="bg-white rounded-2xl p-6 border border-black/5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/60">Duration</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/60">Students</span>
                      <span className="font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {path.students}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/60">Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {path.rating} ({path.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 pt-6 border-t border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-black/60">Progress</span>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-black rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link 
                    href="/signup"
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-full hover:bg-black/90 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <section className="py-16 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-light mb-8">Course Modules</h2>
          
          <div className="space-y-4">
            {path.modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 border ${
                  module.completed ? 'border-green-200 bg-green-50/30' : 
                  module.locked ? 'border-black/5 opacity-60' : 
                  'border-black/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.completed ? 'bg-green-100' :
                      module.locked ? 'bg-black/5' :
                      'bg-black/10'
                    }`}>
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : module.locked ? (
                        <Lock className="w-4 h-4 text-black/40" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{module.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-black/60 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                        <span>{module.cards} cards</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map(topic => (
                          <span key={topic} className="px-2 py-1 bg-[#FAFAF9] rounded text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {!module.locked && (
                    <button className="px-4 py-2 text-sm border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors">
                      {module.completed ? 'Review' : 'Start'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}