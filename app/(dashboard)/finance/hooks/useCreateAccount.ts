"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAccountRequest, CreateAccountResponse } from "@/types/notion";

async function createAccount(body: CreateAccountRequest): Promise<CreateAccountResponse> {
  const res = await fetch("/api/create-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to create account");
  }

  return data;
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
