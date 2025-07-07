import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import Header from "@/components/pages/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ForgotPassword() {
  return (
    <>
    <Header isLoggedIn={false} />
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-[400px] shadow-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" />
              </div>
              <CardFooter className="px-0">
                <Button type="submit" variant = "skyblue" className="w-full">Send Reset Link</Button>
              </CardFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
export default ForgotPassword;