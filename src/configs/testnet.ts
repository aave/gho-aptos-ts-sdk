import { AccountAddress, Network } from "@aptos-labs/ts-sdk";

import { GhoProviderConfig } from "../clients/aptosProvider";

/**
 * Configuration object for the GHO Testnet on Aptos.
 *
 * @constant
 * @type {GhoProviderConfig}
 * @property {Network} network - The network type, set to TESTNET.
 * @property {Object} addresses - The addresses for various GHO and AAVE components.
 * @property {AccountAddress} addresses.GHO - Address for GHO module.
 * @property {AccountAddress} addresses.GHO_ACL - Address for GHO ACL.
 * @property {AccountAddress} addresses.GHO_CONFIG - Address for GHO configuration.
 * @property {Object} assets - Optional asset addresses.
 * @property {AccountAddress} assets.USDC - Address for USDC asset (from example).
 * @property {AccountAddress} assets.USDT - Address for USDT asset (from example).
 */
export const DEFAULT_TESTNET_CONFIG: GhoProviderConfig = {
  network: Network.TESTNET,
  addresses: {
    GHO: AccountAddress.fromString(
      "0x710a239918a447febb6b610d3dbdc928c8d70095b7dae280d6be2ff3f8fadc32",
    ),
    GHO_ACL: AccountAddress.fromString(
      "0x07419b552919bf138a74aced6acb316e29c0e26978d836840bf71098562fcd92",
    ),
    GHO_CONFIG: AccountAddress.fromString(
      "0x8e040c798fd6c9f24dfea52179ef60f37df7ad2a1f33f64fd1b827d8de0203fa",
    ),
  },
  assets: {
    USDC: AccountAddress.fromString(
      "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    ),
    USDT: AccountAddress.fromString(
      "0xd5d0d561493ea2b9410f67da804653ae44e793c2423707d4f11edb2e38192050",
    ),
  },
  aptosApiKey: process.env.NODE_API_KEY,
};
