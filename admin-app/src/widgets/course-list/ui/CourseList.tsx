import { useGetMyCoursesQuery } from "@/entities/course";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import { Link } from "react-router-dom";

export const CourseList = () => {
  const { data: courses, isLoading, error } = useGetMyCoursesQuery();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load courses</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No courses yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first course to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              {!course.isPublished && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Draft
                </span>
              )}
            </div>
            {course.description && (
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {course.isPublished ? "Published" : "Not published"}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to={`/courses/${course.id}`}>Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
