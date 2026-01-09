import { lazy } from "react";

export const Header = lazy(() =>
  import("./Header").then((module) => ({ default: module.Header }))
);
