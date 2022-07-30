import { keyframes } from "@emotion/react";

// countdown animation
const TrackOutFwdBot = () => {
  return keyframes`
0% {
  -webkit-transform: translateZ(0) translateY(0);
          transform: translateZ(0) translateY(0);
  opacity: 1;
}
60% {
  opacity: 0.8;
}
100% {
  -webkit-transform: translateZ(300px) translateY(200px);
          transform: translateZ(300px) translateY(200px);
  opacity: 0;
}
`;
};

export default TrackOutFwdBot;
