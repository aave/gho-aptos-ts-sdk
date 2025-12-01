import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the PriceStrategyManagerContract interface which defines the function addresses for managing PriceStrategy
 * operations within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (price_strategy)
 * - The specific function name
 *
 * Note: Price strategies are created through the GSM client's `createAndInitializeGsm` or `updatePriceRatio` methods,
 * as `create_fixed_price_strategy` is a friend function only accessible to GSM module.
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const priceStrategyManager = new PriceStrategyManagerContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class PriceStrategyManagerContract {
  // Price Calculation Functions
  getAssetPriceInGhoFuncAddr: MoveFunctionId;
  getGhoPriceInAssetFuncAddr: MoveFunctionId;

  // Strategy Information Getters
  getNameFuncAddr: MoveFunctionId;
  getUnderlyingAssetFuncAddr: MoveFunctionId;
  getUnderlyingAssetDecimalsFuncAddr: MoveFunctionId;
  getPriceRatioFuncAddr: MoveFunctionId;

  // Validation and Constants
  isValidPriceStrategyFuncAddr: MoveFunctionId;
  getGhoDecimalsFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // Price Calculation Functions
    this.getAssetPriceInGhoFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_asset_price_in_gho`;
    this.getGhoPriceInAssetFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_gho_price_in_asset`;

    // Strategy Information Getters
    this.getNameFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_name`;
    this.getUnderlyingAssetFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_underlying_asset`;
    this.getUnderlyingAssetDecimalsFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_underlying_asset_decimals`;
    this.getPriceRatioFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_price_ratio`;

    // Validation and Constants
    this.isValidPriceStrategyFuncAddr = `${GhoModuleAccountAddress}::price_strategy::is_valid_price_strategy`;
    this.getGhoDecimalsFuncAddr = `${GhoModuleAccountAddress}::price_strategy::get_gho_decimals`;
  }
}
