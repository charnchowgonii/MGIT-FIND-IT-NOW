
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type ClaimInsert = TablesInsert<'claims'>;

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (claim: Omit<ClaimInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('claims')
        .insert([claim])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating claim:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useVerifyClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ claimId, isVerified }: { claimId: string; isVerified: boolean }) => {
      const { data, error } = await supabase
        .from('claims')
        .update({ 
          is_verified: isVerified,
          verified_at: isVerified ? new Date().toISOString() : null
        })
        .eq('id', claimId)
        .select()
        .single();
      
      if (error) {
        console.error('Error verifying claim:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    },
  });
};
