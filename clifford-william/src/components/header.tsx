"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Admin Login", href: "/login" },
  { name: "Admin Dashboard", href: "/dashboard" },
];

const Header = () => {
  const pathName = usePathname();
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        {links.map((link) => {
          const isActive = pathName === link.href;
          return (
            <Link
              className={isActive ? "font-bold" : "text-blue-500"}
              href={link.href}
              key={link.name}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
