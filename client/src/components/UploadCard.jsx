import { useState } from "react";
import API from "../services/api";

const UploadCard = ({ onUpload }) => {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);

  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Please enter a meeting title");
      return;
    }

    if (!audio) {
      alert("Please select an audio file");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("audio", audio);

    try {
      await API.post("/meetings/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Meeting Uploaded!");

      // Clear form
      setTitle("");
      setAudio(null);

      // Refresh meeting list
      if (onUpload) {
        onUpload();
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Upload failed"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h2 className="text-2xl font-bold mb-6">
        Upload Meeting
      </h2>

      <input
        type="text"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-3 rounded w-full mb-4"
      />

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files[0])}
        className="mb-6"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Upload Meeting
      </button>

    </div>
  );
};

export default UploadCard;