"use client";
import { useI18n } from "@/context/I18nContext";
import Image from "next/image"

function About() {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <h1 className="text-7xl max-md:text-5xl mt-4">
                {t('ourVision')}
            </h1>
            <div className="flex max-md:flex-col items-center gap-4">
                <Image src={"/hero.png"} alt={"hero"} width={300} height={300} className="rounded-lg max-md:w-full" />
                <div className="space-y-4 border border-white/10 backdrop-blur-lg rounded-lg p-4">
                    <p className="font-semibold text-xl">
                        {t('areYouTired')}
                    </p>
                    <p className="text-xl">
                        {t('wakeUp')}
                    </p>
                    <p className="text-xl">
                        {t('thatIsWhy')}
                    </p>
                    <p className="text-xl">
                        {t('doNotWorry')}
                    </p>
                    <p className="text-xl">
                        {t('youAreNotARobot')}
                    </p>
                    <p className="text-xl">
                        {t('youAreAlive')}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default About