import { lazy } from "react";

export const UsersPage = lazy(() =>
  import("./UsersPage").then((module) => ({ default: module.UsersPage }))
);

