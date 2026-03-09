"use client";

import { useRouter } from "next/navigation";
import { generateTimerId } from "@/lib/timer";

export default function Home() {
  const router = useRouter();

  const handleCreate = () => {
    const id = generateTimerId();
    router.push(`/timer/${id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-white">Workshop Timer</h1>
        <p className="mb-8 text-lg text-slate-400">
          Startup Studio Workshop Timer
        </p>
        <button
          onClick={handleCreate}
          className="rounded-xl bg-blue-600 px-10 py-5 text-2xl font-bold text-white transition-colors hover:bg-blue-500"
        >
          Create Timer
        </button>
      </div>
    </main>
  );
}
