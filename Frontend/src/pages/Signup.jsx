import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password);
      toast({
        title: "Account Created!",
        description: "Welcome to SentiView.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-1 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">
              Sign up to save your analysis history
            </p>
          </div>

          <div className="glass-card p-6">
            <form onSubmit={handleSubmit} className="space-y-2">
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full bg-white text-black hover:bg-gray-100 
             flex items-center justify-center gap-2
             shadow-none ring-0 focus:ring-0 focus-visible:ring-0
             hover:shadow-none"
                disabled={isLoading}
                onClick={loginWithGoogle}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <img
                      src="/google.svg.png"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Sign up with Google
                  </>
                )}
              </Button>
              <div className="text-center text-muted-foreground text-sm">
                OR
              </div>
              <div className="">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Must be at least 6 characters
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-2 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-2">
            By signing up, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
