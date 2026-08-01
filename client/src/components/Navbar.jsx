import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow p-5 flex justify-between items-center">

      <div className="flex items-center gap-3 border rounded-lg px-4 py-2 w-96">
        <Search size={18} />
        <input
          className="outline-none w-full"
          placeholder="Search meetings..."
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell />

        <div className="text-right">
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

    </div>
  );
};

export default Navbar;