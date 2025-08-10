"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase, } from "../../lib/supabaseClient"; // Session tipini Supabase'den almak mümkünse

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null); // Supabase tipi kullanıldı

    useEffect(() => {
        if (typeof window === "undefined") return;

        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Session alınamadı:", error.message);
            }

            setSession(data?.session ?? null);
            setLoading(false);

            // Eğer oturum varsa ana sayfaya yönlendir
            if (data?.session) {
                router.replace("/");
            }
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // Oturum açılmışsa ana sayfaya, değilse login sayfasına yönlendir
            if (session) {
                router.replace("/");
            } else {
                router.replace("/login");
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
