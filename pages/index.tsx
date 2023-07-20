import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between">
      <h2> Hello, {session?.user?.email}</h2>
      <div className="flex bg-gray-500 text-black gap-1 rounded-lg overflow-hidden">
        <img src={session?.user?.image || ""} alt="" className="h-12 flex-grow sm:w-6 sm:h-6" />
        <span className="px-2">{session?.user?.name}</span>
      </div>
    </div>
  );
}
