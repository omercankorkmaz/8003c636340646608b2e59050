'use client';

import { useState, FC } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link href="/">Home</Link>,
    key: '/home',
  },
  {
    label: <Link href="/users">Users</Link>,
    key: '/users',
  },
];

const NavbarMenu: FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);

  const onClick: MenuProps['onClick'] = (e) => setCurrent(e.key);

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={{ fontSize: 18, fontWeight: 500 }}
      className="!bg-transparent !border-b-0"
    />
  );
};

const Navbar: FC = () => {
  return (
    <header className="absolute bg-zinc-100 inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between px-8 h-20">
        <div className="flex flex-1">
          <Image alt="logo" src="next.svg" width={150} height={50} />
        </div>
        <div className="flex lg:gap-x-12">
          <NavbarMenu />
        </div>
        <div className="flex flex-1 justify-end">
          {/* <Tooltip placement="bottom" title={'Login'}>
                        <Button icon={<LoginOutlined />} type="link" size='large'></Button>
                    </Tooltip> */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
