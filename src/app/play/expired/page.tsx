import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function ExpiredLinkPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-8 w-8" />
            </div>
          <CardTitle className="text-2xl">Link Expired or Invalid</CardTitle>
          <CardDescription>
            This sharing link is no longer active. Links can only be used once. 
            If you believe this is an error, please contact the person who shared the link with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/">Go Home</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
