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
  Image,
} from "theme-ui";
import { rgba } from "polished";
import { ethers } from "ethers";
import Loader from "react-loader-spinner";

import CanvasText from "components/canvasText/CanvasText";
import CanvasSignature from "components/canvasText/canvasSignature";
import Modal from "components/modal/";
import ConfettiComponent from "components/confetti/";
import RadioSelect from "components/radio";

import { getContract } from "utils/getContact";
import {
  exportSignatureAsSVG,
  exportSignatureAsPNGFile,
  convertToBuffer,
  addDataToIPFS,
  retrieveDataFromIPFS,
  createNFTMeta,
  IPFS_RETRIEVE_URL,
} from "utils/signature";
import { Web3CreateContext } from "contexts/web3-context";
import { defaultProvider } from "utils/web3connect";
import {
  TRANSACTION_LINK,
  OPENSEA_LINK,
  OPENSEA_COLLECTION_LINK,
} from "utils/constants";
import { calculateSignatureSizePrice } from "utils/getSignatureSizePrice";

import paypal from "assets/images/paypal.png";
import google from "assets/images/google.png";
import dropbox from "assets/images/dropbox.png";

export const txnStatusType = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  REVERTED: "REVERTED",
};

// if true then use canvas to create singature else create and use SVG as an NFT
const enableCanvasSignature = true;

