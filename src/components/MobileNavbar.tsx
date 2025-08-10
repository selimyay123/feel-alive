"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Mail } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

function MobileNavbar() {
    const pathname = usePathname();
    const { t, setLocale, locale } = useI18n();
    const navLinks = [
        { href: "/", icon: <Home size={25} />, label: "Home" },
        { href: "/about", icon: <Info size={25} />, label: "About" },
        { href: "/contact", icon: <Mail size={25} />, label: "Contact" },
    ];

    return (
        <div className="w-full flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 w-full pl-4">
                    <span className="fi fi-tr" onClick={() => setLocale('tr')}></span>
                    <span className="fi fi-us" onClick={() => setLocale('en')}></span>
                </div>
                <div className="flex gap-4 rounded-full text-black bg-white/15 backdrop-blur-lg p-2 w-fit ml-auto">
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
                </div>
            </div>


            <Link href="/" className="">
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
