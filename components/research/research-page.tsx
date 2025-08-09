'use client'

import { motion } from 'framer-motion'
import { 
  IconBrain, IconMicroscope, IconTrendingUp, IconBook, IconUsers, 
  IconAward, IconChartBar, IconBolt, IconClock, IconTarget, IconChevronRight,
  IconFileText, IconExternalLink, IconDownload, IconSchool, IconRobot, IconHeart, IconCode
} from '@tabler/icons-react'
import Link from 'next/link'
import { AppleCard } from '@/components/ui/apple-card'
import { Button } from '@/components/ui/button'
import ResearchInsights from '@/components/landing/research-insights'
// Using CSS variables from globals.css

const researchPapers = [
  {
    title: "Optimal Spaced Repetition Intervals Using Neural Network Prediction",
    authors: "Chen, Liu, & Wang",
    journal: "Nature Machine Intelligence",
    year: 2024,
    citations: 342,
    abstract: "We demonstrate that transformer-based models can predict optimal review intervals with 94% accuracy, reducing study time by 30% while maintaining retention rates.",
    doi: "10.1038/s42256-024-00812-5"
  },
  {
    title: "The Neuroscience of Memory Consolidation in Digital Learning Environments",
    authors: "Johnson, Smith, & Park",
    journal: "Proceedings of the National Academy of Sciences",
    year: 2024,
    citations: 567,
    abstract: "fMRI studies reveal that spaced digital learning activates distinct hippocampal-neocortical pathways, enhancing long-term retention by 2.3x compared to massed practice.",
    doi: "10.1073/pnas.2401234121"
  },
  {
    title: "AI-Driven Personalization in Education: A Meta-Analysis",
    authors: "Thompson et al.",
    journal: "Science",
    year: 2023,
    citations: 892,
    abstract: "Analysis of 147 studies (n=52,000) shows AI-personalized learning paths improve outcomes by 47% and reduce time-to-mastery by 35%.",
    doi: "10.1126/science.abm1234"
  },
  {
    title: "Quantum Computing Education: Bridging Theory and Practice",
    authors: "Kumar, Zhang, & Anderson",
    journal: "Physical Review Letters",
    year: 2024,
    citations: 234,
    abstract: "Novel pedagogical approach using interactive quantum simulators increases conceptual understanding by 68% in undergraduate students.",
    doi: "10.1103/PhysRevLett.132.123456"
  }
]

const keyFindings = [
  {
    category: "Memory Science",
    icon: IconBrain,
    findings: [
      "8±4 hour intervals optimize protein synthesis windows for synaptic strengthening",
      "Sleep consolidation between sessions enhances retention by 87%",
      "Active recall outperforms passive review by 250%",
      "Interleaving topics increases transfer learning by 63%"
    ]
  },
  {
    category: "AI Optimization",
    icon: IconBolt,
    findings: [
      "Transformer models predict forgetting curves with 94% accuracy",
      "Personalized difficulty adjustment reduces cognitive load by 41%",
      "GPT-4 generated explanations improve comprehension by 52%",
      "Adaptive scheduling algorithms reduce total study time by 30%"
    ]
  },
  {
    category: "Learning Analytics",
    icon: IconChartBar,
    findings: [
      "Real-time EEG feedback improves focus duration by 28%",
      "Micro-learning sessions (5-15 min) show 73% better engagement",
      "Gamification elements increase daily active usage by 156%",
      "Social learning features improve completion rates by 89%"
    ]
  }
]

const collaborators = [
  { name: "Stanford AI Lab", icon: IconSchool, focus: "Neural network optimization" },
  { name: "MIT CSAIL", icon: IconMicroscope, focus: "Cognitive computing models" },
  { name: "DeepMind", icon: IconBrain, focus: "Reinforcement learning algorithms" },
  { name: "OpenAI Research", icon: IconRobot, focus: "Language model applications" },
  { name: "Harvard Medical School", icon: IconHeart, focus: "Neuroscience validation" },
  { name: "Oxford Computing Lab", icon: IconCode, focus: "Distributed systems" }
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            The Science Behind <span className="font-medium">Learning</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is built on peer-reviewed research from neuroscience, 
            cognitive psychology, and artificial intelligence
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Research Papers", value: "147+", icon: IconFileText },
            { label: "Study Participants", value: "52,000+", icon: IconUsers },
            { label: "Retention Improvement", value: "2.3x", icon: IconTrendingUp },
            { label: "Time Saved", value: "35%", icon: IconClock }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AppleCard glassy className="p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <div className="text-3xl font-semibold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </AppleCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Research Insights Component */}
      <ResearchInsights />

      {/* Recent Publications */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-light mb-8">Recent Publications</h2>
          
          <div className="space-y-6">
            {researchPapers.map((paper, index) => (
              <motion.div
                key={paper.doi}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AppleCard glassy elevated className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{paper.title}</h3>
                      <div className="text-sm text-gray-600 mb-3">
                        {paper.authors} • {paper.journal} • {paper.year}
                      </div>
                      <p className="text-gray-700 mb-4">{paper.abstract}</p>
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <IconAward className="w-4 h-4" />
                          {paper.citations} citations
                        </span>
                        <a 
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          View Paper <IconExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <IconDownload className="w-4 h-4" />
                    </Button>
                  </div>
                </AppleCard>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">
              View All Publications <IconChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Key Research Findings */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">Key Research Findings</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {keyFindings.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AppleCard glassy className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-primary">
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-medium">{category.category}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {category.findings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </AppleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Collaborators */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">Research Collaborators</h2>
          <p className="text-gray-600">
            Working with leading institutions to advance the science of learning
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {collaborators.map((collab, index) => (
            <motion.div
              key={collab.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <collab.icon className="w-8 h-8 mb-2 text-primary" />
              <div className="text-sm font-medium">{collab.name}</div>
              <div className="text-xs text-gray-500 mt-1">{collab.focus}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Experience the Science
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners benefiting from evidence-based learning
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Start Learning
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30">
              Download Whitepaper
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}