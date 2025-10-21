"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type LoginActionState =
  | { success: true; error?: undefined }
  | { error?: string; success?: undefined };

export async function login(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState | never> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }

  // ✅ Redirect on success
  redirect("/dashboard");
}
