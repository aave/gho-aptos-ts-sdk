import { AccountAddress, Network } from "@aptos-labs/ts-sdk";

import { GhoProviderConfig, GhoProviderType } from "../clients/aptosProvider";

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
 * @property {AccountAddress} addresses.USDC_GSM - Address for USDC GSM.
 * @property {AccountAddress} addresses.USDT_GSM - Address for USDT GSM.
 * @property {AccountAddress} addresses.GHO_RESERVE - Address for GHO reserve.
 * @property {AccountAddress} addresses.GHO_DIRECT_MINTER - Address for GHO direct minter.
 * @property {AccountAddress} addresses.GHO_CCIP_TOKEN_POOL - Address for GHO CCIP token pool.
 * @property {Object} assets - asset addresses.
 * @property {AccountAddress} assets.GHO_TOKEN - Address for GHO token.
 * @property {AccountAddress} assets.USDC - Address for USDC asset (from example).
 * @property {AccountAddress} assets.USDT - Address for USDT asset (from example).
 */
export const DEFAULT_TESTNET_CONFIG: GhoProviderConfig = {
  network: Network.TESTNET,
  providerType:
    (process.env.APTOS_PROVIDER_TYPE as GhoProviderType) ||
    GhoProviderType.APTOS,
  apiKey: process.env.APTOS_API_KEY,
  addresses: {
    GHO: AccountAddress.fromString(
      "0xbeb022c05921bfcead4ca06b6d6192ad1cdcecf815585b070f2ab90f9acedcf4",
    ),
    GHO_ACL: AccountAddress.fromString(
      "0x1b6fb1258c1a5f2f4a88bccaed78e3a1290f8065c0393818b00e88cb819cf23c",
    ),
    GHO_CONFIG: AccountAddress.fromString(
      "0x70325c10b0d1f561c35e451ada5278205a14c356ade329f98663e91da2b2b503",
    ),
    USDC_GSM: AccountAddress.fromString(
      "0x8f4fdbe922f22aca29225e411203248a385073ff11b8ae62aeac7b23b4618d76",
    ),
    USDT_GSM: AccountAddress.fromString(
      "0xc1d9bef10aefb9f5ec3bb6b09a9191f0f312f949a83bfae0f9798d92615a75a4",
    ),
    GHO_RESERVE: AccountAddress.fromString(
      "0x26884dbde3356466390c8f3f09ae59140d59e6581dbbaa1cad9e57a2128c7377",
    ),
    GHO_DIRECT_MINTER: AccountAddress.fromString(
      "0x9aa7ee1fc819d96179eb09750b6ab1cd3164351c87a6fa2e52c1fc04b2dd904e",
    ),
    GHO_CCIP_TOKEN_POOL: AccountAddress.fromString(
      "0x6ddc551f6ebbd036a7c669b5b8a62d8327f5b2d97bb2efbe661c46762a4ec303",
    ),
  },
  assets: {
    GHO_TOKEN: AccountAddress.fromString(
      "0xdcf0a39e62369ed293d4b1579b76957be14c5ad97649f71deb4f4dfd0a293ca3",
    ),
    USDC: AccountAddress.fromString(
      "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    ),
    USDT: AccountAddress.fromString(
      "0xd5d0d561493ea2b9410f67da804653ae44e793c2423707d4f11edb2e38192050",
    ),
  },
};
