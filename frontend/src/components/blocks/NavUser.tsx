'use client';

import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Interface for menu items
interface MenuItem {
  icon?: React.ReactNode;
  item?: React.ReactNode;
  show?: boolean;
}

// Interface for menu groups
interface MenuGroup {
  items: MenuItem[];
}

// Interface for user data
interface User {
  name: string;
  email: string;
  avatar: string;
}

// Props interface for NavUser component
interface NavUserProps {
  user: User;
  menuGroups: MenuGroup[];
}

export function NavUser({ menuGroups, user }: NavUserProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className='flex'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage
              src={user.avatar ? user.avatar : `${process.env.NEXT_PUBLIC_IMAGE_URL}/images/user.svg`}
              alt={user.name}
            />
            <AvatarFallback className='rounded-lg'>
              <AvatarImage src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/images/user.svg`} alt={user.name} />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-0'
        side={'bottom'}
        align='end'
      >
        <DropdownMenuLabel className='p-1 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage
                src={user.avatar ? user.avatar : `${process.env.NEXT_PUBLIC_IMAGE_URL}/images/user.svg`}
                alt={user.name}
              />
              <AvatarFallback className='rounded-lg'>
                <AvatarImage src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/images/user.svg`} alt={user.name} />
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.name}</span>
              <span className='truncate text-xs'>{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <DropdownMenuSeparator className='bg-neutral-300' />
            <DropdownMenuGroup className='p-1'>
              {group.items.map(({ icon, item, show = true }, itemIndex) => {
                if (!show) return false;
                return (
                  <DropdownMenuItem key={itemIndex}>
                    {icon}
                    {item}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
