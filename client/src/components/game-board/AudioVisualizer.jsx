import React from "react";
import "../../styles/visualizer.css";

// material UI
import { Box } from "@mui/material";

const AudioVisualizer = () => {
  const MAX_BAR_HEIGHT = 25;

  //  adds the default spans
  const addBarSpans = () => {
    const bars = document.getElementsByClassName("equalizer-bar");

    let html = "";
    for (let j = 0; j < MAX_BAR_HEIGHT; j++) {
      html += "<span></span>";
    }

    for (let i = 0; i < bars.length; i++) {
      bars[i].innerHTML = html;
    }
  };

  addBarSpans();

  // returns the number of active spans
  const getActiveSpans = (spans) => {
    let counter = 0;

    for (let i = 0; i < spans.length; i++) {
      if (spans[i].style.opacity > 0) counter++;
    }

    return counter;
  };

  // returns a random number between 1 and 20
  const getRandomHeight = (maxBarHeight) => {
    return Math.round(Math.random() * (maxBarHeight - 1)) + 1;
  };

  // main program (repeats)
  const setRandomBars = (maxBarHeight) => {
    const bars = document.getElementsByClassName("equalizer-bar");

    for (let i = 0; i < bars.length; i++) {
      let spans = bars[i].getElementsByTagName("span");
      let activeSpanCount = getActiveSpans(spans);
      let newHeight = getRandomHeight(MAX_BAR_HEIGHT);

      for (let j = 0; j < spans.length; j++) {
        if (newHeight > activeSpanCount) {
          spans[j].style.opacity = "1";
        } else if (j > newHeight) {
          spans[j].style.opacity = "0";
        }

        let upperSpan = MAX_BAR_HEIGHT - j;
        if (newHeight > MAX_BAR_HEIGHT - 5 && upperSpan < 5) {
          spans[j].style.opacity = "0." + upperSpan;
        }
      }
    }
  };

  setInterval(() => {
    setRandomBars(MAX_BAR_HEIGHT);
  }, 200);

  return (
    <Box
      className="equalizer-box"
      sx={{
        height: 200,
        width: 300,
      }}
    >
      <div className="equalizer">
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
        <div className="equalizer-bar">
          <span></span>
        </div>
      </div>
    </Box>
  );
};

export default AudioVisualizer;
