// app/signin/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

// server action
import { login } from "./action";
import SignInForm from "./form";

export const metadata: Metadata = {
  title: "Sign In | Nature And Nurture Admin",
  description: "Access the admin dashboard by signing into your account.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="MumBuds Logo"
            className="w-40 flex items-center justify-center mx-auto mb-4"
          />
        </div>

        {/* Sign In Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-brand-primary">
              <div>
                <h1 className="text-2xl font-semibold text-brand-primary">
                  Nature And Nurture Admin
                </h1>
              </div>
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              <p className="text-slate-600 mt-1">Sign in to your account</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignInForm action={login} />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2025 Nature And Nurtures. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
