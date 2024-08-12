import React from "react";

type Props = {
  videoData: any[];
};

const Video = ({ videoData }: Props) => {
  return (
    <div
      style={{
        padding: 20,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        // border: "1px solid black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {videoData.map((video, index) => (
        <div
          key={index}
          style={{
            width: 500,
            display: "flex",
            gap: 20,
            border: " 1px solid black",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <img
            src={video?.thumbnail}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {video?.title}
            </div>
            <div
              style={{
                fontSize: 15,
                color: "gray",
                marginTop: 10,
              }}
            >
              {video?.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Video;
