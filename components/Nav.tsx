import {
  CategoriesIcon,
  DashboardIcon,
  LogoutIcon,
  OrdersIcon,
  ProductsIcon,
  SettingsIcon,
} from "./Icons";

import Link from "next/link";
import Logo from "./Logo";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Nav({ show }: { show: boolean }) {
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = `${inactiveLink} bg-white rounded-l-lg text-black text-primary`;
  const { pathname, ...router } = useRouter();

  async function logout() {
    router.push("/");
    await signOut();
  }

  return (
    <aside
      className={`${
        show ? "left-0" : "-left-full"
      } top-0 p-4 pr-0 fixed w-full h-full bg-primary md:static md:w-auto transition-all`}
    >
      <div className="mb-4 mr-4">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2 text-white">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLink : inactiveLink}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </Link>
        <Link
          href={"/products"}
          className={pathname.includes("/products") ? activeLink : inactiveLink}
        >
          <ProductsIcon />
          <span>Products</span>
        </Link>
        <Link
          href={"/categories"}
          className={
            pathname.includes("/categories") ? activeLink : inactiveLink
          }
        >
          <CategoriesIcon />
          <span>Categories</span>
        </Link>
        <Link
          href={"/orders"}
          className={pathname.includes("/orders") ? activeLink : inactiveLink}
        >
          <OrdersIcon />
          <span>Orders</span>
        </Link>
        <Link
          href={"/settings"}
          className={pathname.includes("/settungs") ? activeLink : inactiveLink}
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link>
        <button onClick={logout} className={inactiveLink}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
