import { CreateCourseForm } from "@/features/create-course";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SuspenseWrapper,
} from "@/shared/ui";
import { Header } from "@/widgets/header";

export const CreateCoursePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper
        fallback={
          <div className="min-h-[72px] flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCourseForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
