import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Upload,
  Input,
  Button,
  Modal,
  message,
  UploadProps,
  GetProp,
} from "antd";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Video from "../components/Video";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [isBioModalVisible, setIsBioModalVisible] = useState(false);
  const [loading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isVideoUploadModalVisible, setIsVideoUploadModalVisible] =
    useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNameData();
    fetchUserVideos();
  }, []);

  const fetchNameData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        "https://video-uploader-api.vercel.app/api/accounts/userdata",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { firstname, lastname, bio, thumbnail } = response.data;
      setFirstName(firstname);
      setLastName(lastname);
      setBio(bio);
      setImageUrl(thumbnail);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data");
    }
  };

  const fetchUserVideos = async () => {
    setIsVideoLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(token);
      if (!token || !userId) {
        throw new Error("No token or userId found");
      }
      const response = await axios.get(
        `https://video-uploader-api.vercel.app/api/video/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      message.error("Failed to fetch user videos");
    } finally {
      setIsVideoLoading(false);
    }
  };


  const handleProfileSubmit = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const formData = new FormData();
      formData.append("bio", bio);
      if (imageUrl) {
        // Convert base64 to file
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        formData.append("thumbnail", blob, "profile_thumbnail.jpg");
      }
      const response = await axios.post(
        "https://video-uploader-api.vercel.app/api/accounts/biothumbnail",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success(response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleVideoSubmit = async () => {
    setVideoLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (video) {
        formData.append("video", video);
      }
      if (thumbnail) {
        // Convert base64 to file
        const response = await fetch(thumbnail);
        const blob = await response.blob();
        formData.append("thumbnail", blob, "video_thumbnail.jpg");
      }
      const response = await axios.post(
        "https://video-uploader-api.vercel.app/api/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      message.success(response.data.message);
      setIsVideoUploadModalVisible(false);
      fetchUserVideos(); // Refresh the video list
      // Reset state
      setTitle("");
      setDescription("");
      setThumbnail(null);
      setVideo(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      message.error("Failed to upload video");
    } finally {
      setVideoLoading(false);
    }
  };

  const handleBioSubmit = () => {
    setIsBioModalVisible(false);
    handleProfileSubmit();
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none", color: "#000" }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("userId"); // Remove the user ID
    navigate("/login"); // Redirect to the login page
    message.success("Logged out successfully"); // Show a success message
  };

  return (
    <Layout>
      <Content
        style={{
          padding: "50px",
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          style={{
            width: "100px",
            position: "absolute",
            right: "200px",
            top: "50px",
          }}
          onClick={() => {
            navigate("/listing");
          }}
        >
          Go to Listing
        </Button>
        <Title level={2}>Upload Data</Title>

        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={(file) => {
            getBase64(file, (url) => {
              setImageUrl(url);
            });
            return false;
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>

        <div style={{ marginTop: 16 }}>
          <Text strong>First Name:</Text> {firstName}
        </div>
        <div>
          <Text strong>Last Name:</Text> {lastName}
        </div>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Text strong>Bio:</Text>
          <div
            style={{
              marginTop: 8,
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
              padding: "4px 11px",
              minHeight: "32px",
              cursor: "pointer",
            }}
            onClick={() => setIsBioModalVisible(true)}
          >
            {bio || "Click to add bio"}
          </div>
        </div>

        <Button
          type="primary"
          style={{
            width: "100px",
          }}
          disabled={profileLoading}
          onClick={handleProfileSubmit}
        >
          {profileLoading ? <LoadingOutlined /> : null}
          Save
        </Button>

        <div
          className="upload-video"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#1890ff",
            marginTop: 16,
          }}
          onClick={() => setIsVideoUploadModalVisible(true)}
        >
          <PlusCircleOutlined /> Upload Video
        </div>
        <Button
          type="default"
          style={{
            width: "100px",
            position: "absolute",
            right: "50px", // Adjust the position as needed
            top: "50px",
          }}
          onClick={handleLogout} // Attach the logout handler
        >
          Logout
        </Button>

        <Modal
          title="Upload Video"
          open={isVideoUploadModalVisible}
          onOk={handleVideoSubmit}
          onCancel={() => setIsVideoUploadModalVisible(false)}
          footer={[
            <Button
              onClick={handleVideoSubmit}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                marginTop: "10px",
              }}
              key="submit"
              disabled={videoLoading}
            >
              {videoLoading ? <LoadingOutlined /> : null}
              Submit
            </Button>,
          ]}
        >
          <div>
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <label htmlFor="description">Description</label>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ marginBottom: 16 }}
            />
            <label htmlFor="thumbnail">Thumbnail</label>
            <Upload
              beforeUpload={(file) => {
                getBase64(file, (url) => {
                  setThumbnail(url);
                });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload thumbnail</Button>
            </Upload>
          </div>
          <label htmlFor="video">Video</label>
          <Upload
            style={{ marginTop: 16 }}
            beforeUpload={(file) => {
              setVideo(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
        </Modal>

        <Modal
          title="Add Bio"
          open={isBioModalVisible}
          footer={[
            <Button
              onClick={handleBioSubmit}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                marginTop: "10px",
              }}
              key="submit"
            >
              Submit
            </Button>,
          ]}
        >
          <TextArea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={150}
            showCount
          />
        </Modal>

        {isVideoLoading ? (
          <div>Loading videos...</div>
        ) : (
          <Video videoData={videoData} />
        )}
      </Content>
    </Layout>
  );
};

export default Profile;
