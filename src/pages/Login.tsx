import { useState } from "react";
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const allowedDomains = [
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@mgit.ac.in',
];

function isAllowedEmail(email: string) {
  return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
}

async function validateEmailWithZeroBounce(email: string) {
  const apiKey = import.meta.env.VITE_ZEROBOUNCE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing ZeroBounce API key. Copy .env.example to .env and add VITE_ZEROBOUNCE_API_KEY.'
    );
  }
  const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
  // Add a timeout to the fetch (10s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error("Email validation failed");
    const data = await response.json();
    // Handle API quota exceeded or other API errors
    if (data.error) throw new Error(data.error);
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Email validation timed out. Please try again.');
    }
    throw err;
  }
}

const Login = () => {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Please enter your full name",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        // Only validate email with ZeroBounce during sign-up
        try {
          const result = await validateEmailWithZeroBounce(email);
          if (
            result.status !== "valid" ||
            result.disposable === true ||
            result.mx_found === false ||
            result.sub_status === "possible_typo" ||
            result.sub_status === "toxic"
          ) {
            toast({
              title: "Invalid Email",
              description: "Please enter a real, non-disposable, non-blacklisted email address.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          toast({
            title: "Email Validation Error",
            description: err.message || "Could not validate your email. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        await signUp(email, password, fullName);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        // No ZeroBounce validation during login
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isSignUp ? 'create account' : 'sign in'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" 
         style={{
           backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('src/A-block-fron-view-scaled.jpg')`,
         }}>
      
      {/* Header */}
      <header className="bg-blue-600 text-white py-8 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MGIT Lost and Found</h1>
          
          {/* MGIT Logo placeholder */}
          <div className="bg-white rounded-lg p-4 inline-block mb-6">
            <img src="/src/components/download.png" alt="MGIT_Official_Logo" ></img>
            {/*  <div className="text-gray-800 font-bold text-lg">
              MAHATMA GANDHI<br />
              INSTITUTE OF TECHNOLOGY
            </div>
            <div className="text-orange-600 text-sm mt-1">
              AUTONOMOUS | Affiliated to JNTUH
            </div>*/}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
              {user ? (
                <>
                  <Link to="/lost-item" className="hover:text-blue-200 transition-colors">Lost an Item</Link>
                  <Link to="/found-item" className="hover:text-blue-200 transition-colors">Found an Item</Link>
                  <Link to="/lost-items" className="hover:text-blue-200 transition-colors">View All Lost Items</Link>
                  <Link to="/found-items" className="hover:text-blue-200 transition-colors">View All Found Items</Link>
                  <Link to="/contact" className="hover:text-blue-200 transition-colors">Contact Us</Link>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-blue-200 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-blue-200 font-semibold">Login</span>
                  <Link to="/lost-items" className="hover:text-blue-200 transition-colors">View All Lost Items</Link>
                  <Link to="/found-items" className="hover:text-blue-200 transition-colors">View All Found Items</Link>
                  <Link to="/contact" className="hover:text-blue-200 transition-colors">Contact Us</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Show user info if logged in, otherwise show login form */}
      {user ? (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="w-full max-w-md bg-green-500 text-white border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">You are successfully logged in.</p>
              <p className="mb-6">Email: {user.email}</p>
              <div className="space-y-4">
                <Link to="/">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Go to Home
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="w-full max-w-md bg-red-500 text-white border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? 'Create Account' : 'Lost And Found Login'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white text-gray-800 placeholder-gray-500"
                      required
                    />
                  </div>
                )}
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-white underline hover:text-red-200"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>&copy; 2025 Lost and Found MGIT</p>
      </footer>
    </div>
  );
};

export default Login;
