import { lazy } from "react";

export const CreateCoursePage = lazy(() =>
  import("./CreateCoursePage").then((module) => ({
    default: module.CreateCoursePage,
  }))
);
