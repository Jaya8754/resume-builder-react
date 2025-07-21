import { useLocation, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import ThemeToggle  from "@/components/DarkTheme/ThemeToggle";


type HeaderProps = {
  isLoggedIn?: boolean;
};

function Header({ isLoggedIn = false }: HeaderProps) {
  const location = useLocation();

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 border-b bg-background text-foreground">
      <div className="text-xl text-primary font-bold">RESUME BUILDER</div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {!isLoggedIn && location.pathname === "/login" && (
          <Link to="/signup">
            <Button variant="skyblue">Sign Up</Button>
          </Link>
        )}
        {!isLoggedIn && location.pathname === "/signup" && (
          <Link to="/login">
            <Button variant="skyblue" className ="">Login</Button>
          </Link>
        )}
        {!isLoggedIn && location.pathname === "/" && (
          <>
            <Link to="/login">
              <Button variant="skyblue">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="skyblue">Sign Up</Button>
            </Link>
          </>
        )}
        {isLoggedIn && <UserDropdown />}
      </div>
    </header>
    </>
  );
}

export default Header;
