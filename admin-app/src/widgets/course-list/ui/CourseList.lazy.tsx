import { lazy } from "react";

export const CourseList = lazy(() =>
  import("./CourseList").then((module) => ({ default: module.CourseList }))
);
