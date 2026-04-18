import { supabase } from '../services/supabase';

export const useGuardarLista = () => {
    
    const guardarProductos = async (itemsAgregados: any[]) => {
        if (itemsAgregados.length === 0) {
            return { success: false, error: 'EMPTY' };
        }

        try {
            // 1. Obtener el usuario actual
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData.user?.id;
            if (!user_id) throw new Error('AUTH_ERROR');

            // 2. Obtener todas las categorías de la base de datos para mapear
            const { data: categoriasDB, error: catError } = await supabase
                .from('categorias')
                .select('idcategorias, nombre');

            if (catError) throw catError;

            // 3. Preparar el mapeo (Nombre -> UUID) con normalización (quitar acentos)
            const normalize = (str: string) => 
                (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

            const catMap = new Map();
            categoriasDB?.forEach(cat => {
                catMap.set(normalize(cat.nombre), cat.idcategorias);
            });

            // 4. Preparar la inserción múltiple con el mapeo inteligente
            const productInserts = itemsAgregados.map(item => {
                const originalCat = item.categoria || "";
                const normalizedSearch = normalize(originalCat);
                
                // Intento 1: Coincidencia exacta
                let categoriaId = catMap.get(normalizedSearch);

                // Intento 2: Coincidencia parcial
                if (!categoriaId) {
                    for (let [dbName, id] of catMap) {
                        if (normalizedSearch.length > 3 && (dbName.includes(normalizedSearch) || normalizedSearch.includes(dbName))) {
                            categoriaId = id;
                            break; 
                        }
                    }
                }

                // Intento 3: Fallback a "Otros"
                if (!categoriaId) {
                    categoriaId = catMap.get("otros"); 
                }

                return {
                    nombre: item.nombre,
                    imagen_url: item.imagen,
                    user_id: user_id,
                    cantidad: item.quantity || 1,
                    categoria_id: categoriaId,
                    comprado: 'Pendiente'
                };
            });

            // 5. Insertar en Supabase
            const { error: insertError } = await supabase.from('productos').insert(productInserts);
            if (insertError) throw insertError;

            return { success: true, warning: null };
        } catch (error: any) {
            console.error('Error al guardar lista:', error.message);
            return { success: false, error: error.message || 'GENERIC_ERROR' };
        }
    };

    return { guardarProductos };
};
