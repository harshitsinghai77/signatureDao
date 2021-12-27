/** @jsx jsx */
import { useState } from "react";
import {
  jsx,
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Input,
  Button,
} from "theme-ui";
import { rgba } from "polished";
import Image from "components/image";
import illustration from "assets/images/banner.png";
import paypal from "assets/images/paypal.png";
import google from "assets/images/google.png";
import dropbox from "assets/images/dropbox.png";
import {
  createSvgFromSignature,
  convertToBuffer,
  addDataToIPFS,
  createNFTMeta,
} from "utils/signature";

const logos = [
  {
    name: "Paypal",
    src: paypal,
  },
  {
    name: "Google",
    src: google,
  },
  {
    name: "Dropbox",
    src: dropbox,
  },
];

const Banner = () => {
  const [signature, setSignature] = useState("Your Signature");

  const onClaimNFT = async (e) => {
    e.preventDefault();
    if (!signature) return;

    // // Create SVG image and add it to IPFS
    const imgSVG = createSvgFromSignature(signature);
    const svgImg = await convertToBuffer(imgSVG);
    const imghash = await addDataToIPFS(svgImg);

    // // Create NFT metadata and add it to IPFS
    const nftMetadata = createNFTMeta(imghash, signature);
    const ipfsNFTMetaData = await addDataToIPFS(nftMetadata);
    console.log("ipfsNFTMetaData: ", ipfsNFTMetaData);
  };

  return (
    <Box as="section" id="home" sx={styles.section}>
      <Container>
        <Box sx={styles.contentWrapper}>
          <Box sx={styles.bannerContent}>
            <Heading as="h1">Get Your Own Personalized NFT Signature</Heading>
            <Text as="p">
              Get your tests delivered at let home collect sample from the
              victory of the managements that supplies best design system
              guidelines ever.
            </Text>
            <Flex as="form" sx={(styles.form, styles.signatureForm)}>
              <Input
                type="text"
                placeholder="Enter Your Signature"
                value={signature || ""}
                onChange={(event) => setSignature(event.target.value)}
              />
              <Button onClick={onClaimNFT}>Claim NFT</Button>
            </Flex>

            <Flex sx={styles.sponsoredBy}>
              <Text as="span">Sponsored by:</Text>
              <Flex sx={styles.sponsor}>
                {logos?.map((logo, index) => (
                  <Flex as="figure" key={index}>
                    <Image src={logo.src} alt={logo.name} />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Box>
          <Flex as="figure" sx={styles.bannerImage}>
            <h1 sx={styles.signatureText}>{signature}</h1>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;

const styles = {
  section: {
    backgroundColor: "#FFFCF7",
    pt: [14, null, null, null, null, 0],
    pb: [6, null, null, 7, 11, 0],
  },
  contentWrapper: {
    gap: ["50px 50px"],
    display: ["block", null, null, null, "grid"],
    gridTemplateColumns: [null, null, null, null, "1fr 1fr", "0.95fr 1.05fr"],
    alignItems: "center",
    minHeight: ["auto", null, null, null, "38vh", "80vh"],
    pt: [null, null, null, 8, 0, 9, null],
    "@media only screen and (min-width:1900px)": {
      pt: 10,
    },
  },
  bannerContent: {
    margin: [null, null, null, "0 auto", 0],
    maxWidth: [null, null, null, 600, "none"],
    textAlign: [null, null, null, "center", "left"],
    h1: {
      fontWeight: 700,
      fontSize: [8, null, null, 10, 45, null, 12, 14],
      lineHeight: [1.26, null, null, 1.5, 1.2, 1.26],
      letterSpacing: [0, null, null, null, "-1.5px"],
      color: "textSecondary",
      "@media screen and (min-width: 1441px) and (max-width:1600px)": {
        fontSize: 12,
        lineHeight: 1.5,
      },
    },
    p: {
      fontSize: [1, null, null, 2, 3],
      lineHeight: [1.5, null, null, 2, null, 2.33],
      color: "textSecondary",
      maxWidth: [470],
      m: [null, null, null, "30px auto", 0],
      mt: [3, null, null, null, 5],
    },
  },
  signatureForm: {
    maxWidth: [null, null, null, 470, "none"],
    m: [null, null, null, "30px auto", "30px 0 0"],
    mt: [6],
    input: {
      backgroundColor: "#FFFFFF",
      border: "0 none",
      fontFamily: "body",
      fontSize: [1, null, null, null, 2],
      px: [5],
      boxShadow: "0px 16px 40px rgba(72, 59, 26, 0.08)",
      minHeight: [40, 50, null, null, null, 60],
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      "::placeholder": {
        color: rgba("#02073E", 0.4),
        opacity: 1 /* Firefox */,
      },
    },
    button: {
      fontSize: [0, 1, null, null, 2],
      minHeight: [40, 50, null, null, null, 60],
    },
  },
  sponsoredBy: {
    alignItems: "center",
    maxWidth: [null, null, null, 470, "none"],
    m: [null, null, null, "30px auto", "30px 0 0"],
    mt: [6],
    span: {
      fontSize: ["13px", null, null, null, 2],
      lineHeight: 2.62,
      color: rgba("#566272", 0.6),
    },
  },
  sponsor: {
    alignItems: "center",
    figure: {
      ml: [2, null, null, null, 4, 5],
      img: {
        maxWidth: ["60px", null, null, null, "80px", "100%"],
      },
    },
  },
  signatureText: {
    fontFamily: "Gochi Hand, cursive",
    fontSize: [38, null, null, null, 38],
    color: "primary",
  },
  bannerImage: {
    alignItems: "center",
    justifyContent: "center",
    mt: [0, null, null, null, 0],
    img: {
      maxWidth: [null, null, null, "80%", "100%"],
      m: [null, null, null, "0 auto", 0],
    },
    backgroundColor: "black",
    borderRadius: "1.25rem",
    height: "400px",
  },
};
