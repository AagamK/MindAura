import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { ArrowRight, Bot, MessageCircle, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/footer';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-accent" />,
    title: 'Empathetic Conversations',
    description:
      'Chat with MindAura, your AI companion designed for supportive and mindful dialogue.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-accent" />,
    title: 'A Space to Reflect',
    description:
      'Gain clarity and perspective by voicing your thoughts and feelings in a private, non-judgmental environment.',
  },
  {
    icon: <User className="h-8 w-8 text-accent" />,
    title: 'Always Available',
    description:
      'MindAura is here for you 24/7, whenever you need a moment to pause, reflect, or just talk.',
  },
];

const testimonials = [
  {
    quote:
      'MindAura has been a wonderful tool for my daily reflections. It feels like talking to a calm, supportive friend.',
    author: 'Alex R.',
    role: 'Mindfulness Practitioner',
  },
  {
    quote:
      'As someone with a busy schedule, having a space to quickly de-stress and unload my thoughts is invaluable. Highly recommend!',
    author: 'Jessica M.',
    role: 'Software Engineer',
  },
  {
    quote:
      'I was skeptical about an AI chatbot, but the conversations are surprisingly thoughtful. It helps me organize my feelings.',
    author: 'David L.',
    role: 'University Student',
  },
];

export default function Home() {
  const heroImage = placeholderImages.find(
    (img) => img.id === 'landing-hero'
  );

  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      <section className="w-full py-24 md:py-40 bg-grid-small-white/[0.2] relative">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container mx-auto text-center px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-2">
              Your AI-powered mental wellness companion.
            </h1>
            <p className="max-w-[600px] mx-auto text-lg text-muted-foreground">
              MindAura provides a safe, simple, and beautiful space to chat with
              an empathetic AI. Reflect, calm down, and feel heard.
            </p>
            <Link href="/chat">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105">
                Start Talking <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              A new way to care for your mind
            </h2>
            <p className="mt-4 text-muted-foreground">
              MindAura is more than just a chatbot. It's a tool to support your
              mental wellbeing.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center bg-card/50 border-border/50 hover:border-accent transition-all duration-300 hover:bg-card">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Loved by users worldwide
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear what people are saying about their experience with MindAura.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="flex flex-col bg-card/50 border-border/50 p-6">
                 <CardContent className="flex-grow p-0">
                   <MessageCircle className="mb-4 h-8 w-8 text-accent" />
                   <p className="text-muted-foreground">
                     &quot;{testimonial.quote}&quot;
                   </p>
                 </CardContent>
                 <CardHeader className="p-0 pt-6">
                   <p className="font-semibold">{testimonial.author}</p>
                   <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                 </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
