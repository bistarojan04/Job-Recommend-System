
import { Link } from "react-router-dom";
import { Briefcase, Search, FileCheck, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center animate-fade-in">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 neon-highlight">
          Find Your <span className="gradient-text">Future</span> Career
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl text-muted-foreground mb-8">
          Connect with top employers and discover opportunities in the most innovative industries
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild size="lg" className="gradient-button">
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
          <Button asChild size="lg" className="neon-button">
            <Link to={isAuthenticated ? "/create-job" : "/login"}>
              {isAuthenticated ? "Post a Job" : "Join Now"}
            </Link>
          </Button>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="glass-panel p-1 border-white/30 overflow-hidden">
            <div className="bg-background/60 rounded-lg p-6 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Find Jobs</h3>
                  <p className="text-sm text-center text-muted-foreground">Discover opportunities that match your skills and interests</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Apply Simply</h3>
                  <p className="text-sm text-center text-muted-foreground">Quick application process with your stored CV</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Find Talent</h3>
                  <p className="text-sm text-center text-muted-foreground">Employers can post jobs and find the right candidates</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Career Growth</h3>
                  <p className="text-sm text-center text-muted-foreground">Advance your career with top opportunities</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -top-20 -left-20 opacity-40"></div>
          <div className="absolute -z-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -bottom-20 -right-20 opacity-40"></div>
        </div>
      </section>
    </div>
  );
};

export default Index;
