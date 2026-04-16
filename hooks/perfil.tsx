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

                if (error) {
                    console.log('Error fetching profile:', error);
                    setProfile({ username: user.user_metadata?.full_name || 'Usuario' });
                } else if (data) {
                    setProfile({ username: data.username });
                } else {
                    setProfile({ username: user.user_metadata?.full_name || 'Usuario' });
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
