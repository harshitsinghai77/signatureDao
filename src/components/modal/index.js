/** @jsx jsx */
import { Modal, ModalContent, ModalFooter } from "@mattjennings/react-modal";
import { jsx, Text, Button, Box, Grid } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";

const MyModal = (props) => {
  return (
    <Modal {...props} sx={styles.outlined}>
      {({ onClose }) => (
        <Box sx={styles.section}>
          <FontAwesomeIcon
            color="#353448"
            icon={faTimes}
            sx={styles.closeButton}
            onClick={onClose}
            size="lg"
          />
          <FontAwesomeIcon
            color="#353448"
            icon={faPaperPlane}
            sx={styles.transactionIcon}
            size="3x"
          />
          <h2 sx={styles.title}>Transaction Submitted</h2>

          <ModalContent>
            {/*  */}
            <Text sx={styles.subtitle}>
              NFT is being crafted by Oompa-Loompas and will be ready any moment
              now.
            </Text>
            <Grid gap={2} columns={[2, null, 2]} sx={styles.infoGrid}>
              <Box sx={styles.gridLeft}>Minted on</Box>
              <Box sx={styles.gridRight}>Dec 31 2021</Box>
              <Box sx={styles.gridLeft}>Txn Status</Box>
              <Box sx={styles.gridRight}>
                <span sx={styles.pendingText}>
                  PENDING &nbsp;
                  <Loader
                    type="TailSpin"
                    color="#000000"
                    height={14}
                    width={14}
                    sx={styles.inline}
                  />
                </span>
              </Box>
              <Box sx={styles.gridLeft}>Txn Fees</Box>
              <Box sx={styles.gridRight}>$99.9</Box>
            </Grid>
          </ModalContent>
          <ModalFooter>
            <Button
              variant="secondary"
              sx={styles.mainButton}
              onClick={onClose}
            >
              View Transaction in Explorer
            </Button>
          </ModalFooter>
        </Box>
      )}
    </Modal>
  );
};
// 40b53e
export default MyModal;

const styles = {
  infoGrid: {
    mb: "4rem",
    margin: "1em",
    padding: "1em",
  },
  center: {
    display: "block",
    margin: "auto",
  },
  closeButton: {
    float: "right",
    cursor: "pointer",
  },
  transactionIcon: {
    display: "block",
    margin: "auto",
    mt: "0.5em",
  },
  outlined: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "100vh",
    maxWidth: "28rem",
    margin: "auto",
    top: ["25%", "25%", "15%"],
  },
  section: {
    backgroundColor: "primary",
    padding: "2em",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    margin: "1em",
    padding: "1em",
    textAlign: "center",
    fontWeight: "semiBold",
  },
  fullWidth: {
    width: "100%",
  },
  transactionText: {
    fontSize: 2,
    fontWeight: "bold",
    color: "secondary",
  },
  mainButton: {
    display: "block",
    margin: "auto",
    fontWeight: 500,
    mt: "1.5em",
    mb: "2em",
  },
  gridLeft: {
    fontWeight: 600,
    mr: "auto",
  },
  gridRight: {
    ml: "auto",
  },
  inline: {
    display: "inline",
    svg: {
      mb: "-0.1em",
    },
  },
};
