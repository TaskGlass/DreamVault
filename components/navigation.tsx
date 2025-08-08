"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart3, User, Sparkles, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "Readings", href: "/readings", icon: Sparkles },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-card mx-4 mb-6 rounded-2xl p-2">
          <div className="flex justify-around">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-xl transition-all",
                    isActive ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center p-2 rounded-xl transition-all text-gray-400 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="glass-card h-[calc(100vh-2rem)] m-4 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center mb-8">
            <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-xl font-bold text-glow">DreamVault</h1>
          </div>

          <nav className="space-y-2 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all w-full text-left",
                    isActive
                      ? "bg-purple-500/20 text-purple-300 glow"
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-xl transition-all text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
