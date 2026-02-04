'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Layout, Zap, BarChart3, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Layout className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight">CPAHive</span>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        <Link href="#testimonials" className="hover:text-foreground transition-colors">Success Stories</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" size="sm">Log in</Button>
        </Link>
        <Link href="/login">
          <Button size="sm" className="hidden sm:flex">Start Free Trial</Button>
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-32 pb-16 px-6 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

    <div className="max-w-4xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          New: Visual Drag & Drop Builder
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
          Build High-Converting <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">CPA Landing Pages</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate visual builder designed effectively for CPA marketers. Create stunning offer walls, content lockers, and landing pages in minutes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link href="/login">
          <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
            Start free now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-2 sm:mt-0 flex items-center">
          <Check className="h-3 w-3 mr-1 text-green-500" />
          No credit card required
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-12 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-2xl"
      >
        <div className="aspect-video rounded-lg bg-background/50 border border-white/5 overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Watch Demo</Button>
          </div>
          {/* Placeholder for Builder UI Screenshot */}
          <div className="w-full h-full flex flex-col">
            <div className="h-12 border-b border-border flex items-center px-4 space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 flex">
              <div className="w-64 border-r border-border p-4 space-y-4">
                <div className="h-8 bg-muted rounded w-full" />
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-5/6" />
                <div className="h-32 bg-muted/50 rounded w-full mt-4" />
              </div>
              <div className="flex-1 p-8 bg-muted/10 flex items-center justify-center">
                <div className="w-[400px] h-[300px] bg-card border border-border rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4">
                  <div className="h-16 w-16 bg-primary/20 rounded-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-10 bg-primary rounded w-full mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 group">
    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
)

const Features = () => (
  <section id="features" className="py-24 px-6 bg-muted/30">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to <span className="text-primary">scale</span></h2>
        <p className="text-muted-foreground text-lg">Stop struggling with generic builders. CPAHive gives you specialized tools designed for CPA marketing success.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Layout}
          title="Visual Drag & Drop"
          description="Build stunning pages with our intuitive editor. Real-time preview, responsive design controls, and zero coding required."
        />
        <FeatureCard
          icon={Lock}
          title="Smart Content Lockers"
          description="High-converting locker templates built-in. Customize trigger events, aesthetics, and integration with any network."
        />
        <FeatureCard
          icon={BarChart3}
          title="Real-Time Analytics"
          description="Track visitors, clicks, and conversions instantly. Optimize your campaigns with data-driven insights baked into the platform."
        />
        <FeatureCard
          icon={Zap}
          title="Instant Publishing"
          description="Get your pages live in seconds. Use our blazing fast subdomains or connect your own custom domain easily."
        />
        <FeatureCard
          icon={CheckCircle2}
          title="Mobile Optimized"
          description="Every template is mobile-first. Capture traffic from iOS and Android users with perfectly responsive designs."
        />
        <FeatureCard
          icon={Layout}
          title="Conversion Templates"
          description="Access our library of battle-tested templates proven to convert for gaming, sweepstakes, and utility niches."
        />
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="border-t border-border py-12 px-6 bg-background">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Layout className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight">CPAHive</span>
      </div>
      <div className="text-sm text-muted-foreground">
        &copy; 2026 CPAHive. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function Home() {
  const { user, isLoading } = db.useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);


  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <Hero />
      <Features />
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 bg-gradient-to-b from-primary/10 to-transparent p-12 rounded-3xl border border-primary/20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to boost your earnings?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of marketers using CPAHive to build better pages faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">Start Your 7-Day Free Trial</Button>
            </Link>
            <p className="text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
