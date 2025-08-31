"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, LogOut, Mail } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { ClipLoader } from "react-spinners";

function Navbar() {
    const pathname = usePathname();
    const { t, setLocale } = useI18n();

    // Kullanıcı: undefined = yükleniyor, null = çıkış yapılmış, obje = giriş yapılmış
    const [user, setUser] = useState<
        { email: string; full_name?: string; avatar_url?: string } | null | undefined
    >(undefined);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const fetchSessionAndUser = async () => {
            try {
                const { data: sessionData } = await supabase.auth.getSession();

                if (!sessionData.session) {
                    setUser(null);
                    return;
                }

                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) {
                    console.error("Kullanıcı alınamadı:", error.message);
                    setUser(null);
                    return;
                }

                if (user) {
                    setUser({
                        email: user.email || "",
                        full_name: user.user_metadata.full_name,
                        avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
                    });
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Kullanıcı alınamadı (catch):", e);
                setUser(null);
            }
        };

        fetchSessionAndUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    email: session.user.email || "",
                    full_name: session.user.user_metadata.full_name,
                    avatar_url:
                        session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [isMounted]);

    const navLinks = [
        { href: "/", icon: <Home size={30} />, label: "Home" },
        { href: "/about", icon: <Info size={30} />, label: "About" },
        { href: "/contact", icon: <Mail size={30} />, label: "Contact" },
    ];

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert("Çıkış yapılırken hata oluştu: " + error.message);
    };

    if (!isMounted) {
        return (
            <div>
                <div className="flex items-center gap-4 w-full justify-end pr-8">
                    <span className="fi fi-tr cursor-pointer" onClick={() => setLocale("tr")}></span>
                    <span className="fi fi-us cursor-pointer" onClick={() => setLocale("en")}></span>
                </div>
                <div className="w-full flex items-center justify-between max-md:justify-center max-md:gap-4">
                    <Link href="/" className="italic text-xl">
                        <Image
                            src={"/new-logo-1.png"}
                            alt={"app logo"}
                            width={250}
                            height={250}
                            className="rounded-xl"
                        />
                    </Link>
                    <div className="flex max-md:flex-col gap-4 max-md:gap-2 rounded-full text-black bg-white/15 backdrop-blur-lg py-4 px-6 max-md:py-2 max-md:px-3 items-center">
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 w-full justify-end pr-8">
                <span className="fi fi-tr cursor-pointer" onClick={() => setLocale("tr")}></span>
                <span className="fi fi-us cursor-pointer" onClick={() => setLocale("en")}></span>
            </div>
            <div className="w-full flex items-center justify-between max-md:justify-center max-md:gap-4">
                <Link href="/" className="italic text-xl">
                    <Image
                        src={"/new-logo-1.png"}
                        alt={"app logo"}
                        width={250}
                        height={250}
                        className="rounded-xl"
                    />
                </Link>
                <div className="flex max-md:flex-col gap-4 max-md:gap-2 rounded-full text-black bg-white/15 backdrop-blur-lg py-4 px-6 max-md:py-2 max-md:px-3 items-center">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`p-3 max-md:p-2 rounded-full transition-all duration-200 ${isActive ? "bg-white text-black" : "text-white"
                                    }`}
                            >
                                <span className="block">{link.icon}</span>
                            </Link>
                        );
                    })}

                    {user === undefined ? (
                        <div className="flex items-center justify-center p-3">
                            <ClipLoader color="#fff" size={20} />
                        </div>) : user ? (
                            <div className="flex items-center gap-2 ml-2 bg-white/30 p-4 rounded-full">
                                {user.avatar_url ? (
                                    <Image
                                        src={user.avatar_url}
                                        alt="Profile photo"
                                        width={30}
                                        height={30}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold text-sm">
                                        {user.full_name
                                            ? user.full_name.charAt(0).toUpperCase()
                                            : user.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                    className="text-white hover:text-red-600 transition p-1 rounded"
                                >
                                    <LogOut size={30} />
                                </button>
                            </div>
                        ) : (
                        <Link href="/login" className="underline text-white">
                            <span className="text-lg font-semibold">{t('login')}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
