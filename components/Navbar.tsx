'use client';

import { BellRing, ChartNoAxesCombined, ChartNoAxesGantt, ChevronRight, HomeIcon, MapIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import MobileNav from './MobileNav'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserButton } from './UserButton';
import { Button } from './ui/button';


const Navbar = () => {
  const isLoadingUser = true
  const pathname = usePathname();
  const [activeLink, setActiveLink] = React.useState<string>('');

  const navlinks = [
    {
      label: "Acceuil",
      href: "/",
      icon: HomeIcon,
    },

    {
      label: "Signaler",
      href: "/report",
      icon: HomeIcon,
    },

    {
      label: "Mes signalements",
      href: "/my-reports",
      icon: MapIcon,
    },

    // {
    //   label: "Tableau de bord",
    //   href: "/dashboard",
    //   icon: ChartNoAxesCombined,
    // },

    // {
    //   label: "FAQ",
    //   href: "/faq",
    //   icon: ChartNoAxesGantt,
    // },

    // {
    //   label: "Contacts",
    //   href: "/contacts",
    //   icon: ChartNoAxesCombined,
    // }
  ];

  useEffect(() => {
    const currentPath = pathname;
    const activeNavLink = navlinks.find(link => link.href === currentPath);
    if (activeNavLink) {
      setActiveLink(activeNavLink.href);
    }
  }, [pathname, navlinks]);


  return (
    <nav className="w-full p-2 md:px-[10%] flex items-center justify-between fixed z-5000 top-0 left-0 bg-white dark:bg-zinc-950">
      <Link href="/" className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold flex items-center gap-1">
          <BellRing className='size-5 text-primary dark:text-white'/>
          <span className="text-primary dark:text-white">Vigicité</span>
        </h2>
      </Link>

      <div className="hidden lg:flex items-center gap-4">
        {navlinks.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className={`flex items-center text-sm transition ${item.href === activeLink ? 'font-semibold text-primary' : ''} ${item.href === '#' && isLoadingUser ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-500'
              }`}
          >
            {/* <item.icon className="size-4 mr-1" /> */}
            {item.label}
          </Link>
        ))}
      </div>

      <div className='hidden md:flex items-center gap-2'>
        <UserButton />
        <Button>
          Signaler
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <MobileNav
        navlinks={navlinks}
      />
    </nav>
  );
};

export default Navbar;