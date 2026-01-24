import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem verifying your email or signing you in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            This could happen if the verification link has expired or has
            already been used. Please try signing up again or contact support if
            the problem persists.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/login">Try Logging In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create New Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
