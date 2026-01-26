import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  LogOut,
  User,
  History,
  Star,
  LayoutDashboard,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      style={{ borderColor: "hsl(var(--border)/0.5)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-base sm:text-lg font-bold">SentiView</span>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 px-2 sm:px-3"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>

                <div
                  className="flex items-center gap-2 sm:gap-3 pl-2 border-l"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium hidden md:inline">
                      {user?.name}
                    </span>
                  </div>

                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="glow" size="sm" className="px-3 sm:px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
