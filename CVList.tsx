
import { useState } from 'react';
import { useCV, CVDocument } from '@/contexts/CVContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

const CVList = () => {
  const { cvDocuments, deleteCV } = useCV();
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  const getFileTypeDisplay = (fileType: string) => {
    switch (fileType) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOCX';
      default:
        return 'Document';
    }
  };

  const handleDownload = (cv: CVDocument) => {
    // Create link with base64 data to download
    const link = document.createElement('a');
    link.href = cv.fileContent;
    link.download = cv.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (cvToDelete) {
      deleteCV(cvToDelete);
      setCvToDelete(null);
    }
  };

  if (cvDocuments.length === 0) {
    return (
      <div className="glass-panel p-8 text-center animate-fade-in">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No CVs Found</h3>
        <p className="text-muted-foreground">
          You haven't uploaded any CVs yet. 
          Upload your first CV to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Size</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvDocuments.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{cv.fileName}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{getFileTypeDisplay(cv.fileType)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatFileSize(cv.fileSize)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    {format(new Date(cv.uploadDate), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDownload(cv)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                          onClick={() => setCvToDelete(cv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="futuristic-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete CV</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this CV? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCvToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CVList;
