import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Item = Tables<'items'>;
type ItemInsert = TablesInsert<'items'>;

export type SortOption = 'date-lost' | 'date-found' | 'item-name' | 'date-reported';

export const useItems = (type: 'lost' | 'found', sortBy: SortOption = 'date-lost', includeAll: boolean = false) => {
  return useQuery({
    queryKey: ['items', type, sortBy, includeAll],
    queryFn: async () => {
      let query = supabase
        .from('items')
        .select('*')
        .eq('type', type);

      // Only filter by active status if not admin viewing all
      if (!includeAll) {
        query = query.eq('status', 'active');
      }

      // Apply sorting
      switch (sortBy) {
        case 'date-lost':
        case 'date-found':
          query = query.order('date_lost_found', { ascending: false });
          break;
        case 'item-name':
          query = query.order('name', { ascending: true });
          break;
        case 'date-reported':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<ItemInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating item:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error('Error deleting item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: string }) => {
      const { error } = await supabase
        .from('items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', itemId);
      
      if (error) {
        console.error('Error updating item status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
