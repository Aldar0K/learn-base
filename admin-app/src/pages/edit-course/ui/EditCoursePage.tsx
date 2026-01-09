import { EditCourseForm } from "@/features/edit-course";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SuspenseWrapper,
} from "@/shared/ui";
import { Header } from "@/widgets/header";
import { useParams } from "react-router-dom";

export const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex min-h-screen flex-col">
        <SuspenseWrapper>
          <Header />
        </SuspenseWrapper>
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-destructive">Course ID is required</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper>
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Course</CardTitle>
          </CardHeader>
          <CardContent>
            <EditCourseForm courseId={id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
