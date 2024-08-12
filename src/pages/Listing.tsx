import { useState, useEffect } from "react";
import { Avatar, Button, message } from "antd";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Video {
  videoData: string;
  thumbnail: string;
  title: string;
  description: string;
  createdAt: string;
}

interface User {
  userId: string;
  firstname: string;
  lastname: string;
  thumbnail: string;
  videoArray: Video[];
}

const Listing = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get('http://localhost:8080/api/video/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      message.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 20,
      }}
    >
      <h1
        style={{
          fontSize: 50,
          fontWeight: "bold",
        }}
      >
        Listing
      </h1>
      <Button
        type="primary"
        style={{
          width: "100px",
          position: "absolute",
          right: "50px",
          top: "50px",
        }}
        onClick={() => {
          navigate("/profile");
        }}
      >
        Go to profile
      </Button>

      <div>
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
                borderBottom: "1px solid black",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                {`${user.firstname} ${user.lastname}`}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  border: "2px solid black",
                  padding: 5,
                }}
                onClick={() => {
                  navigate(`${user.userId}`);
                }}
              >
                <Avatar
                  src={`data:image/jpeg;base64,${user.thumbnail}`}
                  style={{
                    width: 70,
                    height: 70,
                    border: "2px solid black",
                  }}
                />
                <div
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    color: "#1890ff",
                  }}
                >
                  View all...
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                border: "1px solid black",
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                padding: 10,
              }}
            >
              {user.videoArray.map((video, index) => (
                <div
                  key={index}
                  style={{
                    width: 400,
                    marginBottom: 20,
                    border: "1px solid black",
                  }}
                >
                  <ReactPlayer
                    playIcon={<button>Play</button>}
                    url={`data:video/mp4;base64,${video.videoData}`}
                    width={400}
                    style={{
                      aspectRatio: "16:9",
                      border: "1px solid black",
                    }}
                  />
                  <div
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {video.title}
                  </div>
                  <div
                    style={{
                      padding: 10,
                      fontSize: 15,
                      color: "gray",
                    }}
                  >
                    {video.description}
                  </div>
                  <div
                    style={{
                      padding: 10,
                      fontSize: 12,
                      color: "gray",
                    }}
                  >
                    Created at: {new Date(video.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listing;
