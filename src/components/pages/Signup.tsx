import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/pages/Header";
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
import { addRegisteredUser, setCurrentUser } from "@/features/authSlice";
import type { RootState } from "@/store/store";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registeredUsers = useSelector(
    (state: RootState) => state.auth.registeredUsers
  );

  const [emailError, setEmailError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormType) => {
    console.log("Registered users:", registeredUsers);

    const emailExists = registeredUsers.some(
      (user) => user.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      setEmailError("Account already exists. Please login instead.");
      return;
    }

    setEmailError("");

    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
    };

    dispatch(addRegisteredUser(newUser));
    dispatch(setCurrentUser(newUser));
    navigate("/dashboard");
  };

  return (
    <>
      <Header isLoggedIn={false} />

      <div className="flex justify-center items-center min-h-screen w-full">
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
                  {emailError && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {emailError}
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
