"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAccountRequest, UpdateAccountResponse } from "@/types/notion";

async function updateAccount(body: UpdateAccountRequest): Promise<UpdateAccountResponse> {
  const res = await fetch("/api/update-account", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to update account");
  }

  return data;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
