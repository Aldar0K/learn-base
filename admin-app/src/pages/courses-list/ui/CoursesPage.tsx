import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SuspenseWrapper,
} from "@/shared/ui";
import { CourseList } from "@/widgets/course-list";
import { Header } from "@/widgets/header";
import { Link } from "react-router-dom";

export const CoursesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper>
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Button asChild>
                <Link to="/courses/create">Create Course</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SuspenseWrapper>
              <CourseList />
            </SuspenseWrapper>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
