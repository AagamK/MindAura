import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { ArrowRight, Bot, MessageCircle, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/footer';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Empathetic Conversations',
    description:
      'Chat with MindAura, your AI companion designed for supportive and mindful dialogue.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'A Space to Reflect',
    description:
      'Gain clarity and perspective by voicing your thoughts and feelings in a private, non-judgmental environment.',
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
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
    <div className="flex flex-col items-center">
      <section className="w-full bg-card py-20 md:py-32">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your AI-powered mental wellness companion.
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              MindAura provides a safe, simple, and beautiful space to chat with
              an empathetic AI. Reflect, calm down, and feel heard.
            </p>
            <Link href="/chat">
              <Button size="lg" className="gap-2">
                Start Talking <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="relative h-64 w-full md:h-96">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="rounded-xl object-cover shadow-2xl"
              />
            )}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              A new way to care for your mind
            </h2>
            <p className="mt-4 text-muted-foreground">
              MindAura is more than just a chatbot. It&apos;s a tool to support your
              mental wellbeing.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
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

      <section id="testimonials" className="w-full bg-card py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Loved by users worldwide
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear what people are saying about their experience with MindAura.
            </p>
          </div>
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full">
                      <CardContent className="pt-6">
                        <MessageCircle className="mb-4 h-8 w-8 text-primary" />
                        <p className="text-muted-foreground">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </CardContent>
                      <CardHeader>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <Footer />
    </div>
  );
}
