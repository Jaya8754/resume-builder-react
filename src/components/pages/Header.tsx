import { useLocation, Link } from "react-router-dom";
import UserDropdown from "@/components/pages/UserDropdown";
import { Button } from "@/components/ui/button";
import ThemeToggle  from "@/components/pages/ThemeToggle";


type HeaderProps = {
  isLoggedIn?: boolean;
};

function Header({ isLoggedIn = false }: HeaderProps) {
  const location = useLocation();

  return (
    <>
    <header className="flex justify-between items-center px-6 py-4 border-b bg-background text-foreground">
      <div className="text-xl text-[#1982C4] font-bold">RESUME BUILDER</div>
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
