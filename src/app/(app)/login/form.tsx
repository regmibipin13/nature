// app/signin/sign-in-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { LoginActionState } from "./action";

function SubmitButton() {
  const formStatus = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={formStatus.pending}
      className="w-full h-11 bg-brand text-black font-medium hover:bg-brand/80"
    >
      {formStatus.pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function SignInForm(props: {
  action: (
    state: LoginActionState,
    formData: FormData
  ) => Promise<LoginActionState>;
}) {
  const actionState = useActionState<LoginActionState, FormData>(props.action, {
    error: undefined,
    success: undefined,
  });

  return (
    <form action={actionState[1]} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="h-11 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm text-brand-dark">
            Remember me
          </Label>
        </div>
      </div>

      {actionState[0]?.error && (
        <p className="text-red-600 text-sm text-center bg-red-50 px-4 py-2 rounded">
          {actionState[0].error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
