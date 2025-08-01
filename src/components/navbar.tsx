"use client";
import Link from "next/link";
import ThemeChanger from "./darkswitch";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  HiAcademicCap,
  HiBell,
  HiMegaphone,
  HiNewspaper,
  HiTag,
} from "react-icons/hi2";

export const Navbar = () => {
  const navigation = [
    { name: "Profil Sekolah", href: "/", logo: <HiAcademicCap /> },
    { name: "Berita", href: "/", logo: <HiNewspaper /> },
    { name: "Akademik & Dokumen", href: "/", logo: <HiTag /> },
    { name: "Kegiatan & Informasi", href: "/", logo: <HiBell /> },
    { name: "PPDB", href: "/", logo: <HiMegaphone /> },
  ];

  return (
    <div className="w-full bg-white dark:bg-blue-950">
      <nav className="container relative flex flex-wrap items-center justify-between p-5 mx-auto lg:justify-between xl:px-1">
        {/* Logo  */}
        <Link href="/">
          <span className="flex items-center  space-x-1 font-medium text-black-500 dark:text-gray-100 ">
            <span className="w-14 aspect-square relative">
              <Image
                src="/img/logo.svg"
                alt="Logo SMA Methodist 1 Palembang"
                fill
                className="object-cover"
              />
            </span>
            <div className="flex flex-col -space-y-1 text-md">
              <span className="font-semibold">SMA METHODIST 1</span>
              <span>PALEMBANG</span>
            </div>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    <span className="mr-1 text-lg">{item.logo}</span>
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium flex items-center"
                  >
                    <span className="mr-1 text-md">{item.logo}</span>
                    {item.name}
                  </Link>
                ))}
                <Link
                  key="daftar"
                  href="/"
                  className="text-sm font-medium flex items-center"
                >
                  Daftar Sekarang!
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <ThemeChanger />
        </div>

        {/* Theme Changer and Get Started */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeChanger />
          <Button asChild>
            <Link href="/">Daftar Sekarang!</Link>
          </Button>
        </div>
      </nav>
    </div>
  );
};
