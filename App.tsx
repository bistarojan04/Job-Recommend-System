
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CVProvider } from "./contexts/CVContext";
import { JobProvider } from "./contexts/JobContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import JobsPage from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";
import UserProfile from "./pages/UserProfile";
import Applications from "./pages/Applications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CVProvider>
        <JobProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<JobsPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/jobs" element={<Navigate to="/" replace />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/create-job" element={
                    <ProtectedRoute>
                      <CreateJob />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications" element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </JobProvider>
      </CVProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
