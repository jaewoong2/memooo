'use client';

import { atom } from 'jotai';

import { User } from './types';

const defaultUser: User | null = null;

export const userAtom = atom<User | null>(defaultUser);
