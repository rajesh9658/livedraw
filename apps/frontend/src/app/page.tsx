'use client';

import { ArrowRight, Compass, Layers, Share2, Wand2, Users, Star, Sparkles, Router } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/themetogle";

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    // function animate() {
    //   ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);

    //   particles.forEach(particle => {
    //     particle.x += particle.vx;
    //     particle.y += particle.vy;

    //     if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    //     if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    //     ctx.beginPath();
    //     ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    //     ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //     ctx.fill();
    //   });

    //   requestAnimationFrame(animate);
    // }

    // animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
        <HeroCanvas />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm px-4 py-2 rounded-full text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Revolutionizing PoE Build Planning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Design Your Path of Exile Builds
              <span className="block text-4xl md:text-6xl mt-2">Visually</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed">
              Create, share, and optimize your Path of Exile skill tree builds with our intuitive visual editor.
            </p>
            <div className="flex gap-4 justify-center items-center flex-col sm:flex-row">
              <Link href="auth">
              <Button size="lg" className="gap-2 backdrop-blur-sm">
                Start Building <ArrowRight className="w-5 h-5" />
              </Button>
              </Link>
              <Link href={`https://github.com/rajesh9658/livedraw.git`} >
              <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm">
                Github
              </Button>
              </Link>

            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need for Perfect Builds
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed for the Path of Exile community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Wand2 className="w-6 h-6" />,
                title: "Intuitive Editor",
                description: "Drag and drop interface makes building skill trees effortless"
              },
              {
                icon: <Share2 className="w-6 h-6" />,
                title: "Easy Sharing",
                description: "Share your builds instantly with a unique URL"
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Build Versions",
                description: "Track changes and maintain multiple versions"
              },
              {
                icon: <Compass className="w-6 h-6" />,
                title: "Build Guides",
                description: "Detailed guides to help optimize your choices"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-lg bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-black/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">ExileDraw - Path of Exile is a trademark of Grinding Gear Games</p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}