const HomePage = () => {
  const { state } = useContext(Web3CreateContext);
  const { address, web3Provider } = state;

  const textCanvasRef = useRef();
  const handwrittenCanvasRef = useRef();

  const [signature, setSignature] = useState("");
  const [randomName, setRandomName] = useState("");
  const [xPricePerUnit, setXPricePerUnit] = useState(2);
  const [pricePerUnit, setPricePerUnit] = useState(0.5);
  const [customSignatureUnits, setCustomSignatureUnits] = useState([8, 16, 24]);
  const [isEligibleToMint, setIsEligibleToMint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEligibleToDiscount, setIsEligibleToDiscount] = useState(false);
  const [existingSignature, setExistingSignature] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [toggleHandSignature, setToggleHandSignature] = useState(false);
  const [txn, setTxn] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getSignature = async () => {
    let signatureNFT;
    if (toggleHandSignature) {
      // HandwrittenSignature
      const base64EncodedImage = getHandwrittenCanvasSignature();
      signatureNFT = await exportSignatureAsPNGFile(base64EncodedImage);
    } else if (enableCanvasSignature) {
      // Export text signature from canvas as png
      const base64EncodedImage = getTextCanvasSignature();
      signatureNFT = await exportSignatureAsPNGFile(base64EncodedImage);
    } else {
      // Export text signature as SVG
      const signatureSVG = exportSignatureAsSVG(signature);
      signatureNFT = await convertToBuffer(signatureSVG);
    }
    return signatureNFT;
  };

  const onClaimNFT = async (e) => {
    e.preventDefault();
    if (!signature) {
      setErrorMessage(
        "Please either draw or type a signature before claiming the NFT"
      );
      return;
    }
    if (!web3Provider) {
      setErrorMessage(
        "Please connect your wallet first before claiming the NFT"
      );
      return;
    }
    if (signature || web3Provider) {
      setErrorMessage("");
    }

    const signatureNFT = await getSignature();
    if (!signatureNFT) return;

    // Add signature to IPFS
    const imghash = await addDataToIPFS(signatureNFT, true);
    // // Create NFT metadata and add it to IPFS
    const nftMetadata = createNFTMeta(imghash, signature);
    const ipfsNFTMetadata = await addDataToIPFS(nftMetadata);

    const signer = web3Provider.getSigner();
    const contract = getContract(signer);
    const mintValue = ethers.utils.parseEther(totalPrice);
    const nftTxn = await contract.mintSignature(
      signature.length,
      signature,
      `ipfs://${ipfsNFTMetadata}`,
      {
        value: mintValue,
        gasLimit: 6000000,
      }
    );

    setTxn({
      mintedOn: new Date().toDateString(),
      txnStatus: txnStatusType.PENDING,
      txnValue: mintValue,
      txnHash: nftTxn.hash,
      txnLink: TRANSACTION_LINK + nftTxn.hash,
    });
    setOpenModal(true);
    try {
      await nftTxn.wait();
    } catch (error) {
      console.log(error);
    }
    await getTransactionReceipt(nftTxn.hash);
  };

  const getTransactionReceipt = async (txnHash) => {
    const txReceipt = await web3Provider.getTransactionReceipt(txnHash);
    // The status of a transaction is 1 is successful or 0 if it was reverted.
    // The block hash of the block that this transaction was included in.
    if (txReceipt && txReceipt.blockNumber && txReceipt.status) {
      setTxn((prevTxn) => ({
        ...prevTxn,
        txnStatus: txnStatusType.CONFIRMED,
        gasUsed: txReceipt.gasUsed.toString(), //The amount of gas actually used by this transaction.
      }));
      return;
    }
    setTxn((prevTxn) => ({
      ...prevTxn,
      txnStatus: txnStatusType.REVERTED,
      gasUsed: txReceipt.gasUsed.toString(),
    }));
  };

  const testModal = async () => {
    const txnHash =
      "0x6c8ee629793671f46cab0d5571560e3f2716b6ab520fbc7994c9da3c446d9f15";
    setTxn({
      mintedOn: new Date().toDateString(),
      txnStatus: txnStatus.PENDING,
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

  // Create a function to get random english names using API call
  const getRandomName = async () => {
    const response = await fetch("https://randomuser.me/api/?nat=us&results=1");
    const data = await response.json();
    setRandomName(data.results[0].name.first + " " + data.results[0].name.last);
  };

  const getdefaultValuesFromContract = async () => {
    const contract = getContract(defaultProvider);
    let xPricePerUnit = await contract.xPricePerUnit();
    let pricePerUnit = await contract.pricePerUnit();
    let customSignatureUnits = await contract.getCustomSignatureUnits();

    xPricePerUnit = ethers.utils.formatEther(xPricePerUnit).toString();
    pricePerUnit = ethers.utils.formatEther(pricePerUnit).toString();

    xPricePerUnit = parseFloat(xPricePerUnit);
    pricePerUnit = parseFloat(pricePerUnit);

    setXPricePerUnit(xPricePerUnit);
    setPricePerUnit(pricePerUnit);
    setCustomSignatureUnits(customSignatureUnits);
  };

  const getUserExistingMintedSignature = async (itemId) => {
    if (!address) return;
    const contract = getContract(defaultProvider);
    const existingSignature = await contract.getSignature(address);
    let ipfsHash = existingSignature[1];
    ipfsHash = ipfsHash.replace("ipfs://", "");
    const meta = await retrieveDataFromIPFS(ipfsHash);
    const currentSignature = {
      ...meta.data,
      ipfs_url: meta.data.web3Storage,
      mintedOn: new Date(meta.data.attributes[1].value),
      openseaNFT: `${OPENSEA_LINK}/${itemId - 1}`,
    };
    setExistingSignature(currentSignature);
    setIsLoading(false);
    setShowConfetti(true);
    setIsEligibleToMint(false);
  };

  const getUserInformation = async () => {
    setIsLoading(true);
    const contract = getContract(defaultProvider);
    const isEligibleToDiscount = await contract.checkElegibleMember(address);
    const isEligibleToMint = await contract.addressToSignature(address);
    if (isEligibleToMint.toString() === "0") {
      setIsEligibleToMint(true);
      setExistingSignature(null);
      setIsLoading(false);
    } else {
      // User has already minted the token
      await getUserExistingMintedSignature(isEligibleToMint);
    }
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

  const renderCanvasInput = () =>
    toggleHandSignature ? (
      <CanvasSignature ref={handwrittenCanvasRef} />
    ) : (
      renderTextSignature()
    );

  const renderInput = () =>
    !existingSignature ? (
      <>
        <Input
          type="text"
          placeholder="Enter Your Signature"
          value={signature || ""}
          onChange={onChangeTextSignature}
        />
        <Button onClick={onClaimNFT}>Claim NFT</Button>
      </>
    ) : (
      <Text as="h3">
        Our minions report that you have succesfully minted your signature NFT
        {existingSignature &&
          " on " +
            existingSignature.mintedOn.toDateString() +
            " at " +
            existingSignature.mintedOn.toLocaleTimeString()}
      </Text>
    );

  const renderButton = () => {
    if (existingSignature) {
      return (
        <>
          <a href={existingSignature.openseaNFT} target="_blank">
            <Button variant="secondary">
              Check you signature NFT at Opensea
            </Button>
          </a>
          <a href={OPENSEA_COLLECTION_LINK} target="_blank">
            <Button>Check Collection at Opensea</Button>
          </a>
        </>
      );
    }

    return (
      <>
        <Button
          onClick={() => setToggleHandSignature((prevState) => !prevState)}
          variant="secondary"
        >
          {toggleHandSignature
            ? "Type your signature "
            : "Create your own custom handwritten signature"}
        </Button>
        <Button onClick={clearSignature}>Clear</Button>
      </>
    );
  };

  const getTextCanvasSignature = () => {
    if (!textCanvasRef.current) return;
    const textCanvasSignature = textCanvasRef.current.toDataURL("image/png");
    return textCanvasSignature;
  };

  const getHandwrittenCanvasSignature = () => {
    if (!handwrittenCanvasRef.current) return;
    const handSignature = handwrittenCanvasRef.current.toDataURL("image/png");
    return handSignature;
  };

  const clearSignature = () => {
    if (toggleHandSignature) {
      if (!handwrittenCanvasRef.current) return;
      handwrittenCanvasRef.current.clear();
      return;
    }
    setSignature(" ");
  };

  const onCloseModal = async () => {
    setOpenModal((prevState) => !prevState);
    if (txn && txn.txnStatus && txn.txnStatus === txnStatusType.CONFIRMED) {
      setIsLoading(true);
      await getUserInformation();
      setShowConfetti(true);
    }
  };

  const calaculateTextSingaturePriceValue = (currentSignature) => {
    let price;
    if (isEligibleToDiscount) {
      price = currentSignature.length * pricePerUnit;
    } else {
      price = currentSignature.length * xPricePerUnit;
    }
    setSignature(currentSignature);
    setTotalPrice(price.toFixed(3));
  };

  const onChangeTextSignature = (event) => {
    const signature = event.target.value;
    calaculateTextSingaturePriceValue(signature);
  };

  const calaculateHandwrittenSingaturePriceValue = (currentSize) => {
    let calculatePriceValue = calculateSignatureSizePrice(
      customSignatureUnits,
      currentSize
    );
    if (isEligibleToDiscount) {
      calculatePriceValue *= pricePerUnit;
    } else {
      calculatePriceValue *= xPricePerUnit;
    }
    setTotalPrice(calculatePriceValue.toFixed(3));
  };

  const onChangeHandwrittenSignatureSize = (e) => {
    const currentSize = e.target.value;
    calaculateHandwrittenSingaturePriceValue(currentSize);
  };

  const LoaderComponent = (
    <>
      <Flex>
        <Text as="h3">Please wait while our minions get some info...</Text>
        <Loader
          sx={styles.loader}
          type="TailSpin"
          color="#FFC059"
          height={25}
          width={25}
        />
      </Flex>
    </>
  );

  useEffect(() => {
    if (toggleHandSignature) {
      calaculateHandwrittenSingaturePriceValue("small"); //default size is 'small'
      return;
    }
    calaculateTextSingaturePriceValue(signature);
  }, [toggleHandSignature]);

  useEffect(() => {
    if (showConfetti) setShowConfetti(false);
    if (!address) {
      setExistingSignature(null);
      return;
    }
    getUserInformation();
  }, [address]);

  useEffect(() => {
    getRandomName();
    getdefaultValuesFromContract();
  }, []);

  return (
    <>
      <Box as="section" id="home" sx={(styles.section, styles.random)}>
        {txn && <Modal open={openModal} txn={txn} onClose={onCloseModal} />}
        <Container>
          {showConfetti && <ConfettiComponent />}
          <Box sx={styles.contentWrapper}>
            <Box sx={styles.bannerContent}>
              <Heading as="h1">Get Your Own Personalized NFT Signature</Heading>
              <Text as="p">
                Your NFT Signature is an identity you can use in the Web3 world,
                any way you want!
              </Text>
              {errorMessage && <Text color="red">{errorMessage}</Text>}
              <Flex as="form" sx={styles.signatureForm}>
                {isLoading ? LoaderComponent : renderInput()}
              </Flex>

              {/* <Button onClick={testModal}>TesModal</Button> */}
              {!existingSignature && (
                <Flex as="form" sx={styles.signatureForm}>
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
              )}
            </Box>
            <Box>
              <Flex as="figure" sx={styles.bannerImage}>
                {existingSignature && existingSignature.ipfs_url ? (
                  <Image src={existingSignature.ipfs_url} />
                ) : (
                  renderCanvasInput()
                )}
              </Flex>
              {toggleHandSignature && !existingSignature && (
                <Flex as="form" sx={styles.sizeRadio}>
                  <RadioSelect
                    onSizeChange={onChangeHandwrittenSignatureSize}
                  />
                </Flex>
              )}
            </Box>
            {renderButton()}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;

const styles = {
  section: {
    backgroundColor: "#FFFCF7",
    pt: [14, null, null, null, null, 0],
    pb: [6, null, null, 7, 11, 0],
  },
  contentWrapper: {
    gap: ["50px 50px"],
    mt: "5%",
    display: ["block", null, null, null, "grid"],
    gridTemplateColumns: [null, null, null, null, "1fr 1fr", "0.95fr 1.05fr"],
    alignItems: "center",
    minHeight: ["auto", null, null, null, "38vh", "80vh"],
    pt: [null, null, null, 8, 0, 9, null],
    "@media only screen and (min-width:1900px)": {
      pt: 10,
    },
    a: {
      textDecoration: "none",
      button: {
        width: "100%",
      },
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
  loader: {
    marginLeft: "1em",
  },
  sizeRadio: {
    mt: "2%",
    // mt: [10],
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
