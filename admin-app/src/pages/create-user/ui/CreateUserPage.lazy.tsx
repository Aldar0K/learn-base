import { lazy } from "react";

export const CreateUserPage = lazy(() =>
  import("./CreateUserPage").then((module) => ({ default: module.CreateUserPage }))
);

