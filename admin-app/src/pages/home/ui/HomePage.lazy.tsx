import { lazy } from "react";

export const HomePage = lazy(() =>
  import("./HomePage").then((module) => ({ default: module.HomePage }))
);
