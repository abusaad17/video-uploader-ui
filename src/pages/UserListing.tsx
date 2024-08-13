import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import axios from "axios";
import ReactPlayer from "react-player";

interface VideoData {
  videoUrl: string;
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoBase64: string;
  createdAt: string;
}

const UserListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserVideos();
  }, [id]);

  const fetchUserVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`https://video-uploader-api.onrender.com/api/video/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      message.error("Failed to fetch user videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Videos</h1>
      <Button
        type="primary"
        style={{
          width: "100px",
          position: "absolute",
          right: "50px",
          top: "50px",
        }}
        onClick={() => {
          navigate("/listing");
        }}
      >
        Go to Listing
      </Button>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "20px"
      }}>
        {videoData.map((video) => (
          <div key={video._id} style={{
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <ReactPlayer
              url={video.videoUrl}
              width="100%"
              height="168px"
              controls
            />
            <div style={{ padding: "10px" }}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <p style={{ fontSize: "12px", color: "#888" }}>
                Created: {new Date(video.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListing;