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
    <div className="bg-gradient-to-br from-background via-card to-background">
      {children}
    </div>
  );
}
