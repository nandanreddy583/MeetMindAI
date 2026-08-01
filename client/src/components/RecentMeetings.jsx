import { useEffect, useState } from "react";
import {
  getMeetings,
  deleteMeeting,
} from "../services/meetingService";
import { Link } from "react-router-dom";

const RecentMeetings = ({ refresh, onDelete }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      setLoading(true);

      const data = await getMeetings();

      setMeetings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [refresh]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMeeting(id);

      await loadMeetings();

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete meeting.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        Recent Meetings
      </h2>

      {loading ? (
        <p>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="text-gray-500">
          No meetings uploaded yet.
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Title</th>
              <th className="text-left">Uploaded</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr
                key={meeting._id}
                className="border-b hover:bg-gray-50"
              >
                {/* Clickable Title */}
                <td className="py-4">
                  <Link
                    to={`/meeting/${meeting._id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {meeting.title}
                  </Link>
                </td>

                <td>
                  {new Date(
                    meeting.createdAt
                  ).toLocaleString()}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      meeting.summary
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {meeting.summary
                      ? "Completed"
                      : "Uploaded"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(meeting._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentMeetings;