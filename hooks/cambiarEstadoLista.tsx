import { supabase } from '../services/supabase';

export const useCambiarEstado = () => {
    const marcarComoCompletado = async (ids: string | string[]) => {
        try {
            let query = supabase
                .from('productos')
                .update({ comprado: 'completado' });

            if (Array.isArray(ids)) {
                query = query.in('id', ids);
            } else {
                query = query.eq('id', ids);
            }

            const { data, error } = await query.select();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    return { marcarComoCompletado };
};
