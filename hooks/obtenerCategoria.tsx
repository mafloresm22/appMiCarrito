import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useObtenerCategorias = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);

    const getCategorias = async () => {
        setLoadingCategorias(true);
        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('idcategorias, nombre, color, icono')
                .order('nombre', { ascending: true });

            if (error) throw error;
            setCategorias(data || []);
        } catch (error: any) {
            console.error('Error fetching categorias:', error.message);
        } finally {
            setLoadingCategorias(false);
        }
    };

    useEffect(() => {
        getCategorias();
    }, []);

    return { categorias, loadingCategorias, refreshCategorias: getCategorias };
};
