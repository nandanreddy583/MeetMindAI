import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import UploadCard from "../components/UploadCard";
import RecentMeetings from "../components/RecentMeetings";
import { getStats } from "../services/meetingService";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  const [stats, setStats] = useState({
    totalMeetings: 0,
    totalSummaries: 0,
    totalActionItems: 0,
  });

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refresh]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Meetings"
              value={stats.totalMeetings}
            />

            <StatsCard
              title="Summaries"
              value={stats.totalSummaries}
            />

            <StatsCard
              title="Action Items"
              value={stats.totalActionItems}
            />
          </div>

          <div className="mt-8">
            <UploadCard
              onUpload={() => setRefresh((prev) => !prev)}
            />
          </div>

          <RecentMeetings
            refresh={refresh}
            onDelete={() => setRefresh((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;