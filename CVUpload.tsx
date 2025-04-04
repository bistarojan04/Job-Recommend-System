
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCV } from '@/contexts/CVContext';
import { Upload, FileText, Loader } from 'lucide-react';

const CVUpload = () => {
  const { uploadCV, isLoading } = useCV();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const success = await uploadCV(selectedFile);
      
      if (success) {
        toast.success("CV uploaded successfully!");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error("Failed to upload CV");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <div className="h-16 w-16 rounded-full bg-main-gradient flex items-center justify-center glow">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload Your CV</h3>
        <p className="text-muted-foreground text-center mb-4">
          Upload your CV in PDF or DOCX format (max 5MB)
        </p>
        
        <div className="w-full">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
               onClick={handleButtonClick}>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="mb-1 text-sm">
              <span className="font-semibold">{selectedFile ? selectedFile.name : "Click to upload"}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFile 
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                : "PDF or DOCX up to 5MB"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="gradient-button mt-4 w-full"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>Upload CV</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CVUpload;
