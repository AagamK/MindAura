import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MindAura Chat - Your AI Wellness Companion',
  description: 'A safe space to chat, reflect, and feel heard.',
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="pointer-events-none absolute -inset-px z-0 opacity-50 [mask-image:radial-gradient(120%_120%_at_50%_0%,white,transparent)] bg-gradient-to-br from-primary/30 via-transparent to-transparent"></div>
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}