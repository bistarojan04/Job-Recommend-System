
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, User } from './AuthContext';

// Define CV document type
export interface CVDocument {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileContent: string;
  uploadDate: string;
}

// Define context type
interface CVContextType {
  cvDocuments: CVDocument[];
  isLoading: boolean;
  uploadCV: (file: File) => Promise<boolean>;
  deleteCV: (id: string) => void;
}

// Create context with default values
const CVContext = createContext<CVContextType>({
  cvDocuments: [],
  isLoading: false,
  uploadCV: async () => false,
  deleteCV: () => {},
});

// Mock database for CV storage (replace with real backend)
const MOCK_CV_DOCUMENTS: Record<string, CVDocument> = {};

// Hook to use CV context
export const useCV = () => useContext(CVContext);

// Provider component
export const CVProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cvDocuments, setCVDocuments] = useState<CVDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's CVs when user changes
  useEffect(() => {
    if (user) {
      // Filter CVs that belong to the current user
      const userCVs = Object.values(MOCK_CV_DOCUMENTS).filter(
        (cv) => cv.userId === user.id
      );
      setCVDocuments(userCVs);
    } else {
      setCVDocuments([]);
    }
  }, [user]);

  // Upload CV function
  const uploadCV = async (file: File): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Check file type
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        throw new Error('Only PDF and DOCX files are allowed.');
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB.');
      }
      
      // Read file as base64
      const base64Content = await readFileAsBase64(file);
      
      // Create new CV document
      const newCV: CVDocument = {
        id: `cv_${Date.now()}`,
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileContent: base64Content,
        uploadDate: new Date().toISOString(),
      };
      
      // Add to mock database
      MOCK_CV_DOCUMENTS[newCV.id] = newCV;
      
      // Update state
      setCVDocuments((prev) => [...prev, newCV]);
      
      return true;
    } catch (error) {
      console.error('CV upload error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete CV function
  const deleteCV = (id: string) => {
    // Remove from mock database
    delete MOCK_CV_DOCUMENTS[id];
    
    // Update state
    setCVDocuments((prev) => prev.filter((cv) => cv.id !== id));
  };

  // Value object to provide
  const value = {
    cvDocuments,
    isLoading,
    uploadCV,
    deleteCV,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

// Helper function to read file as base64
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    reader.readAsDataURL(file);
  });
};

export default CVContext;
