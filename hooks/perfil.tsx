import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export function useProfile() {
    const [profile, setProfile] = useState<{ username: string | null }>({ username: null });
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
                    console.log('Error fetching profile:', error);
                    setProfile({ username: metadataUsername });
                } else {
                    setProfile({ username: data?.username || metadataUsername });
                }
            }
        } catch (error) {
            console.log('Error getting user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return { profile, loading, refreshProfile: getProfile };
}
