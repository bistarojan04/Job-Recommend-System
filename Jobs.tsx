
import { useState, useEffect } from "react";
import { useJob } from "@/contexts/JobContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building, MapPin, DollarSign, Search, Filter } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const JobCategories = [
  "All Categories",
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

const JobsPage = () => {
  const { jobs } = useJob();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [locationFilter, setLocationFilter] = useState("");

  // Update search when URL parameters change
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "All Categories" || job.category === categoryFilter;
    
    const matchesLocation = 
      locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">Browse available job opportunities</p>
      </div>

      {/* Search and filters */}
      <div className="glass-panel p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job titles, keywords..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative md:col-span-3">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-3">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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
            
            <div className="md:col-span-1">
              <Button type="submit" className="gradient-button w-full h-full">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Job listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredJobs.map(job => (
              <Card key={job.id} className="job-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-md">
                      {job.category}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded-md flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {job.location}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded-md flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" /> {job.salary}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    Posted {new Date(job.datePosted).toLocaleDateString()}
                  </span>
                  <Button asChild variant="outline" size="sm" className="neon-button">
                    <Link to={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="futuristic-card">
            <CardContent className="flex flex-col items-center text-center p-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find available opportunities
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("All Categories");
                  setLocationFilter("");
                  setSearchParams({});
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
