
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Upload, Shield, Database } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Manage Your <span className="gradient-text">Professional Portfolio</span> with Confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Store, manage, and share your professional documents securely with our 
            futuristic CV management platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="gradient-button">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="gradient-button">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Features</span> Designed For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-main-gradient flex items-center justify-center mb-4 glow">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy File Management</h3>
              <p className="text-muted-foreground">
                Upload, store, and organize your CVs, resumes and other documents with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-main-gradient flex items-center justify-center mb-4 glow">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">
                Your documents are encrypted and stored securely, accessible only to you when you need them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-main-gradient flex items-center justify-center mb-4 glow">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized Portfolio</h3>
              <p className="text-muted-foreground">
                Keep all your professional documents in one place, organized and ready to share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-panel p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Streamline Your Document Management?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of professionals who trust our platform for their document management needs.
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" className="gradient-button">
                  Create Your Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
