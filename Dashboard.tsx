
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import { useCV } from '@/contexts/CVContext';
import CVUpload from '@/components/CVUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Briefcase, Plus, Building, Users } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userJobs, isLoading: jobsLoading } = useJob();
  const { cvDocuments } = useCV();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-main-gradient flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="mt-4 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your job listings and applications</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Your Jobs
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Your CVs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="futuristic-card col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>
                  Your activity summary and quick actions
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-center p-4 rounded-lg bg-card/50">
                  <Briefcase className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">{userJobs.length}</h3>
                  <p className="text-muted-foreground">Posted Jobs</p>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-card/50">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">{cvDocuments.length}</h3>
                  <p className="text-muted-foreground">CV Documents</p>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-card/50">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">0</h3>
                  <p className="text-muted-foreground">Applications</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center sm:justify-end gap-4">
                <Button asChild className="neon-button">
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
                <Button asChild className="gradient-button">
                  <Link to="/create-job">Post a Job</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {userJobs.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Recent Jobs</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {userJobs.slice(0, 3).map(job => (
                  <Card key={job.id} className="job-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company} • {job.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center text-sm">
                        <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{new Date(job.datePosted).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full neon-button">
                        <Link to={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {userJobs.length > 3 && (
                <div className="flex justify-center mt-4">
                  <Button asChild variant="outline">
                    <Link to="/jobs">View All Jobs</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Post your first job listing</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-6">You haven't posted any jobs yet. Create your first job listing to attract talented candidates.</p>
                <Button asChild className="gradient-button">
                  <Link to="/create-job">Post a Job</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Your Job Listings</h2>
              <Button asChild className="gradient-button">
                <Link to="/create-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </Button>
            </div>
            
            {userJobs.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userJobs.map(job => (
                  <Card key={job.id} className="job-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company} • {job.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{new Date(job.datePosted).toLocaleDateString()}</span>
                        </div>
                        <div className="font-medium text-right">{job.salary}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/jobs/${job.id}/applicants`}>View Applicants</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/jobs/${job.id}`}>Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="futuristic-card">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                  <p className="mb-6 text-muted-foreground">Create your first job listing to attract candidates</p>
                  <Button asChild className="gradient-button">
                    <Link to="/create-job">Post Your First Job</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CVUpload />
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Your CV Documents</h2>
              {cvDocuments.length > 0 ? (
                <div className="space-y-4">
                  {cvDocuments.map(doc => (
                    <Card key={doc.id} className="futuristic-card">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.fileName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(doc.uploadDate).toLocaleDateString()} • {Math.round(doc.fileSize / 1024)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="neon-button">
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="futuristic-card">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No CVs uploaded</h3>
                    <p className="mb-4 text-muted-foreground">Upload your CV to apply for jobs</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
