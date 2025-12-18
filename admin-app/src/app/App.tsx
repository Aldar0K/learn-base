import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@/providers/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="learnbase-admin-theme">
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">LearnBase Admin</h1>
                <p className="text-muted-foreground">Welcome to the admin panel</p>
              </div>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

