import Button from "components/Button/Button";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import CustomInput from "components/CustomInput/CustomInput";
import withLayout from "components/withLayout/withLayout";
import API from "config/axios";
import { NextRouter, useRouter } from "next/router";
import React, { FormEventHandler, useRef, useState } from "react";
import { getErrorMessage } from "utils/error";
import NextLink from "next/link";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getUserDetailsFromContext } from "utils/utils";

const LoginPage = () => {
  const router: NextRouter = useRouter();
  const [errorText, setErrorText] = useState<string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/users/login", {
        username: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      });
      router.push("/");
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };

  return (
    <div>
      {!!errorText && <ErrorMessage message={errorText} />}
      <div className="flex flex-col gap-4">
        <h1 className="text-center font-semibold text-2xl">Login</h1>
        <form
          onSubmit={handleFormSubmit}
          className="p-6 rounded-md w-full shadow-lg bg-white/60 backdrop-filter backdrop-blur-lg max-w-xl mx-auto flex flex-col gap-4"
        >
          <CustomInput
            ref={emailInputRef}
            type="email"
            label="Username"
            id="username"
            required
          />
          <CustomInput
            ref={passwordInputRef}
            type="password"
            label="Password"
            id="password"
            required
          />
          <Button type="submit" color="blue">
            Login
          </Button>
        </form>
        <p className="font-medium text-lg flex items-center justify-center gap-2 w-full">
          <span>Don't have an account?</span>
          <NextLink href="/users/register" passHref>
            <a className="border-b-2 border-blue-700">Register</a>
          </NextLink>
        </p>
      </div>
    </div>
  );
};

export default withLayout(LoginPage);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const [user] = await getUserDetailsFromContext(ctx);
  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
