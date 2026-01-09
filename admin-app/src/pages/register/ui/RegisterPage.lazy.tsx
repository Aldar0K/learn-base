import { lazy } from "react";

export const RegisterPage = lazy(() =>
  import("./RegisterPage").then((module) => ({ default: module.RegisterPage }))
);
