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
  addresses: {
    GHO: AccountAddress.fromString(
      "0x61409238c26190bf5297ebd427cd9170de0cf8afd5e90ddc11d7ca4b4d583b58",
    ),
    GHO_ACL: AccountAddress.fromString(
      "0x7885b4d2cc8a806f8ebdbaf58adbf580d3941d50ed59ccb403c4dc929716f059",
    ),
    GHO_CONFIG: AccountAddress.fromString(
      "0x4a318118c53b5a8f1037099e54d7a292353c8172a40f76dcb152e0a23e8ba381",
    ),
    USDC_GSM: AccountAddress.fromString(
      "0xab580f821e70a4b449b42dfc6a4d7528fc34386615e4ca38d1ad2efcc30523c8",
    ),
    USDT_GSM: AccountAddress.fromString(
      "0xffd4ed5045dd95345cfd2933c61ef9c8917cfeca87ff35142ce2f9ab65aac8e8",
    ),
    GHO_RESERVE: AccountAddress.fromString(
      "0x2dad2b04499ec6b7ce56e9d08e4c9afe2f20fb48c0fd7b928609ea7bddfe24a4",
    ),
    GHO_DIRECT_MINTER: AccountAddress.fromString(
      "0x8f1aa8c39cadda5d2a5e4e5771f7d85be784885fbe6bffdff4155b3c1de0df82",
    ),
    GHO_CCIP_TOKEN_POOL: AccountAddress.fromString(
      "0x61409238c26190bf5297ebd427cd9170de0cf8afd5e90ddc11d7ca4b4d583b58",
    ),
  },
  assets: {
    GHO_TOKEN: AccountAddress.fromString(
      "0xe9e9f6d5759147867740ccdb42ac466063ac49b8213d7d010753f5406fd982bf",
    ),
    USDC: AccountAddress.fromString(
      "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    ),
    USDT: AccountAddress.fromString(
      "0xd5d0d561493ea2b9410f67da804653ae44e793c2423707d4f11edb2e38192050",
    ),
  },
  aptosApiKey: process.env.NODE_API_KEY,
};
