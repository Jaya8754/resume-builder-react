import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import type { LoginFormType } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { setCurrentUser } from "@/features/authSlice";
import type { RootState } from "@/store/store";
import Header from "@/components/pages/Header";
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

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registeredUsers = useSelector(
    (state: RootState) => state.auth.registeredUsers
  );

  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormType) => {
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!user) {
      setLoginError("Account does not exist. Please sign up instead.");
      return;
    }

    if (user.password !== data.password) {
      setLoginError("Incorrect password. Please try again.");
      return;
    }

    setLoginError("");
    dispatch(setCurrentUser(user));
    navigate("/dashboard");
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="flex justify-center items-center min-h-screen w-full">
        <Card className="w-full max-w-[400px] shadow-md">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password below to login to your account
            </CardDescription>
            <CardAction>
              <Link
                to="/signup"
                className="font-semibold text-sm underline-offset-4 hover:underline text-foreground transition-all duration-200"
              >
                Sign Up
              </Link>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}
                </div>

                {loginError && (
                  <p className="text-red-600 text-sm font-medium mt-1">{loginError}</p>
                )}
              </div>

              <CardFooter className="flex-col gap-2 mt-6 px-0">
                <Button type="submit" variant="skyblue" className="w-full">
                  Login
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

export default Login;
