import { lazy } from "react";

export const UserList = lazy(() =>
  import("./UserList").then((module) => ({ default: module.UserList }))
);

