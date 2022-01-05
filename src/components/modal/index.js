/** @jsx jsx */
import { Modal, ModalContent, ModalFooter } from "@mattjennings/react-modal";
import { jsx, Text, Button, Box, Grid } from "theme-ui";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";

import { txnStatusType } from "../../sections/homepage";

const MyModal = ({ open, txn, onClose }) => {
  const { mintedOn, txnStatus, txnValue, txnLink, gasUsed } = txn;
  return (
    <Modal open={open} sx={styles.outlined}>
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
          <Text sx={styles.subtitle}>
            NFT is being crafted by Oompa-Loompas and will be ready any moment
            now.
          </Text>
          <Grid gap={2} columns={[2, null, 2]} sx={styles.infoGrid}>
            <Box sx={styles.gridLeft}>Minted on</Box>
            <Box sx={styles.gridRight}>{mintedOn}</Box>
            <Box sx={styles.gridLeft}>Txn Status</Box>
            <Box sx={styles.gridRight}>
              <span sx={styles.pendingText}>
                {txnStatus} &nbsp;
                {txnStatus === txnStatusType.PENDING && (
                  <Loader
                    type="TailSpin"
                    color="#000000"
                    height={14}
                    width={14}
                    sx={styles.inline}
                  />
                )}
              </span>
            </Box>
            <Box sx={styles.gridLeft}>Txn Fees</Box>
            <Box sx={styles.gridRight}>
              {ethers.utils.formatEther(txnValue)} MATIC
            </Box>
            {gasUsed && (
              <>
                <Box sx={styles.gridLeft}>Gas Used</Box>
                <Box sx={styles.gridRight}>{gasUsed}</Box>
              </>
            )}
          </Grid>
        </ModalContent>
        <ModalFooter>
          <a href={txnLink} target="_blank">
            <Button variant="secondary" sx={styles.mainButton}>
              View Transaction in Explorer
            </Button>
          </a>
        </ModalFooter>
      </Box>
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

    a: {
      textDecoration: "none",
    },
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    margin: "1em",
    padding: "1em",
    textAlign: "center",
    fontWeight: "bold",
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
