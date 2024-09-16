import React from "react";

export default function ImagePreview({ title, imageURL }: { title: string, imageURL: string | undefined }) {
    if (imageURL) {
        return <img style={{
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            aspectRatio: "16 / 9",
            borderRadius: 20,
        }} src={imageURL}/>
    }

  return (
    <div
      style={{
        backgroundImage: "url(/og-bg.jpg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        aspectRatio: "16 / 9",
        borderRadius: 20,
      }}
      className="hidden md:flex"
    >
      <div
        style={{
          marginLeft: 100,
          marginRight: 50,
          marginTop: 100,
          display: "flex",
          fontWeight: "bold",
          fontSize: 35,
          letterSpacing: "-0.05em",
          color: "#2D3748",
        }}
      >
        {title}
      </div>
    </div>
  );
}
