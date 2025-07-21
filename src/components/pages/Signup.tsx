import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/HeaderComponents/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validation";
import type { SignupFormType } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup, type SignupData } from "@/hooks/useSignup";

function Signup() {
  const navigate = useNavigate();
  const { mutate, error:signupError } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormType) => {

    const newUser: SignupData = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    mutate(newUser, {
      
      onSuccess: () => {
        navigate("/dashboard");
      }
    })
  };

  return (
    <>
      <Header isLoggedIn={false} />

      <div
        className="flex justify-center items-center min-h-screen pt-20 w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ResumeBuilder.png')" }}
      >
        <Card className="w-full max-w-[400px] shadow-md">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Fill in your details to sign up</CardDescription>
            <CardAction>
              <Link
                to="/login"
                className="font-semibold text-sm underline-offset-4 hover:underline text-foreground transition-all duration-200"
              >
                Login
              </Link>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" {...register("name")} autoComplete="new-password" />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                  {signupError?.errors?.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {signupError.errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <CardFooter className="flex-col gap-2 mt-6 px-0">
                <Button type="submit" variant="skyblue" className="w-full">
                  Sign Up
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Login with Google
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Signup;