import React from "react";

interface ReportPopupProps {
  report: string;
  onClose: () => void;
}

const ReportPopup: React.FC<ReportPopupProps> = ({ report, onClose }) => {
  // Split the report into lines based on newline characters.
  const lines = report.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-background"></div>
        <div className="popup-content">
          <button onClick={onClose} className="close-button">
            ×
          </button>
          <h2>DeepSeek Report</h2>
          {lines.map((line, index) => (
            <p
              key={index}
              className="animated-line"
              style={{ animationDelay: `${0.5 + index * 0.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <style jsx>{`
        @font-face {
          font-family: "Geist";
          src: url("https://assets.codepen.io/605876/GeistVF.ttf")
            format("truetype");
        }
        :root {
          --size: 20px;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-container {
          position: relative;
          width: 80%;
          max-width: 1000px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }
        .popup-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: conic-gradient(
            from 180deg at 50% 70%,
            hsla(0, 0%, 98%, 1) 0deg,
            #eec32d 72deg,
            #ec4b4b 144deg,
            #709ab9 216deg,
            #4dffbf 288deg,
            hsla(0, 0%, 98%, 1) 360deg
          );
          mask: radial-gradient(circle at 50% 50%, white 2px, transparent 2.5px)
              50% 50% / var(--size) var(--size),
            url("https://assets.codepen.io/605876/noise-mask.png") 256px 50%
              / 256px 256px;
          mask-composite: intersect;
          animation: flicker 20s infinite linear;
          z-index: 0;
        }
        .popup-content {
          position: relative;
          padding: 2rem;
          background: rgba(26, 26, 26, 0.8);
          border-radius: 10px;
          z-index: 1;
          font-family: Roboto, sans-serif;
          color: #f0f0f0;
          max-height: 80vh;
          overflow-y: auto;
        }
        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          font-size: 1.8rem;
          color: #f0f0f0;
          cursor: pointer;
        }
        h2 {
          font-size: 3rem; /* Increase to your desired size */
          text-align: center;
          margin-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          text-decoration: underline;
        }
        .animated-line {
          margin: 0.6rem 0;
          font-size: 1.2rem;
          opacity: 0;
          animation: slideIn 1s ease forwards;
        }
        @keyframes slideIn {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes flicker {
          to {
            mask-position: 50% 50%, 0 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportPopup;




// import React from "react";

// interface ReportPopupProps {
//   report: string;
//   onClose: () => void;
// }

// const ReportPopup: React.FC<ReportPopupProps> = ({ report, onClose }) => {
//   const lines = report.split("\n").filter((line) => line.trim().length > 0);

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <div className="popup-background"></div>
//         <div className="popup-content">
//           <button onClick={onClose} className="close-button">
//             ×
//           </button>
//           <div className="title-container">
//             <h2 className="title">DeepSeek Report</h2>
//             <img src="/assets/sleeping-cat.gif" alt="sleeping cat" className="sleeping-cat" />
//           </div>
//           {lines.map((line, index) => (
//             <p
//               key={index}
//               className="animated-line"
//               style={{ animationDelay: `${0.5 + index * 0.2}s` }}
//             >
//               {line}
//             </p>
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         @font-face {
//           font-family: "Geist";
//           src: url("https://assets.codepen.io/605876/GeistVF.ttf") format("truetype");
//         }
//         :root {
//           --size: 20px;
//         }
//         .popup-overlay {
//           position: fixed;
//           top: 0; left: 0; right: 0; bottom: 0;
//           background: rgba(0, 0, 0, 0.9);
//           display: flex; justify-content: center; align-items: center;
//           z-index: 1000;
//         }
//         .popup-container {
//           position: relative;
//           width: 80%; max-width: 1000px;
//           border-radius: 10px; overflow: hidden;
//           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
//         }
//         .popup-background {
//           position: absolute; top: 0; left: 0;
//           width: 100%; height: 100%;
//           background: conic-gradient(
//             from 180deg at 50% 70%,
//             hsla(0, 0%, 98%, 1) 0deg,
//             #eec32d 72deg, #ec4b4b 144deg,
//             #709ab9 216deg, #4dffbf 288deg,
//             hsla(0, 0%, 98%, 1) 360deg
//           );
//           mask: radial-gradient(circle at 50% 50%, white 2px, transparent 2.5px)
//               50% 50% / var(--size) var(--size),
//             url("https://assets.codepen.io/605876/noise-mask.png") 256px 50% / 256px 256px;
//           mask-composite: intersect;
//           animation: flicker 20s infinite linear;
//           z-index: 0;
//         }
//         .popup-content {
//           position: relative; padding: 2rem;
//           background: rgba(26, 26, 26, 0.8);
//           border-radius: 10px; z-index: 1;
//           font-family: Roboto, sans-serif;
//           color: #f0f0f0; max-height: 80vh;
//           overflow-y: auto; text-align: center;
//         }
//         .close-button {
//           position: absolute; top: 1rem; right: 1rem;
//           background: transparent; border: none;
//           font-size: 1.8rem; color: #f0f0f0; cursor: pointer;
//         }
//         .title-container {
//           display: flex; flex-direction: column; align-items: center; gap: 5px;
//         }
//         .title {
//           font-size: 3rem;
//           margin-bottom: 0.5rem;
//           text-decoration: none;
//           position: relative;
//         }
//         .title::after {
//           content: '';
//           position: absolute;
//           left: 50%; transform: translateX(-50%);
//           bottom: -8px;
//           width: 120%; /* extended underline */
//           height: 2px;
//           background-color: #fff;
//         }
//         .sleeping-cat {
//           width: 80px; /* Adjust width as needed */
//           margin-top: -10px; /* Adjust vertically as needed */
//         }
//         .animated-line {
//           margin: 0.6rem 0; font-size: 1.2rem;
//           opacity: 0; animation: slideIn 1s ease forwards;
//         }
//         @keyframes slideIn {
//           0% { transform: translateY(100%); opacity: 0; }
//           100% { transform: translateY(0); opacity: 1; }
//         }
//         @keyframes flicker {
//           to { mask-position: 50% 50%, 0 50%; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ReportPopup;
