/** @jsx jsx */
import { jsx, Box, Container } from "theme-ui";
import { useState, useEffect } from "react";

import SectionHeading from "components/section-heading";
import { getContract } from "utils/getContact";
import { defaultProvider } from "utils/web3connect";
import emoji from "assets/images/icons/emoji.png";

const AvailableTotalSize = () => {
  const [availableSize, setAvailableSize] = useState(0);
  // const [maxSize, setMaxSize] = useState(0);

  const fetchAvaialbleSize = async () => {
    const contract = getContract(defaultProvider);
    const availableSize = await contract.availableSize();
    // const maxSize = await contract.maxSize();

    setAvailableSize(availableSize.toString());
    // setMaxSize(maxSize.toString());
  };

  useEffect(() => {
    fetchAvaialbleSize();
  }, []);

  return (
    <Box as="section" sx={styles.section}>
      <Container>
        <SectionHeading
          emoji={emoji}
          sx={styles.heading}
          title={`Only ${availableSize} pixels left...`}
          description="Hurry up and mint your own signature NFT, and be a part of the One Million Signature DAO.
          Signature size is calculated as the total number of characters used by all the the minted signatures,
          so expect it to run out fast!"
        />
      </Container>
    </Box>
  );
};

export default AvailableTotalSize;

const styles = {
  section: {
    backgroundColor: "#FFFCF7",
    pt: [9, null, null, null, 10, 13, null],
    pb: [9, null, null, null, 11, 14, null],
  },
  heading: {
    mb: [7, null, null, 8, 9, 10],
    h2: {
      color: "secondary",
      fontSize: [6, null, null, 8],
    },
    p: {
      color: "#858B91",
      fontSize: [2, null, null, 3],
      m: ["15px auto 0", null, null, "10px auto 0"],
    },
  },
};
