import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMeeting } from "../services/meetingService";
import MeetingChat from "../components/MeetingChat";
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5000");

const MeetingDetails = () => {
  const { id } = useParams();
  console.log("URL ID:", id);

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMeeting = async () => {
    try {
      const data = await getMeeting(id);
      setMeeting(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading meeting...
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        Meeting not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold mt-4">
        {meeting.title}
      </h1>

      <p className="text-gray-500 mt-2">
        Uploaded on{" "}
        {new Date(meeting.createdAt).toLocaleString()}
      </p>

      {/* Audio */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          🎵 Meeting Recording
        </h2>

        <audio controls className="w-full">
          <source
            src={`${API_URL}/uploads/audio/${meeting.filename}`}
            type="audio/mpeg"
          />
          Your browser does not support audio.
        </audio>

      </div>

      {/* Summary */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          🤖 AI Summary
        </h2>

        <p className="leading-8">
          {meeting.summary || "No summary available."}
        </p>

      </div>

      {/* Action Items */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          ✅ Action Items
        </h2>

        {meeting.actionItems.length === 0 ? (
          <p>No action items.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-2">

            {meeting.actionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>
        )}

      </div>

      {/* Key Decisions */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          🎯 Key Decisions
        </h2>

        {meeting.keyDecisions.length === 0 ? (
          <p>No key decisions.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-2">

            {meeting.keyDecisions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>
        )}

      </div>

      {/* Next Steps */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          📌 Next Steps
        </h2>

        {meeting.nextSteps.length === 0 ? (
          <p>No next steps.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-2">

            {meeting.nextSteps.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>
        )}

      </div>

      {/* Transcript */}

      <div className="bg-white rounded-xl shadow p-6 mt-8 mb-10">

        <h2 className="text-2xl font-semibold mb-4">
          📝 Transcript
        </h2>

        <div className="bg-gray-100 rounded-lg p-5 whitespace-pre-wrap leading-8">
          {meeting.transcript}
        </div>

      </div>
        <MeetingChat meetingId={meeting._id} />

    </div>
  );
};

export default MeetingDetails;