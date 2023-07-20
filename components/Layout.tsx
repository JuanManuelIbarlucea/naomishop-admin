import { ReactNode, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import { HamburgerIcon } from "./Icons";
import Logo from "./Logo";
import Nav from "@/components/Nav";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className={"bg-primary w-screen h-screen flex items-center"}>
        <div className="text-center w-full">
          <button
            className={"bg-white text-black p-2 px-4 rounded-lg"}
            onClick={() => signIn("google")}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen">
      <div className="md:hidden flex items-center text-white">
        <button onClick={() => setShowNav(!showNav)}>
          <HamburgerIcon />
        </button>
        <div className="flex grow justify-center mr-7">
          <Logo />
        </div>
      </div>
      <div className="bg-primary min-h-screen flex" onClick={() => setShowNav(false)}>
        <Nav show={showNav} />
        <div className="bg-gray-100 flex-grow mt-2 mb-2 rounded-lg p-4 md:mr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
