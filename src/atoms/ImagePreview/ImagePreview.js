// import React, { useEffect, useState } from "react";
// import { Modal } from "antd";
// import ReactPlayer from "react-player";
// import crossIcon from "../../assets/images/Frame 48.png";

// const ImagePreview = ({
//   imagePreviewUrl,
//   videoUrl,
//   description,
//   closeImagePreview,
//   isPreviewOpen,
// }) => {
//   const [isVideoEnded, setIsVideoEnded] = useState(false);

//   const handleVideoEnd = () => {
//     setIsVideoEnded(true);
//   };

//   const handlePlayAgain = () => {
//     setIsVideoEnded(false);
//     const videoElement = document.getElementById("video-preview");
//     if (videoElement) {
//       videoElement.play();
//     }
//   };

//   useEffect(() => {
//     if (!imagePreviewUrl && !videoUrl && !description) {
//       closeImagePreview();
//     }
//   }, [imagePreviewUrl, videoUrl, description, closeImagePreview]);

//   return (
//     <Modal
//       width="30%"
//       visible={isPreviewOpen}
//       footer={null}
//       onCancel={closeImagePreview}
//       closeIcon={
//         <img
//           style={{
//             fontSize: "14px",
//             cursor: "pointer",
//             width: "30px",
//             height: "30px",
//             borderRadius: "50%",
//           }}
//           src={crossIcon}
//           alt="cross_icon"
//         />
//       }
//       bodyStyle={{
//         padding: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       style={{ top: 0 }}
//       width="40%"
//       centered
//     >
//       <div
//         style={{
//           maxHeight: "80vh",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           width: "100%",
//           backgroundColor: "white",
//           padding: "20px",
//           borderRadius: "10px",
//         }}
//       >
//         {imagePreviewUrl && (
//           <div
//             style={{ marginBottom: "20px", width: "100%", textAlign: "center" }}
//           >
//             <img
//               src={imagePreviewUrl}
//               alt="Preview"
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: "calc(80vh - 100px)",
//                 height: "auto",
//                 borderRadius: "10px",
//               }}
//             />
//             {description && (
//               <div style={{ marginTop: "10px" }}>
//                 <p style={{ fontSize: "20px", fontWeight: "500" }}>
//                   {description}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//         {videoUrl && (
//           <div
//             style={{
//               marginBottom: "20px",
//               width: "100%",
//               textAlign: "center",
//               borderRadius: "50px",
//             }}
//           >
//             <ReactPlayer
//               id="video-preview"
//               url={videoUrl} // Ensure this is a valid URL
//               controls={!isVideoEnded}
//               playing={!isVideoEnded}
//               onEnded={handleVideoEnd}
//               width="100%"
//               height="calc(80vh - 100px)"
//               style={{
//                 borderRadius: "50px",
//                 paddingRight: "70px",
//                 paddingLeft: "70px",
//               }}
//             />
//             {isVideoEnded && (
//               <button
//                 style={{
//                   marginTop: "10px",
//                   padding: "10px 20px",
//                   fontSize: "16px",
//                   cursor: "pointer",
//                   borderRadius: "5px",
//                 }}
//                 onClick={handlePlayAgain}
//               >
//                 Play Again
//               </button>
//             )}
//             {description && (
//               <div style={{ marginTop: "10px" }}>
//                 <p style={{ fontSize: "20px", fontWeight: "500" }}>
//                   {description}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//         {!imagePreviewUrl && !videoUrl && description && (
//           <div
//             style={{
//               minHeight: "100px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <p style={{ fontSize: "20px", fontWeight: "500" }}>{description}</p>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default ImagePreview;
