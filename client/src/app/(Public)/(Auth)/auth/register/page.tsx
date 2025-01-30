"use client";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/logo";
import AuthBanner from "@/components/PublicComp/Auth/auth-banner";
import { RegisterForm } from "@/components/PublicComp/Auth/register-form";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-myColor1-100 dark:bg-myColor1Dark-100 text-myColor1-200 dark:text-myColor1Dark-200 flex">
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <AuthBanner />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center">
            <Logo />
          </div>

          <RegisterForm />
        </div>
      </div>
      <div className="absolute top-4 right-4 border rounded-lg border-myColor1-600 dark:border-myColor1Dark-400/20 shadow-md dark:shadow-myColor1Dark-400/10">
        <ThemeToggle
          className={{ buttonClass: "dark:text-myColor1Dark-200" }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
