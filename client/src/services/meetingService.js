import API from "./api";

const getToken = () => localStorage.getItem("token");

export const getMeetings = async () => {
  const response = await API.get("/meetings", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getStats = async () => {
  const response = await API.get("/meetings/stats", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
export const deleteMeeting = async (id) => {
  const response = await API.delete(`/meetings/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};