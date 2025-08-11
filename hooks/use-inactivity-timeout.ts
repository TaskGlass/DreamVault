import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function useInactivityTimeout(timeoutMinutes: number = 3) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(async () => {
      try {
        // Check if user is still authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Sign out the user
          await supabase.auth.signOut();
          
          // Redirect to marketing landing page
          router.push('/home');
        }
      } catch (error) {
        console.error('Error during auto-logout:', error);
        // Even if there's an error, redirect to landing page
        router.push('/home');
      }
    }, timeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Set up activity listeners
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize the timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutMinutes]);

  return { resetTimer };
}
