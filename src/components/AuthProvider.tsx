"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Session alınamadı:", error.message);
            }

            setSession(data?.session ?? null);
            setLoading(false);

            if (data?.session) {
                router.replace("/");
            }
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                router.replace("/");
            } else {
                router.replace("/");
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}
