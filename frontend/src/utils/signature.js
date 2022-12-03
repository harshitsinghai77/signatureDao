import axios from "axios";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.cjs";

import { renderToStaticMarkup } from "react-dom/server";

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export const IPFS_RETRIEVE_URL = "https://w3s.link/ipfs/";

export const exportSignatureAsSVG = (signature) => {
  const imgSVG = (
    <svg
      id="mysvg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 350 350"
      fill="#FFC059"
    >
      <rect width="100%" height="70%" fill="black" />
      <text
        x="50%"
        y="25%"
        textAnchor="middle"
        style={{ fontFamily: "Gochi Hand, cursive", fontSize: "28px" }}
      >
        <tspan x="50%" dy="1.2em">
          {signature}
        </tspan>
      </text>
    </svg>
  );
  return renderToStaticMarkup(imgSVG);
};

export const exportSignatureAsPNGFile = async (base64EncodedImage) => {
  const fetchSignature = await fetch(base64EncodedImage);
  const blob = await fetchSignature.blob();
  const file = new File([blob], "signature.png", { type: "image/png" });
  return file;
};

export const convertToBuffer = async (svgElement) => {
  const svgBuffer = Buffer.from(svgElement);
  return svgBuffer;
};

// export const addDataToNFTStorage = async (metadata) => {
//   const metadata = await nftStorageClient.store({
//     name: "Pinpie",
//     description: "Pin is not delicious beef!",
//     image: new NFTStorageFile(
//       [
//         /* data */
//       ],
//       "pinpie.jpg",
//       { type: "image/jpg" }
//     ),
//   });
//   console.log(metadata.url);
// };

export const addDataToIPFS = async (metadata, metadataTypeImage = false) => {
  const client = makeStorageClient();
  let newMetadata = null;
  if (metadataTypeImage) {
    newMetadata = [metadata];
  } else {
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    newMetadata = [new File([blob], "hello.json")];
  }
  const hash = await client.put(newMetadata);
  return hash;
};

export const retrieveDataFromIPFS = async (ipfsHash) => {
  const result = await axios.get(
    `https://${ipfsHash}.ipfs.w3s.link/hello.json`
  );
  return result;
};

export const createNFTMeta = (imgHash, signature) => {
  // More Information - https://docs.opensea.io/docs/metadata-standards
  return {
    image: `https://ipfs.io/ipfs/${imgHash}`,
    web3Storage: `https://${imgHash}.ipfs.w3s.link/signature.png`,
    name: signature,
    description: "An NFT from the highly acclaimed OneMillionSignature DAO",
    attributes: [
      {
        trait_type: "Signature",
        value: signature,
      },
      {
        display_type: "date",
        trait_type: "minted on",
        value: Date.now(),
      },
    ],
  };
};
