import { HomeIcon } from "./Icons";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex gap-1 text-white">
      <HomeIcon />
      <span>NaomishopAdmin</span>
    </Link>
  );
}
