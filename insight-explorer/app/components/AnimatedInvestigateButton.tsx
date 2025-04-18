"use client";

import React, { useState } from "react";

interface AnimatedInvestigateButtonCreativeProps {
  a?: string;
  onClick: () => void;
}

export default function AnimatedInvestigateButtonCreative({
  onClick, a
}: AnimatedInvestigateButtonCreativeProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick();
    setTimeout(() => setClicked(false), 800);
  };


  return (

    <button
      type="button"
      onClick={handleClick}
      className={`glow-on-hover ${clicked ? "clicked" : ""}`}
    >
      DeepSeek Insights
      <style jsx>{`
        .glow-on-hover {
          width: 220px;
          height: 50px;
          border: none;
          outline: none;
          color: #fff;
          background: #111;
          cursor: pointer;
          position: relative;
          z-index: 0;
          text-transform: uppercase;
          border-radius: 10px;
          font-family: sans-serif;
          font-size: 16px;
          font-weight: bold;
        }
        /* Always-on glowing effect */
        .glow-on-hover:before {
          content: "";
          background: linear-gradient(
            45deg,
            #ff0000,
            #ff7300,
            #fffb00,
            #48ff00,
            #00ffd5,
            #002bff,
            #7a00ff,
            #ff00c8,
            #ff0000
          );
          position: absolute;
          top: -2px;
          left: -2px;
          background-size: 400%;
          z-index: -1;
          filter: blur(5px);
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          animation: glowing 20s linear infinite;
          opacity: 1; /* Always visible */
          transition: opacity 0.3s ease-in-out;
          border-radius: 10px;
        }
        /* On hover, we simply maintain the glow (or you could tweak it further if desired) */
        .glow-on-hover:hover:before {
          opacity: 1;
        }
        .glow-on-hover:after {
          z-index: -1;
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: #111;
          left: 0;
          top: 0;
          border-radius: 10px;
        }
        .glow-on-hover:active {
          color: #000;
        }
        .glow-on-hover:active:after {
          background: transparent;
        }
        .glow-on-hover.clicked {
          color: #000;
        }
        .glow-on-hover.clicked:after {
          background: transparent;
        }
        @keyframes glowing {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
      `}</style>
    </button>

  );
}

