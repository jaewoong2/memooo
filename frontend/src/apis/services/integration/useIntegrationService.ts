import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { DefaultResponse, FcFsError } from "@/lib/type";

import queryOptions from "./queries";
import {
  CreateEventRequest,
  CreateEventResponse,
  GetDatabaseResponse,
  GetDatabaseResponses,
} from "./type";

export const useAddToCalander = (
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<CreateEventResponse | null>,
      FcFsError,
      CreateEventRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    ...queryOptions.addToCalander(),
    ...options,
  });
};

export const useGetDatabases = (
  options?: Omit<
    UseMutationOptions<DefaultResponse<GetDatabaseResponses>, FcFsError, void>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useQuery({
    ...queryOptions.getDatabases(),
    ...options,
  });
};

export const useGetDatabase = (
  id?: string,
  options?: Omit<
    UseMutationOptions<DefaultResponse<GetDatabaseResponse>, FcFsError, void>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useQuery({
    ...queryOptions.getDatabase(id),
    ...options,
  });
};
