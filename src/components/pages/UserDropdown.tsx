import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store/store"; 
import { logout } from "@/features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const userInitial = currentUser?.user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-10 h-10">
          <AvatarImage src="/profile.jpg" alt="User" />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 bg-white dark:bg-black text-black dark:text-white border shadow-md"
        align="end"
      >
        <DropdownMenuItem onClick={goToDashboard}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
