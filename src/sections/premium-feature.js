/** @jsx jsx */
import { jsx, Box, Container, Grid } from "theme-ui";
import SectionHeading from "components/section-heading";
import Accordion from "components/accordion/accordion";
import Image from "components/image";
import document from "assets/images/document.png";
import emoji from "assets/images/icons/emoji-2.png";

const data = [
  {
    title: "Mint your signature, and own it",
    contents: (
      <div>
        Type a signature or draw it, and claim it to recieve a personalized NFT
        on your address. Use it as your identity, digital signature, or anything
        else you can imagine!
      </div>
    ),
  },
  {
    title:
      "Be part of an exclusive community eligible for airdrops and rewards",
    contents: (
      <div>
        Own a Signature NFT and gain access to a whole world of upcoming
        airdrops, reward NFTs, and much more!
      </div>
    ),
  },
  {
    title: `Be a part of The One Million Signature DAO`,
    contents: (
      <div>
        Be a part of the revolution, get the early mover advantage, and support
        and grow with the best decentralized communities as a core member of the
        incredible One Million Signature DAO.
      </div>
    ),
  },
];

const PremiumFeature = () => {
  return (
    <section id="features" sx={styles.section}>
      <Container>
        <Grid sx={styles.grid}>
          <Box as="figure" sx={styles.illustration}>
            <Image src={document} alt="document" />
          </Box>
          <Box sx={styles.rightContent}>
            <SectionHeading
              emoji={emoji}
              sx={styles.heading}
              title="Claim a spot on the One Million NFT"
              description="Mint your unique Signature NFT and join an incredible community of fellow signers that aim to support the NFT, DeFi and Metaverse communities."
            />
            <Box sx={styles.accordionGroup}>
              <Accordion items={data} />
            </Box>
          </Box>
        </Grid>
      </Container>
    </section>
  );
};

export default PremiumFeature;

const styles = {
  section: {
    pt: [6, null, null, 6, 8, 9],
    pb: [6, null, null, null, 7, 9, 11, null],
  },
  grid: {
    alignItems: "center",
    gridTemplateColumns: [
      "1fr",
      null,
      null,
      null,
      "1fr 431px",
      "1fr 530px",
      "1fr 550px",
    ],
  },
  heading: {
    textAlign: ["left", null, null, "center", "left"],
    ml: [null, null, null, "auto"],
    maxWidth: [null, null, null, 520, 660],
    h2: {
      fontSize: [null, null, null, 10, 8, 10, 40],
      img: {
        maxWidth: [24, null, null, 30, 25, null, "100%"],
        top: ["4px", "8px", null, null, "4px", "8px"],
      },
    },
    p: {
      fontSize: [null, null, null, 2],
    },
  },
  illustration: {
    mb: [-6, null, null, -8, 0],
    // decrease the size of the image
    img: {
      maxWidth: [null, null, null, "100%", "100%", "100%", "100%"],
      maxHeight: [null, null, null, "100%", "100%", "100%", "100%"],
    },
  },
  accordionGroup: {
    m: [null, null, null, "0 auto", "unset"],
    maxWidth: [null, null, null, 600, "none"],
  },
};
