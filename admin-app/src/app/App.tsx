import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/widgets/header";

const App = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="learnbase-admin-theme"
      enableSystem={false}
    >
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 flex">
            <div className="flex-1 flex flex-col justify-center items-center gap-2">
              <h1 className="text-2xl font-bold">LearnBase Admin</h1>
              <p className="text-muted-foreground">
                Welcome to the admin panel
              </p>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
