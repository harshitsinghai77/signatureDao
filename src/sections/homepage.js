/** @jsx jsx */
import { useState, useEffect, useContext, useRef } from "react";
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
import { ethers } from "ethers";

import CanvasText from "components/canvasText/CanvasText";
import CanvasSignature from "components/canvasText/canvasSignature";
import Modal from "components/modal/";
import ConfettiComponent from "components/confetti/";

import { getContract } from "utils/getContact";
import {
  exportSignatureAsSVG,
  exportSignatureAsPNG,
  convertToBuffer,
  addDataToIPFS,
  createNFTMeta,
} from "utils/signature";
import { Web3CreateContext } from "contexts/web3-context";
import { defaultProvider } from "utils/web3connect";
import { TRANSACTION_LINK } from "utils/constants";

import paypal from "assets/images/paypal.png";
import google from "assets/images/google.png";
import dropbox from "assets/images/dropbox.png";

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

// if true then use canvas to create singature else create and use SVG as an NFT
const enableCanvasSignature = false;

const HomePage = () => {
  const { state } = useContext(Web3CreateContext);
  const { address, web3Provider } = state;

  const textCanvasRef = useRef();
  const handwrittenCanvasRef = useRef();

  const [signature, setSignature] = useState("");
  const [randomName, setRandomName] = useState("");
  const [isEligibleToMint, setIsEligibleToMint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEligibleToDiscount, setIsEligibleToDiscount] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [toggleHandSignature, setToggleHandSignature] = useState(false);
  const [txn, setTxn] = useState();
  const [openModal, setOpenModal] = useState(false);

  const onChangeSignature = (event) => {
    const signature = event.target.value;
    let price;
    if (isEligibleToDiscount) {
      price = signature.length * 0.01;
    } else {
      price = signature.length * 0.02;
    }

    setSignature(signature);
    setTotalPrice(price.toFixed(3));
  };

  const getSignature = async () => {
    let signatureNFT;
    if (toggleHandSignature) {
      // HandwrittenSignature
      const base64EncodedImage = getHandwrittenCanvasSignature();
      signatureNFT = await exportSignatureAsPNG(base64EncodedImage);
    } else if (enableCanvasSignature) {
      // Export text signature from canvas as png
      const base64EncodedImage = getTextCanvasSignature();
      signatureNFT = await exportSignatureAsPNG(base64EncodedImage);
    } else {
      // Export tex signature as SVG
      const signatureSVG = exportSignatureAsSVG(signature);
      signatureNFT = await convertToBuffer(signatureSVG);
    }
    return signatureNFT;
  };

  const onClaimNFT = async (e) => {
    e.preventDefault();
    if (!signature || !web3Provider) return;

    const signatureNFT = await getSignature();
    if (!signatureNFT) return;

    // Add signature to IPFS
    const imghash = await addDataToIPFS(signatureNFT);

    // // Create NFT metadata and add it to IPFS
    const nftMetadata = createNFTMeta(imghash, signature);
    const ipfsNFTMetadata = await addDataToIPFS(nftMetadata);

    const signer = web3Provider.getSigner();
    const contract = getContract(signer);
    const mintValue = totalPrice * 10 ** 18;
    const nftTxn = await contract._mint(
      signature.length,
      signature,
      `ipfs://${ipfsNFTMetadata}`,
      {
        value: ethers.BigNumber.from(mintValue.toString()),
        gasLimit: 6000000,
      }
    );
    setTxn({
      mintedOn: new Date().toDateString(),
      txnStatus: "PENDING",
      txnValue: mintValue,
      txnHash: nftTxn.hash,
      txnLink: TRANSACTION_LINK + nftTxn.hash,
    });
    setOpenModal(true);
    await nftTxn.wait();
    await getTransactionReceipt(nftTxn.hash);
  };

  const getTransactionReceipt = async (txnHash) => {
    const txReceipt = await web3Provider.getTransactionReceipt(txnHash);
    // The status of a transaction is 1 is successful or 0 if it was reverted.
    // The block hash of the block that this transaction was included in.
    if (txReceipt && txReceipt.blockNumber && txReceipt.status) {
      setTxn((prevPerson) => ({
        ...prevPerson,
        txnStatus: "CONFIRMED",
        gasUsed: txReceipt.gasUsed.toString(), //The amount of gas actually used by this transaction.
      }));
      return;
    }
    setTxn((prevPerson) => ({
      ...prevPerson,
      txnStatus: "REVERTED",
    }));
  };

  const testModal = async () => {
    const txnHash =
      "0x6c8ee629793671f46cab0d5571560e3f2716b6ab520fbc7994c9da3c446d9f15";
    setTxn({
      mintedOn: new Date().toDateString(),
      txnStatus: "PENDING",
      txnValue: 1000,
      txnHash: txnHash,
      txnLink: TRANSACTION_LINK + txnHash,
    });
    setOpenModal(true);

    let timer = setTimeout(async () => {
      await getTransactionReceipt(txnHash);
    }, 5000);
    // clearTimeout(timer);
  };

  // Create a function to get random names using API call
  const getRandomName = async () => {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    setRandomName(data.results[0].name.first + " " + data.results[0].name.last);
  };

  const getUserInformation = async () => {
    const contract = getContract(defaultProvider);
    const isEligibleToMint = await contract.addressToSignature(address);
    const isEligibleToDiscount = await contract.checkElegibleMember(address);
    console.log(
      "isEligibleToMint",
      isEligibleToMint.toString(),
      typeof isEligibleToMint
    );
    if (isEligibleToMint.toString() === "0") {
      setIsEligibleToMint(true);
    } else {
      // User has already minted the token
      console.log("User has already minted the token");
      setShowConfetti(true);
    }
    console.log(
      "isEligibleToDiscount",
      isEligibleToDiscount,
      typeof isEligibleToDiscount
    );
    setIsEligibleToDiscount(isEligibleToDiscount);
  };

  const renderTextSignature = () => {
    if (enableCanvasSignature) {
      return (
        <CanvasText changeText={signature || randomName} ref={textCanvasRef} />
      );
    }
    return <h1 sx={styles.signatureText}>{signature || randomName}</h1>;
  };

  const getTextCanvasSignature = () => {
    if (!textCanvasRef.current) return;
    const textCanvasSignature = textCanvasRef.current.toDataURL("image/png");
    return textCanvasSignature;
  };

  const getHandwrittenCanvasSignature = () => {
    if (!handwrittenCanvasRef.current) return;
    const handwrittenSignature =
      handwrittenCanvasRef.current.toDataURL("image/png");
    return handwrittenSignature;
  };

  const clearHandwrittenCanvasSignature = () => {
    if (!handwrittenCanvasRef.current) return;
    handwrittenCanvasRef.current.clear();
  };

  const onCloseModal = () => {
    setOpenModal((prevState) => !prevState);
  };

  useEffect(() => {
    if (!address) return;
    getUserInformation();
  }, [address]);

  useEffect(() => {
    getRandomName();
  }, []);

  return (
    <>
      <Box as="section" id="home" sx={(styles.section, styles.random)}>
        {txn && <Modal open={openModal} txn={txn} onClose={onCloseModal} />}
        <Container>
          {/* {showConfetti && <ConfettiComponent />} */}
          <Box sx={styles.contentWrapper}>
            <Box sx={styles.bannerContent}>
              <Heading as="h1">Get Your Own Personalized NFT Signature</Heading>
              <Text as="p">
                Get your tests delivered at let home collect sample from the
                victory of the managements that supplies best design system
                guidelines ever.
              </Text>
              <Flex as="form" sx={styles.signatureForm}>
                <Input
                  type="text"
                  placeholder="Enter Your Signature"
                  value={signature || ""}
                  onChange={onChangeSignature}
                />
                <Button onClick={onClaimNFT}>Claim NFT</Button>
              </Flex>

              <Button
                onClick={() =>
                  setToggleHandSignature((prevState) => !prevState)
                }
                variant="secondary"
              >
                {toggleHandSignature
                  ? "Type your signature "
                  : "Get your own custom handwritten signature"}
              </Button>

              <Button onClick={testModal}>TesModal</Button>

              <Flex as="form" sx={(styles.form, styles.signatureForm)}>
                <Text as="p">
                  <strong>
                    {isEligibleToDiscount
                      ? "Elegible for a discount"
                      : "Not elegible for a discount "}
                  </strong>
                  &nbsp;
                </Text>
                <Text as="p">MATIC to pay : {totalPrice}</Text>
              </Flex>
            </Box>
            <Flex as="figure" sx={styles.bannerImage}>
              {toggleHandSignature ? (
                <CanvasSignature ref={handwrittenCanvasRef} />
              ) : (
                renderTextSignature()
              )}
            </Flex>
            {/* <Button onClick={handwrittenCanvasSignature}>Trim</Button> */}
            <Button onClick={clearHandwrittenCanvasSignature}>Clear</Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;

// boxShadow: "inset 0px 0px 0 2000px rgba(0,0,0,0.5)",
// rgba(0, 0, 0, 0.5)

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
      m: [0, null, null, "0 auto", 0],
    },
    backgroundColor: "black",
    borderRadius: "1.25rem",
    height: "400px",
  },
};
