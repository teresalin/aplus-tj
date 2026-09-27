"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage, type HttpMethod } from "@/lib/api/client";

interface Mutation {
  method: HttpMethod;
  url: string;
  body?: unknown;
  successMessage: string;
}

/**
 * Sends a request to one of the app's route handlers, reports the outcome in
 * the snackbar, and on success re-renders the current page's server data.
 * The returned function resolves to whether the request succeeded.
 */
export function useApiMutation() {
  const router = useRouter();
  const notify = useSnackbar();

  return useCallback(
    async ({ method, url, body, successMessage }: Mutation) => {
      try {
        await apiRequest(url, method, body);
      } catch (error) {
        notify(getErrorMessage(error), "error");
        return false;
      }
      notify(successMessage);
      router.refresh();
      return true;
    },
    [notify, router],
  );
}
