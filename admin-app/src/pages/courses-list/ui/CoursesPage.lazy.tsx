import { lazy } from "react";

export const CoursesPage = lazy(() =>
  import("./CoursesPage").then((module) => ({ default: module.CoursesPage }))
);
