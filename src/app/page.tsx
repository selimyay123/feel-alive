"use client"
import Image from "next/image"
import { useState } from "react"
import { tasks } from "./data/tasks"
import { ClipLoader } from "react-spinners"
import { useI18n } from "@/context/I18nContext"

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<string | null>(null);

  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      const task = tasks[Math.floor(Math.random() * tasks.length)].task;
      setTask(task);
      setLoading(false);
    }, 5000);
  }

  const { t } = useI18n();

  return (
    <div className="flex flex-col items-start mt-4 max-md:mt-0 min-h-screen">

      <h1 className="text-5xl md:text-7xl max-w-full font-semibold text-gradient animate-slide-in-left leading-[1.2] max-md:text-center">
        {t('slogan')}
      </h1>

      <div className="relative w-full min-h-[300px] mt-12 rounded-lg overflow-visible">
        <Image
          src="/blue.jpg"
          alt="blue"
          fill
          className="object-cover rounded-xl opacity-30"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center w-[70%] max-md:w-full mx-auto">

          <div className="flex max-md:flex-col items-center justify-evenly max-md:gap-8">
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t('subSlogan1')}
            </h1>
            <div className="w-px font-bold h-25 bg-white mx-8 max-md:hidden"></div>
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t('subSlogan2')}
            </h1>
          </div>

          {!loading && !task && (
            <button
              className="rounded-full w-[50%] max-md:w-full mx-auto p-4 mt-8 hover-gradient"
              onClick={handleClick}
            >
              {t('start')}
            </button>
          )}
          {loading && (
            <div className="mt-16 flex justify-center items-center w-full">
              <ClipLoader color="#8e44ad" size={50} />
            </div>
          )}

          {task && (
            <div className="mt-16 flex justify-center items-center w-[50%] mx-auto max-md:w-full text-xl italic p-4 backdrop-blur-3xl border-2 border-white rounded-full text-center">
              &quot;{task}&quot;
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
