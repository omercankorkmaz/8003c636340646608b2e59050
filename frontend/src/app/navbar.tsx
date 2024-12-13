'use client'

import React, { useEffect, useState } from 'react';
import { LoginOutlined, ClearOutlined, FormatPainterOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Button, Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: (
        <Link href="/">Home</Link>
    ),
    key: '/home',
    // icon: <HomeOutlined />,
  },
  {
    label: (
        <Link href="/users">Users</Link>
    ),
    key: '/users',
    // icon: <UserOutlined />,
  },
];

const NavbarMenu: React.FC = () => {
    const pathname = usePathname()
    const [current, setCurrent] = useState(pathname);
    
    const onClick: MenuProps['onClick'] = (e) => setCurrent(e.key);

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ fontSize: 18, fontWeight: 500, }} className='!bg-transparent !border-b-0'/>;
};

const Navbar: React.FC = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const localStorageTheme = localStorage.getItem('theme');
        if (localStorageTheme === 'light') document.documentElement.classList.remove('dark');
        else document.documentElement.classList.add('dark');
        setTheme(localStorage.getItem('theme') ?? 'light');
    }, []);

    const changeTheme = () => {
        document.documentElement.classList.toggle('dark');
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }    

    return (
        <header className="absolute bg-zinc-100 dark:bg-zinc-900 inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between lg:px-8 h-20">
                <div className="flex lg:flex-1">
                    <Image
                        alt="logo"
                        src="next.svg"
                        width={150}
                        height={50}
                    />
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        //   onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* <Bars3Icon aria-hidden="true" className="size-6" /> */}
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <NavbarMenu />
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Tooltip placement="bottom" title={'Change Theme'}>
                        <Button icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />} type="link" size='large' onClick={changeTheme}></Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={'Login'}>
                        <Button icon={<LoginOutlined />} type="link" size='large'></Button>
                    </Tooltip>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;