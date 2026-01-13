import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, Wind, Droplets, DollarSign, FileText, Users, 
  CheckCircle, ArrowRight, Star, TrendingUp, AlertTriangle
} from 'lucide-react'
import { Button, Card } from '../components/ui'
import { Footer } from '../components/navigation'

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Complete Protection Score',
      description: 'Assess your home across 7 critical categories: wind, flood, thermal, systems, site, legal, and smart tech.',
      color: 'emerald',
    },
    {
      icon: AlertTriangle,
      title: '2026 REAL Rules Navigator',
      description: 'Understand the 40% substantial improvement rule and what it means for your renovations.',
      color: 'amber',
    },
    {
      icon: DollarSign,
      title: 'Cost & Savings Calculator',
      description: 'Get accurate estimates for upgrades and see how much you could save on insurance.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Verified Contractor Network',
      description: 'Connect with FORTIFIED-certified pros who specialize in coastal resilience.',
      color: 'purple',
    },
  ]

  const stats = [
    { value: '$47K', label: 'Avg. flood damage prevented' },
    { value: '35%', label: 'Insurance savings possible' },
    { value: '2,500+', label: 'NJ homes protected' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/50 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              2026 NJ REAL Rules Now Active
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-100 leading-tight mb-6"
            >
              Protect Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"> Shore Home</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              Navigate NJ's new coastal regulations, cut insurance costs, and build a 
              storm-ready home with our free assessment tool.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/score">
                <Button size="lg" className="gap-2">
                  Get Your Free Score
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  I Have an Account
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-16 border-t border-slate-800"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-amber-900/30 border-y-2 border-amber-500/30 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-amber-200">The 40% Trap is Real</h3>
              <p className="text-amber-300/80">
                If your renovation exceeds 40% of your home's value, NJ now requires elevating to +4ft above flood level. 
                Find out if you're at risk.
              </p>
            </div>
            <Link to="/score" className="flex-shrink-0">
              <Button variant="secondary" size="sm">Check My Property</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Everything You Need to Protect Your Investment
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our comprehensive tool helps you understand your risks, plan upgrades, and find the right professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:border-slate-600 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-900/50 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Answer a Few Questions', desc: 'Our quick quiz learns about your property in under 2 minutes.' },
              { step: '2', title: 'Get Your Score', desc: 'See exactly where you\'re protected and where you\'re vulnerable.' },
              { step: '3', title: 'Take Action', desc: 'Follow your personalized roadmap and connect with verified pros.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/score">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-200 mb-6">
            "ShoreHomeScore helped us understand exactly what we needed before our renovation. 
            We avoided the 40% trap and saved over $15,000 on our insurance."
          </blockquote>
          <div className="text-slate-400">
            <span className="font-semibold text-slate-300">Mike & Sarah T.</span> — Point Pleasant, NJ
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-900/50 to-cyan-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Ready to Protect Your Shore Home?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of NJ homeowners who are taking control of their coastal property's future.
          </p>
          <Link to="/score">
            <Button size="lg" className="gap-2">
              Start Your Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required. Takes less than 5 minutes.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
