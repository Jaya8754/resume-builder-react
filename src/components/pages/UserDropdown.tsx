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

  function getAvatarColor(initial: string): string {
  const colors: Record<string, string> = {
    A: "bg-red-500",
    B: "bg-orange-500",
    C: "bg-amber-500",
    D: "bg-yellow-500",
    E: "bg-lime-500",
    F: "bg-green-500",
    G: "bg-emerald-500",
    H: "bg-teal-500",
    I: "bg-cyan-500",
    J: "bg-sky-500",
    K: "bg-blue-500",
    L: "bg-indigo-500",
    M: "bg-violet-500",
    N: "bg-purple-500",
    O: "bg-fuchsia-500",
    P: "bg-pink-500",
    Q: "bg-rose-500",
    R: "bg-red-600",
    S: "bg-orange-600",
    T: "bg-yellow-600",
    U: "bg-green-600",
    V: "bg-cyan-600",
    W: "bg-blue-600",
    X: "bg-indigo-600",
    Y: "bg-purple-600",
    Z: "bg-pink-600",
  };

  return colors[initial] || "bg-gray-500";
}

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
          <AvatarFallback className={`text-white ${getAvatarColor(userInitial)}`}>
            {userInitial}
          </AvatarFallback>
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
