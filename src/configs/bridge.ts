import { DEFAULT_TESTNET_CONFIG } from "./testnet";

/**
 * Supported destination chains for GHO bridging via CCIP (Testnet)
 * Currently only Arbitrum Sepolia is supported for testing
 */
export enum SupportedTestnetChain {
  ARBITRUM_SEPOLIA = "arbitrum-sepolia",
}

/**
 * Supported destination chains for GHO bridging via CCIP (Mainnet)
 */
export enum SupportedMainnetChain {
  ARBITRUM = "arbitrum",
  ETHEREUM = "ethereum",
  BASE = "base",
  AVALANCHE = "avalanche",
  GNOSIS = "gnosis",
  INK = "ink",
  PLASMA = "plasma",
}

/**
 * Union type for all supported chains
 */
export type SupportedChain = SupportedTestnetChain | SupportedMainnetChain;

/**
 * CCIP chain selectors for testnet networks
 * Currently only Arbitrum Sepolia is supported for testing
 */
export const TESTNET_CHAIN_SELECTORS: Readonly<
  Record<SupportedTestnetChain, bigint>
> = {
  [SupportedTestnetChain.ARBITRUM_SEPOLIA]: 3478487238524512106n,
} as const;

/**
 * CCIP chain selectors for mainnet networks
 * Based on Chainlink CCIP documentation
 */
export const MAINNET_CHAIN_SELECTORS: Readonly<
  Record<SupportedMainnetChain, bigint>
> = {
  [SupportedMainnetChain.ARBITRUM]: 4949039107694359620n,
  [SupportedMainnetChain.ETHEREUM]: 5009297550715157269n,
  [SupportedMainnetChain.BASE]: 15971525489660198786n,
  [SupportedMainnetChain.AVALANCHE]: 6433500567565415381n,
  [SupportedMainnetChain.GNOSIS]: 465200170687744372n,
  [SupportedMainnetChain.INK]: 3461204551265785888n,
  [SupportedMainnetChain.PLASMA]: 9335212494177455608n,
} as const;

/**
 * Bridge configuration for testnet
 */
export interface BridgeNetworkConfig {
  ccipRouterAddress: string;
  ghoTokenAddress: string;
  aptFeeTokenAddress: string;
  chainSelectors: Readonly<Record<string, bigint>>;
  destinationGhoTokens?: Readonly<Record<string, string>>;
  destinationCcipTokenPools?: Readonly<Record<string, string>>;
}

/**
 * Mainnet GHO token addresses on destination chains
 */
export const MAINNET_GHO_TOKEN_ADDRESSES: Readonly<
  Record<SupportedMainnetChain, string>
> = {
  [SupportedMainnetChain.ETHEREUM]:
    "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
  [SupportedMainnetChain.ARBITRUM]:
    "0x7dfF72693f6A4149b17e7C6314655f6A9F7c8B33",
  [SupportedMainnetChain.AVALANCHE]:
    "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73",
  [SupportedMainnetChain.BASE]: "0x6Bb7a212910682DCFdbd5BCBb3e28FB4E8da10Ee",
  [SupportedMainnetChain.GNOSIS]: "0xfc421ad3c883bf9e7c4f42de845c4e4405799e73",
  [SupportedMainnetChain.INK]: "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73",
  [SupportedMainnetChain.PLASMA]: "0xb77E872A68C62CfC0dFb02C067Ecc3DA23B4bbf3",
} as const;

/**
 * Mainnet CCIP token pool addresses on destination chains
 */
export const MAINNET_CCIP_TOKEN_POOLS: Readonly<
  Record<SupportedMainnetChain, string>
> = {
  [SupportedMainnetChain.ETHEREUM]:
    "0x06179f7C1be40863405f374E7f5F8806c728660A",
  [SupportedMainnetChain.ARBITRUM]:
    "0xB94Ab28c6869466a46a42abA834ca2B3cECCA5eB",
  [SupportedMainnetChain.AVALANCHE]:
    "0xDe6539018B095353A40753Dc54C91C68c9487D4E",
  [SupportedMainnetChain.BASE]: "0x98217A06721Ebf727f2C8d9aD7718ec28b7aAe34",
  [SupportedMainnetChain.GNOSIS]: "0xDe6539018B095353A40753Dc54C91C68c9487D4E",
  [SupportedMainnetChain.INK]: "0xDe6539018B095353A40753Dc54C91C68c9487D4E",
  [SupportedMainnetChain.PLASMA]: "0x360d8aa8F6b09B7BC57aF34db2Eb84dD87bf4d12",
} as const;

/**
 * Default testnet bridge configuration
 */
export const DEFAULT_TESTNET_BRIDGE_CONFIG: BridgeNetworkConfig = {
  ccipRouterAddress:
    DEFAULT_TESTNET_CONFIG.addresses.GHO_CCIP_TOKEN_POOL.toString(),
  ghoTokenAddress: DEFAULT_TESTNET_CONFIG.addresses.GHO.toString(),
  aptFeeTokenAddress: "0xa", // APT metadata address
  chainSelectors: TESTNET_CHAIN_SELECTORS as Record<string, bigint>,
  destinationGhoTokens: {
    [SupportedTestnetChain.ARBITRUM_SEPOLIA]:
      "0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810",
  } as Record<string, string>,
  destinationCcipTokenPools: {
    [SupportedTestnetChain.ARBITRUM_SEPOLIA]:
      "0xb4A1e95A2FA7ed83195C6c16660fCCa720163FF6",
  } as Record<string, string>,
};

/**
 * Default mainnet bridge configuration
 * Note: Update ccipRouterAddress and ghoTokenAddress when Aptos mainnet is deployed
 */
export const DEFAULT_MAINNET_BRIDGE_CONFIG: BridgeNetworkConfig = {
  ccipRouterAddress:
    "0x20f808de3375db34d17cc946ec6b43fc26962f6afa125182dc903359756caf6b",
  ghoTokenAddress: "0x0", // TODO: Update when GHO on Aptos mainnet deployed
  aptFeeTokenAddress: "0xa", // APT metadata address
  chainSelectors: MAINNET_CHAIN_SELECTORS as Record<string, bigint>,
  destinationGhoTokens: MAINNET_GHO_TOKEN_ADDRESSES as Record<string, string>,
  destinationCcipTokenPools: MAINNET_CCIP_TOKEN_POOLS as Record<string, string>,
};

/**
 * Gets the appropriate bridge config based on network
 * @param isMainnet - Whether to get mainnet config
 * @returns Bridge configuration for the network
 */
export function getBridgeConfigForNetwork(
  isMainnet: boolean,
): BridgeNetworkConfig {
  return isMainnet
    ? DEFAULT_MAINNET_BRIDGE_CONFIG
    : DEFAULT_TESTNET_BRIDGE_CONFIG;
}
