import { useCallback, useState } from 'react';
import { supabase } from '../services/supabase';

export const useFiltrarLista = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [groupedLists, setGroupedLists] = useState<any[][]>([]);
    const [activeFilter, setActiveFilter] = useState('Todas'); // Todas, Pendiente, Completado

    // Lógica de agrupación por tiempo (30 minutos de diferencia)
    const groupProductsByTime = useCallback((products: any[]) => {
        if (products.length === 0) return [];

        const groups: any[][] = [];
        let currentGroup: any[] = [products[0]];

        for (let i = 1; i < products.length; i++) {
            const prevTime = new Date(products[i - 1].created_at).getTime();
            const currTime = new Date(products[i].created_at).getTime();

            // Si hay menos de 30 minutos de diferencia, pertenecen a la misma lista
            if (Math.abs(prevTime - currTime) < 30 * 60 * 1000) {
                currentGroup.push(products[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [products[i]];
            }
        }
        groups.push(currentGroup);
        return groups;
    }, []);

    // Aplicar el filtro seleccionado
    const applyFilter = useCallback((products: any[], filter: string) => {
        if (products.length === 0) {
            setGroupedLists([]);
            return;
        }

        const allGroups = groupProductsByTime(products);

        // 2. Se filtra los grupos de productos por su estado (Insensible a mayúsculas)
        if (filter === 'Todas') {
            setGroupedLists(allGroups);
        } else {
            const filterLower = filter.toLowerCase().trim();
            const filteredGroups = allGroups
                .map(group => group.filter(item => {
                    const status = (item.comprado || 'Pendiente').toLowerCase().trim();
                    return status === filterLower;
                }))
                .filter(group => group.length > 0); 
            
            setGroupedLists(filteredGroups);
        }
    }, [groupProductsByTime]);

    // Obtener productos desde Supabase
    const fetchProducts = useCallback(async () => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('user_id', userData.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setAllProducts(data);
                applyFilter(data, activeFilter);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeFilter, applyFilter]);

    return {
        loading,
        setLoading,
        refreshing,
        setRefreshing,
        allProducts,
        groupedLists,
        activeFilter,
        setActiveFilter,
        fetchProducts,
        applyFilter
    };
};
