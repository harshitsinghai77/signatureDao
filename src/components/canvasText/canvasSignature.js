import { forwardRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const CanvasSignature = forwardRef(({}, ref) => {
  return (
    <SignatureCanvas
      ref={ref}
      // dotSize={180}
      penColor="#FFC059"
      backgroundColor="black"
      canvasProps={styles.canvasProps}
    />
  );
});

export default CanvasSignature;

const styles = {
  canvasProps: {
    width: 520,
    height: 400,
  },
};
