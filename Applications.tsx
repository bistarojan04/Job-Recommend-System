
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useJob } from "@/contexts/JobContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building, FileCheck, FileX } from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";

const Applications = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userApplications, jobs, withdrawApplication } = useJob();
  const { cvDocuments } = useCV();
  const navigate = useNavigate();

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
            <FileCheck className="h-6 w-6 text-white" />
          </div>
          <div className="mt-4 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const handleWithdraw = (applicationId: string) => {
    withdrawApplication(applicationId);
    toast.success("Application withdrawn successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-muted text-muted-foreground">Pending Review</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-600">Reviewed</Badge>;
      case 'accepted':
        return <Badge className="bg-green-600">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive">Not Selected</Badge>;
      default:
        return <Badge className="bg-muted">Unknown</Badge>;
    }
  };

  const getJobDetails = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const getCvFileName = (cvId: string) => {
    const cv = cvDocuments.find(cv => cv.id === cvId);
    return cv ? cv.fileName : 'CV Document';
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track and manage your job applications</p>
      </div>

      {userApplications.length > 0 ? (
        <div className="space-y-6">
          {userApplications.map(application => {
            const job = getJobDetails(application.jobId);
            return (
              <Card key={application.id} className="futuristic-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{job?.title || 'Job Posting'}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {job && (
                          <>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied on {new Date(application.applicationDate).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>{getStatusBadge(application.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-card/50 rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Resume/CV</p>
                          <p className="text-xs text-muted-foreground">{getCvFileName(application.cvId)}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="neon-button">
                        View
                      </Button>
                    </div>
                    
                    {application.coverLetter && (
                      <div>
                        <p className="text-sm font-medium mb-1">Cover Letter</p>
                        <p className="text-sm text-muted-foreground bg-card/50 p-3 rounded-md">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4 flex justify-between">
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm"
                  >
                    <Link to={`/jobs/${application.jobId}`}>View Job</Link>
                  </Button>
                  
                  {application.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWithdraw(application.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <FileX className="h-4 w-4 mr-1" />
                      Withdraw
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="futuristic-card">
          <CardContent className="flex flex-col items-center text-center p-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't applied for any jobs yet. Browse available opportunities to get started.
            </p>
            <Button 
              asChild
              className="gradient-button"
            >
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Applications;
