import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const calculateConfettiPieces = (priceValue) => {
  return 10 * priceValue;
};

const ConfettiComponent = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width - 80} height={height * 4} />;
};

export default ConfettiComponent;
