/** @jsx jsx */
import { useRef, useEffect, useState } from 'react';
import { rgba } from 'polished';
import { jsx, Box, Container } from 'theme-ui';
import Tabs, { TabPane } from 'rc-tabs';
import TabTitle from 'components/tabs/tab-title';
import TabContent from 'components/tabs/tab-content';

import Currency from 'components/icons/currency';
import Cog from 'components/icons/cog';
import PieChart from 'components/icons/pie-chart';
import Suitcase from 'components/icons/suitcase';
import BarChart from 'components/icons/bar-chart';

import about from 'assets/images/about.png';
import brain from 'assets/images/brain.png';
import whitepaper from 'assets/images/whitepaper.png';
import airdrop from 'assets/images/airdrop.png';
import signaturedao from 'assets/images/signaturedao.png';
import bitcoin from 'assets/images/bitcoin.png';

const data = [
  {
    id: 1,
    tabPane: [
      {
        icon: <Currency />,
        title: 'About Us',
      },
    ],
    tabContent: [
      {
        image: about,
        title: `Personalized, one and only signature NFT`,
        description: `Grab your spot on The Million Signature DAO Mega-NFT. Discounts for popular NFT holders, including CryptoPunks, CryptoKitties, Bored Ape Yacht Club, Adidas Originals, PUNKS Comic, Loot, and many more!`,
        readMore: '#introduce-quality',
      },
    ],
  },
  {
    id: 2,
    tabPane: [
      {
        icon: <Cog />,
        title: 'Our Vision',
      },
    ],
    tabContent: [
      {
        image: brain,
        title: `Support NFT, DeFi and Metaverse communities`,
        description: `Our vision is to creating a fair and transparent system to support artists, developers and community members of the emerging NFT, DeFi and metaverse space.`,
        readMore: '#introduce-quality',
      },
    ],
  },
  {
    id: 3,
    tabPane: [
      {
        icon: <PieChart />,
        title: 'Tokenomics',
      },
    ],
    tabContent: [
      {
        image: bitcoin,
        title: `Third quality feature that boost your website rank & performance`,
        description: `Build an incredible workplace and grow your business with Gusto’s all-in-one platform with amazing contents. Get your tests delivered at let home collect sample from the victory of the supplies design system.`,
        readMore: '#introduce-quality',
      },
    ],
  },
  {
    id: 4,
    tabPane: [
      {
        icon: <Suitcase />,
        title: 'Whitepaper',
      },
    ],
    tabContent: [
      {
        image: whitepaper,
        title: `Fourth quality feature that boost your website rank & performance`,
        description: `Build an incredible workplace and grow your business with Gusto’s all-in-one platform with amazing contents. Get your tests delivered at let home collect sample from the victory of the supplies design system.`,
        readMore: '#introduce-quality',
      },
    ],
  },
  {
    id: 5,
    tabPane: [
      {
        icon: <BarChart />,
        title: 'Signature DAO',
      },
    ],
    tabContent: [
      {
        image: signaturedao,
        title: `Transparant, Open and Accountable goverenence`,
        description: `The incredible One Million Signature DAO community will hold an NFT of one million pixels with 200,000+ signatures empowering them to support various communities in the Web3 world. 40 + 10 + 30 + 10 + 10`,
        readMore: '#introduce-quality',
      },
    ],
  },
  {
    id: 6,
    tabPane: [
      {
        icon: <BarChart />,
        title: 'Airdrop',
      },
    ],
    tabContent: [
      {
        image: airdrop,
        title: `Fifth quality feature that boost your website rank & performance`,
        description: `Build an incredible workplace and grow your business with Gusto’s all-in-one platform with amazing contents. Get your tests delivered at let home collect sample from the victory of the supplies design system.`,
        readMore: '#introduce-quality',
      },
    ],
  },
];

const Dashboard = () => {
  const containerRef = useRef();
  const [containerOffset, setContainerOffset] = useState({
    left: null,
    top: null,
  });
  useEffect(() => {
    setContainerOffset({
      left: containerRef.current.offsetLeft,
      top: containerRef.current.offsetTop,
    });
  }, [containerRef]);

  return (
    <Box as="section" sx={styles.section}>
      <Container ref={containerRef} />
      <Box sx={{ pl: containerOffset.left + 30, ...styles.container }}>
        <Tabs
          sx={styles.tabs}
          animated={{ tabPane: true }}
          defaultActiveKey="2"
        >
          {data?.map((tab) => (
            <TabPane key={tab?.id} tab={<TabTitle tab={tab.tabPane} />}>
              <TabContent tabContent={tab?.tabContent} />
            </TabPane>
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default Dashboard;

const styles = {
  section: {
    backgroundColor: '#353448',
    pt: [9, null, null, 11, 10, 12, null],
    pb: [9, null, null, null, 0],
  },
  container: {
    maxWidth: ['none !important'],
    pr: [6, null, null, 0],
  },
  tabs: {
    border: 0,
    color: 'white',
    '.rc-tabs-nav': {
      mb: [6, null, null, 5, 7, null, 8],
    },
    '.rc-tabs-nav-wrap': {
      '::before': {
        backgroundColor: rgba('#fff', 0.1),
        content: ['none', null, null, `''`],
        height: 1,
        position: 'absolute',
        left: 0,
        top: 51,
        width: '100%',
      },
      '::after': {
        borderColor: ['primary'],
      },
    },
    '.rc-tabs-nav-list': {
      display: ['flex'],
    },
    '.rc-tabs-tab': {
      backgroundColor: 'transparent',
      '+ .rc-tabs-tab': {
        ml: [5, null, null, 5, 8, 12],
        // mt: [0, null, null, 0],
      },
      'svg g, svg path': {
        transition: '0.3s ease-in-out 0s',
      },
    },
    '.rc-tabs-tab-btn': {
      alignItems: 'center',
      display: ['flex', null, null, 'block'],
      outline: '0 none',
      fontSize: [null, null, null, 15, 2],
    },
    '.rc-tabs-tab-active': {
      'svg g, svg path': {
        fill: 'primary',
        opacity: 1,
      },
      h5: {
        color: 'primary',
      },
    },
    '.rc-tabs-ink-bar': {
      backgroundColor: 'primary',
      borderRadius: 5,
      bottom: [47],
      display: ['none', null, null, 'block'],
    },
    '.rc-tabs-tabpane': {
      outline: '0 none',
    },
  },
};
