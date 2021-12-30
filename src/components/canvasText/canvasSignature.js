import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Box, Button } from "theme-ui";

const CanvasSignature = forwardRef(({}, ref) => {
  return (
    <>
      <SignatureCanvas
        ref={ref}
        // dotSize={180}
        penColor="#FFC059"
        backgroundColor="black"
        canvasProps={styles.canvasProps}
      />
      <Box sx={styles.canvasButton}>
        <Button>Trim</Button>
        <Button>Clear</Button>
      </Box>
    </>
  );
});

export default CanvasSignature;

const styles = {
  canvasButton: {
    display: "flex",
    justifyContent: "space-between",
  },
  canvasProps: {
    width: 500,
    height: 300,
  },
};
