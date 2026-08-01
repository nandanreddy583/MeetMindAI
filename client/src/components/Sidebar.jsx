import { Home, Upload, FileText, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-10">
        AutoMind AI
      </h1>

      <nav className="space-y-4">

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800">
          <Home size={20} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800">
          <Upload size={20} />
          Upload Meeting
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800">
          <FileText size={20} />
          Meetings
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800">
          <Settings size={20} />
          Settings
        </button>

      </nav>
    </div>
  );
};

export default Sidebar;