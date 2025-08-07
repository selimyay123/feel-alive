"use client";
import { useState } from "react";
import { tasks } from "./data/tasks";
import { ClipLoader } from "react-spinners";

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

  return (
    <div className="h-screen flex flex-col items-start mt-4">
      {/* 
      <h1 className="text-7xl font-semibold text-gradient animate-slide-in-left">
        Break the cycle, now. Feel Alive.
      </h1>
      */}

      <p>test</p>

      {!loading && !task && (
        <button
          className="rounded-full w-[50%] max-md:w-full mx-auto p-4 mt-18 hover-gradient"
          onClick={handleClick}
        >
          Take Action, tell your brain that you are alive.
        </button>
      )}

      {loading && (
        <div className="mt-18 flex justify-center items-center w-full">
          <ClipLoader color="#8e44ad" size={50} />
        </div>
      )}

      {task && (
        <div className="mt-18 flex justify-center items-center w-[50%] mx-auto max-md:w-full text-xl italic p-4 backdrop-blur-3xl border-2 border-white rounded-full text-center">
          &quot;{task}&quot;
        </div>
      )}
    </div>
  );
}
