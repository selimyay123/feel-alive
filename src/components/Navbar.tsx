"use client";
import "flag-icons/css/flag-icons.min.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Mail } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

function Navbar() {
    const pathname = usePathname();
    const { t, setLocale, locale } = useI18n();



    const navLinks = [
        { href: "/", icon: <Home size={30} />, label: "Home" },
        { href: "/about", icon: <Info size={30} />, label: "About" },
        { href: "/contact", icon: <Mail size={30} />, label: "Contact" },
    ];

    return (
        <div>
            <div className="flex items-center gap-4 w-full justify-end pr-8">
                <span className="fi fi-tr" onClick={() => setLocale('tr')}></span>
                <span className="fi fi-us" onClick={() => setLocale('en')}></span>
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
                <div className="flex items-center gap-12">
                    <div className="flex max-md:flex-col gap-4 max-md:gap-2 rounded-full text-black bg-white/15 backdrop-blur-lg py-4 px-6 max-md:py-2 max-md:px-3">
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
            </div>
        </div>

    );
}

export default Navbar;
