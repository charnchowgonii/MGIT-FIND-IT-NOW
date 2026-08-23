
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_name')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }
      
      // Return unique badge names
      return [...new Set(data?.map(badge => badge.badge_name) || [])];
    },
    enabled: !!userId,
  });
};
