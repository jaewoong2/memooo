import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSetAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { User } from '@/atoms/types';
import { userAtom } from '@/atoms/userAtom';
import { DefaultResponse } from '@/lib/type';

import queryOptions from './queries';

export function useUserGetMe(options?: Omit<UseQueryOptions<DefaultResponse<User | null>>, 'queryFn' | 'queryKey'>) {
  const result = useQuery({
    ...queryOptions.getMe(),
    ...options,
    retry: 0,
  });

  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    if (result.data?.data?.id) {
      setUser(result.data.data);
    } else {
      setUser(null);
    }
  }, [result, setUser]);

  return result;
}

export function usePostApplyByEmail(redirectUrl?: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: queryOptions.apply().mutationFn,
    onSuccess: async (data) => {
      // Invalidate and refetch relevant queries
      await queryClient.resetQueries({ queryKey: ['user', 'getUser'] });
      router.push(`/login?code=${data?.data?.access_token}&redirectUrl=${redirectUrl ?? pathname}`);
    },
    onError: (error) => {
      console.error('Error registering email:', error);
    },
  });

  return mutation;
}
