"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Mail, LogOut, LogIn } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { ClipLoader } from "react-spinners";

function MobileNavbar() {
    const pathname = usePathname();
    const { setLocale } = useI18n();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<
        { email: string; full_name?: string; avatar_url?: string } | null | undefined
    >(undefined);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
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

                if (error || !user) {
                    setUser(null);
                    return;
                }

                setUser({
                    email: user.email || "",
                    full_name: user.user_metadata.full_name,
                    avatar_url:
                        user.user_metadata.avatar_url ||
                        user.user_metadata.picture ||
                        "",
                });
            } catch (e) {
                console.error("Kullanıcı alınamadı (catch):", e);
                setUser(null);
            }
        };

        fetchUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    email: session.user.email || "",
                    full_name: session.user.user_metadata.full_name,
                    avatar_url:
                        session.user.user_metadata.avatar_url ||
                        session.user.user_metadata.picture ||
                        "",
                });
            } else {
                setUser(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert("Çıkış yapılırken hata oluştu: " + error.message);
        setIsDropdownOpen(false);
    };

    const navLinks = [
        { href: "/", icon: <Home size={25} />, label: "Home" },
        { href: "/about", icon: <Info size={25} />, label: "About" },
        { href: "/contact", icon: <Mail size={25} />, label: "Contact" },
    ];

    return (
        <div className="w-full flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 w-full pl-4">
                    <span className="fi fi-tr cursor-pointer" onClick={() => setLocale("tr")}></span>
                    <span className="fi fi-us cursor-pointer" onClick={() => setLocale("en")}></span>
                </div>

                <div className="flex items-center gap-4 rounded-full text-black bg-white/15 backdrop-blur-lg p-2 w-fit ml-auto">
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
                        </div>
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-2 p-2 rounded-full bg-white/30 cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {user.avatar_url ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={user.avatar_url}
                                            alt="Profile photo"
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                                        {user.full_name
                                            ? user.full_name.charAt(0).toUpperCase()
                                            : user.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg flex flex-col z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-red-500 gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <LogOut size={20} className="text-red-500" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="underline text-white">
                            <div className="p-2 bg-white/15 rounded-full">
                                <span className="text-lg font-semibold">
                                    <LogIn />
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <Link href="/">
                <Image
                    src={"/new-logo-1.png"}
                    alt={"app logo"}
                    width={200}
                    height={200}
                    className="rounded-xl mx-auto"
                />
            </Link>
        </div>
    );
}

export default MobileNavbar;
