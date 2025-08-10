"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { CheckCircle } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                alert("Giriş sırasında hata oluştu: " + error.message);
                router.push("/");
                return;
            }

            if (session) {
                setIsLoggedIn(true);
                setLoading(false);
                router.push("/");
            } else {
                router.push("/");
            }
        };

        checkSession();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="flex items-center gap-4 bg-green-600 bg-opacity-90 rounded-full px-6 py-4 shadow-lg">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900">
                    <CheckCircle size={24} />
                </div>
                <span className="text-lg font-semibold">
                    Congratulations! You have successfully logged in.
                </span>
            </div>
        </div>
    );
}
