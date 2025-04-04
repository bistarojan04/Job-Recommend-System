
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useJob } from "@/contexts/JobContext";
import { useCV } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Calendar, DollarSign, ChevronLeft, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { jobs, applyForJob } = useJob();
  const { cvDocuments } = useCV();

  const [selectedCvId, setSelectedCvId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find job with the given ID
  const job = jobs.find(job => job.id === id);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    if (!selectedCvId) {
      toast.error("Please select a CV to apply with");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await applyForJob(id!, selectedCvId, coverLetter);

      if (success) {
        toast.success("Application submitted successfully");
        navigate("/applications");
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">The job listing you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate("/jobs")}
          className="gradient-button"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const isOwner = user && user.id === job.userId;

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/jobs")} 
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        All Jobs
      </Button>

      <div className="glass-panel p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Posted {new Date(job.datePosted).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {isAuthenticated && !isOwner && (
            <div className="flex justify-start md:justify-end">
              <Button
                onClick={() => {
                  const section = document.getElementById("apply-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="gradient-button"
              >
                <FileText className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
            </div>
          )}
          
          {isOwner && (
            <div className="flex justify-start md:justify-end">
              <Button
                onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                className="gradient-button"
              >
                View Applications
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-4 bg-white/10" />
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            {job.category}
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            {job.salary}
          </Badge>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {isAuthenticated && !isOwner && (
        <Card className="futuristic-card" id="apply-section">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Apply for this position</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select your CV
                </label>
                {cvDocuments.length > 0 ? (
                  <Select
                    value={selectedCvId}
                    onValueChange={(value) => setSelectedCvId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a CV" />
                    </SelectTrigger>
                    <SelectContent>
                      {cvDocuments.map((cv) => (
                        <SelectItem key={cv.id} value={cv.id}>
                          {cv.fileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-4 border border-dashed rounded-md text-center">
                    <p className="text-muted-foreground mb-2">You don't have any CVs uploaded</p>
                    <Button 
                      onClick={() => navigate("/dashboard")} 
                      variant="outline" 
                      size="sm"
                    >
                      Upload CV
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Letter (Optional)
                </label>
                <Textarea
                  placeholder="Tell the employer why you're the perfect fit for this role..."
                  className="min-h-[150px]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              
              <Button
                className="gradient-button w-full sm:w-auto"
                disabled={isSubmitting || !selectedCvId}
                onClick={handleApply}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetails;
