/** @jsx jsx */
import { useState, useEffect, useContext } from "react";
import { jsx, Box, Container, Flex, Button } from "theme-ui";
import Sticky from "react-stickynode";
import { Web3Provider } from "@ethersproject/providers";

import { DrawerProvider } from "contexts/drawer/drawer-provider";
import NavbarDrawer from "./navbar-drawer";
import Logo from "components/logo";
import { getWeb3Modal, switchNetwork } from "utils/web3connect";
import { Web3CreateContext } from "contexts/web3-context";
import {
  SET_WEB3_PROVIDER,
  RESET_WEB3_PROVIDER,
  SET_CHAIN_ID,
} from "contexts/web3-constants";
import { CURRENT_NETWORK } from "utils/constants";

export default function Header() {
  const { state, dispatch } = useContext(Web3CreateContext);
  const { provider, address, chainId } = state;
  const [web3Modal, setWeb3Modal] = useState();

  const [stateMobile, setState] = useState({
    isMobileMenu: false,
    isSticky: false,
  });
  const handleCloseMenu = () => {
    setState({
      ...stateMobile,
      isMobileMenu: false,
    });
  };

  const onWeb3Connect = async () => {
    if (!web3Modal) return;
    try {
      const provider = await web3Modal.connect();
      // We plug the initial `provider` into ethers.js and get back
      // a Web3Provider. This will add on methods from ethers.js and
      // event listeners such as `.on()` will be different.
      const web3Provider = new Web3Provider(provider, "any");

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      const network = await web3Provider.getNetwork();
      dispatch({
        type: SET_WEB3_PROVIDER,
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      });
    } catch (e) {
      console.log("Web3Error caught", e);
    }
  };

  const onWeb3Disconnect = async () => {
    await web3Modal.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === "function") {
      await provider.disconnect();
    }
    dispatch({
      type: RESET_WEB3_PROVIDER,
    });
  };

  useEffect(() => {
    if (provider) {
      const handleChainChanged = (chainId) => {
        chainId = parseInt(chainId, 16);
        dispatch({
          type: SET_CHAIN_ID,
          chainId: chainId,
        });
      };

      provider.on("chainChanged", handleChainChanged);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    const web3Modal = getWeb3Modal();
    setWeb3Modal(web3Modal);
  }, []);

  return (
    <DrawerProvider>
      <Box sx={styles.headerWrapper}>
        <Sticky enabled={true} top={0} activeClass="is-sticky" innerZ={100}>
          <Box
            as="header"
            variant="layout.header"
            className={stateMobile.isMobileMenu ? "is-mobile-menu" : ""}
          >
            <Container>
              <Box sx={styles.headerInner}>
                <Logo sx={styles.logo} isSticky={stateMobile.isSticky} />

                <Flex
                  as="nav"
                  sx={styles.navbar}
                  className={
                    stateMobile.isMobileMenu ? "navbar active" : "navbar"
                  }
                >
                  <Box
                    as="ul"
                    sx={styles.navList}
                    className={stateMobile.isMobileMenu ? "active" : ""}
                  ></Box>
                </Flex>

                <Flex>
                  {provider && !(chainId === CURRENT_NETWORK?.chainId) && (
                    <Button
                      variant="text"
                      sx={styles.error}
                      onClick={switchNetwork}
                    >
                      Change to {CURRENT_NETWORK?.name}
                    </Button>
                  )}

                  {address && (
                    <Button variant="text" sx={styles.getStarted}>
                      {address.substring(0, 4) +
                        "..." +
                        address.substring(address.length - 3, address.length)}
                    </Button>
                  )}
                  {provider ? (
                    <Button
                      variant="text"
                      sx={styles.getStarted}
                      onClick={onWeb3Disconnect}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      sx={styles.getStarted}
                      onClick={onWeb3Connect}
                    >
                      Connect
                    </Button>
                  )}
                </Flex>
                <NavbarDrawer />
              </Box>
            </Container>
          </Box>
        </Sticky>
      </Box>
    </DrawerProvider>
  );
}

const styles = {
  headerWrapper: {
    justifyContent: "space-between",
    backgroundColor: "#FFFCF7",
    header: {
      position: "fixed",
      left: 0,
      right: 0,
      py: [4],
      transition: "all 0.3s ease-in-out 0s",
      "&.is-mobile-menu": {
        backgroundColor: "white",
      },
    },
    ".is-sticky": {
      header: {
        backgroundColor: "white",
        py: ["13px"],
        boxShadow: "0 6px 13px rgba(38,78,118,0.1)",
      },
    },
  },
  headerInner: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "space-between",
    position: ['relative', null, null, 'static'],
  },
  logo: {
    mr: [null, null, null, null, 30, 12],
  },
  navbar: {
    display: ["none", null, null, null, "flex"],
    alignItems: "center",
    flexGrow: 1,
    // justifyContent: 'center',
    li: {
      display: "flex",
      alignItems: "center",
      a: {
        cursor: "pointer",
        transition: "all 0.3s ease-in-out 0s",
      },
    },
  },
  navList: {
    display: ["flex"],
    listStyle: "none",
    flexGrow: 1,
    p: 0,
    ".nav-item": {
      cursor: "pointer",
      fontWeight: 400,
      padding: 0,
      margin: [null, null, null, null, "0 15px"],
    },
    ".active": {
      color: "primary",
    },
  },
  getStarted: {
    backgroundColor: "#FFF0D7",
    color: "#E6A740",
    p: ["0 16px"],
    minHeight: 45,
    ml: [6],
    display: ["none", null, null, null, "flex"],
  },
  error: {
    backgroundColor: "#ffd7dd",
    color: "#e64040",
    p: ["0 16px"],
    minHeight: 45,
    ml: [6],
    display: ["none", null, null, null, "flex"],
  },
};
