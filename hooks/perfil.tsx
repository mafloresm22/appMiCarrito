import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export function useProfile() {
    const [profile, setProfile] = useState<{ 
        username: string | null;
        email: string | null;
        createdAt: string | null;
    }>({ 
        username: null,
        email: null,
        createdAt: null
    });
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('perfil')
                    .select('username')
                    .eq('id_perfil', user.id)
                    .maybeSingle();

                const metadataUsername = user.user_metadata?.username || user.user_metadata?.full_name || 'Usuario';

                if (error) {
                    console.log('Error al encontrar el nombre de usuario:', error);
                    setProfile({ 
                        username: metadataUsername,
                        email: user.email || null,
                        createdAt: user.created_at || null
                    });
                } else {
                    setProfile({ 
                        username: data?.username || metadataUsername,
                        email: user.email || null,
                        createdAt: user.created_at || null
                    });
                }
            }
        } catch (error) {
            console.log('Error al obtener el usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return { profile, loading, refreshProfile: getProfile };
}
