import { lazy } from "react";

export const EditCoursePage = lazy(() =>
  import("./EditCoursePage").then((module) => ({
    default: module.EditCoursePage,
  }))
);
