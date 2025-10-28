'use client';

import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useTheme } from '../providers/theme-provider';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold">MindAura</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {!loading &&
              (user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline-block">
                    Welcome, {user.displayName || user.email}
                  </span>
                   <Link href="/dashboard">
                    <Button variant="ghost" className="gap-2">
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="gap-2">
                      <LogIn className="h-5 w-5" /> Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      <UserPlus className="h-5 w-5" /> Sign Up
                    </Button>
                  </Link>
                </>
              ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
