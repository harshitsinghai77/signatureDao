import { create } from "ipfs-http-client";
import { renderToStaticMarkup } from "react-dom/server";

const ifpsConfig = {
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
};

const ipfs = create(ifpsConfig);

export const createSvgFromSignature = (signature) => {
  const imgSVG = (
    <svg
      id="mysvg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 350 350"
      fill="white"
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
  // return imgSVG;
  return renderToStaticMarkup(imgSVG);
};

const convertToBufferSomething = async (svgElement) => {
  //file is converted to a buffer for upload to IPFS
  //set this buffer -using es6 syntax
  const encodedStringImage = Buffer.from(svgElement);
  return encodedStringImage;
};

export const convertToBuffer = async (svgElement) => {
  const buffer = await convertToBufferSomething(svgElement);
  // const finalImg = `data:image/svg+xml;base64,${buffer}`;
  return buffer;
};

export const addDataToIPFS = async (metadata) => {
  const hash = await ipfs.add(metadata);
  return hash.cid.toString();
};

export const createNFTMeta = (imgHash, signature) => {
  // More Information - https://docs.opensea.io/docs/metadata-standards
  return JSON.stringify({
    image: `https://ipfs.io/ipfs/${imgHash}`,
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
  });
};
