
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define job types
export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  category: string;
  datePosted: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  cvId: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applicationDate: string;
}

// Define context type
interface JobContextType {
  jobs: Job[];
  userJobs: Job[];
  applications: JobApplication[];
  userApplications: JobApplication[];
  isLoading: boolean;
  createJob: (jobData: Omit<Job, 'id' | 'userId' | 'datePosted'>) => Promise<boolean>;
  applyForJob: (jobId: string, cvId: string, coverLetter?: string) => Promise<boolean>;
  getUserApplicationsForJob: (jobId: string) => JobApplication[];
  deleteJob: (id: string) => void;
  withdrawApplication: (id: string) => void;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => void;
}

// Create context
const JobContext = createContext<JobContextType>({
  jobs: [],
  userJobs: [],
  applications: [],
  userApplications: [],
  isLoading: false,
  createJob: async () => false,
  applyForJob: async () => false,
  getUserApplicationsForJob: () => [],
  deleteJob: () => {},
  withdrawApplication: () => {},
  updateApplicationStatus: () => {},
});

// Hook to use job context
export const useJob = () => useContext(JobContext);

// Provider component
export const JobProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mockJobs, setMockJobs] = useState<Record<string, Job>>({});
  const [mockApplications, setMockApplications] = useState<Record<string, JobApplication>>({});

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedJobs = localStorage.getItem('mock_jobs');
    const savedApplications = localStorage.getItem('mock_applications');
    
    if (savedJobs) {
      setMockJobs(JSON.parse(savedJobs));
    }
    
    if (savedApplications) {
      setMockApplications(JSON.parse(savedApplications));
    }
  }, []);

  // Get all jobs
  const jobs = Object.values(mockJobs);
  
  // Get jobs posted by current user
  const userJobs = user 
    ? jobs.filter(job => job.userId === user.id)
    : [];
  
  // Get all applications
  const applications = Object.values(mockApplications);
  
  // Get applications by current user
  const userApplications = user
    ? applications.filter(app => app.userId === user.id)
    : [];

  // Create a new job
  const createJob = async (jobData: Omit<Job, 'id' | 'userId' | 'datePosted'>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Create new job
      const newJobId = `job_${Date.now()}`;
      const newJob: Job = {
        id: newJobId,
        userId: user.id,
        ...jobData,
        datePosted: new Date().toISOString(),
      };
      
      // Add to mock database
      const updatedJobs = {
        ...mockJobs,
        [newJobId]: newJob
      };
      
      // Update state and localStorage
      setMockJobs(updatedJobs);
      localStorage.setItem('mock_jobs', JSON.stringify(updatedJobs));
      
      return true;
    } catch (error) {
      console.error('Job creation error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Apply for a job
  const applyForJob = async (jobId: string, cvId: string, coverLetter?: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Check if job exists
      if (!mockJobs[jobId]) {
        throw new Error('Job not found');
      }
      
      // Check if user already applied
      const existingApplication = Object.values(mockApplications).find(
        app => app.jobId === jobId && app.userId === user.id
      );
      
      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }
      
      // Create new application
      const newApplicationId = `app_${Date.now()}`;
      const newApplication: JobApplication = {
        id: newApplicationId,
        jobId,
        userId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        cvId,
        coverLetter,
        status: 'pending',
        applicationDate: new Date().toISOString(),
      };
      
      // Add to mock database
      const updatedApplications = {
        ...mockApplications,
        [newApplicationId]: newApplication
      };
      
      // Update state and localStorage
      setMockApplications(updatedApplications);
      localStorage.setItem('mock_applications', JSON.stringify(updatedApplications));
      
      return true;
    } catch (error) {
      console.error('Job application error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get applications for a specific job (for employers)
  const getUserApplicationsForJob = (jobId: string): JobApplication[] => {
    if (!user) return [];
    
    const job = mockJobs[jobId];
    
    // Check if user is the job owner
    if (!job || job.userId !== user.id) {
      return [];
    }
    
    return applications.filter(app => app.jobId === jobId);
  };

  // Delete a job
  const deleteJob = (id: string) => {
    if (!user) return;
    
    const job = mockJobs[id];
    
    // Check if user is the job owner
    if (job && job.userId === user.id) {
      // Delete job
      const updatedJobs = { ...mockJobs };
      delete updatedJobs[id];
      
      // Delete associated applications
      const updatedApplications = { ...mockApplications };
      Object.entries(mockApplications).forEach(([appId, app]) => {
        if (app.jobId === id) {
          delete updatedApplications[appId];
        }
      });
      
      // Update state and localStorage
      setMockJobs(updatedJobs);
      setMockApplications(updatedApplications);
      localStorage.setItem('mock_jobs', JSON.stringify(updatedJobs));
      localStorage.setItem('mock_applications', JSON.stringify(updatedApplications));
    }
  };

  // Withdraw an application
  const withdrawApplication = (id: string) => {
    if (!user) return;
    
    const application = mockApplications[id];
    
    // Check if user is the applicant
    if (application && application.userId === user.id) {
      const updatedApplications = { ...mockApplications };
      delete updatedApplications[id];
      
      // Update state and localStorage
      setMockApplications(updatedApplications);
      localStorage.setItem('mock_applications', JSON.stringify(updatedApplications));
    }
  };

  // Update application status (for employers)
  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    if (!user) return;
    
    const application = mockApplications[id];
    if (!application) return;
    
    const job = mockJobs[application.jobId];
    
    // Check if user is the job owner
    if (job && job.userId === user.id) {
      const updatedApplication = {
        ...application,
        status,
      };
      
      const updatedApplications = {
        ...mockApplications,
        [id]: updatedApplication
      };
      
      // Update state and localStorage
      setMockApplications(updatedApplications);
      localStorage.setItem('mock_applications', JSON.stringify(updatedApplications));
    }
  };

  // Context value
  const value = {
    jobs,
    userJobs,
    applications,
    userApplications,
    isLoading,
    createJob,
    applyForJob,
    getUserApplicationsForJob,
    deleteJob,
    withdrawApplication,
    updateApplicationStatus,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export default JobContext;
