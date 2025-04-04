
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useJob } from "@/contexts/JobContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const JobCategories = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Customer Support",
  "Other"
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createJob } = useJob();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    category: "",
    description: "",
    requirements: ["", "", ""] // Initialize with 3 empty requirements
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: updatedRequirements }));
  };
  
  const addRequirement = () => {
    setFormData((prev) => ({ 
      ...prev, 
      requirements: [...prev.requirements, ""] 
    }));
  };
  
  const removeRequirement = (index: number) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    setFormData((prev) => ({ ...prev, requirements: updatedRequirements }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.company || !formData.location || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Filter out empty requirements
    const filteredRequirements = formData.requirements.filter(req => req.trim() !== "");
    
    if (filteredRequirements.length === 0) {
      toast.error("Please add at least one job requirement");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await createJob({
        ...formData,
        requirements: filteredRequirements
      });
      
      if (success) {
        toast.success("Job posted successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to create job");
      }
    } catch (error) {
      console.error("Job creation error:", error);
      toast.error("An error occurred while creating the job");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">Create a job listing to find the perfect candidate</p>
      </div>
      
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            New Job Listing
          </CardTitle>
          <CardDescription>Fill in the details about your job opening</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. TechCorp Inc."
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Remote, New York, London"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="e.g. $80,000 - $100,000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {JobCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job role, responsibilities, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="space-y-4 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Requirements <span className="text-destructive">*</span></Label>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                  >
                    Add Requirement
                  </Button>
                </div>
                
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Requirement ${index + 1}`}
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="gradient-button"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
