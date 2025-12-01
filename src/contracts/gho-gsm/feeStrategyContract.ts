import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the FeeStrategyManagerContract interface which defines the function addresses for managing FeeStrategy
 * operations within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (fee_strategy)
 * - The specific function name
 *
 * Note: Fee strategies are created through the GSM client's `createAndSetFeeStrategy` method,
 * as `create_fee_strategy` is a friend function only accessible to GSM and GSM steward modules.
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const feeStrategyManager = new FeeStrategyManagerContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class FeeStrategyManagerContract {
  // Fee Calculation Functions
  getBuyFeeFuncAddr: MoveFunctionId;
  getSellFeeFuncAddr: MoveFunctionId;
  getGrossAmountFromTotalBoughtFuncAddr: MoveFunctionId;
  getGrossAmountFromTotalSoldFuncAddr: MoveFunctionId;

  // Strategy Information Getters
  getNameFuncAddr: MoveFunctionId;
  getBuyFeeBpsFuncAddr: MoveFunctionId;
  getSellFeeBpsFuncAddr: MoveFunctionId;

  // Validation and Constants
  isValidFeeStrategyFuncAddr: MoveFunctionId;
  getMaxFeeBpsFuncAddr: MoveFunctionId;
  getBpsDivisorFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // Fee Calculation Functions
    this.getBuyFeeFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_buy_fee`;
    this.getSellFeeFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_sell_fee`;
    this.getGrossAmountFromTotalBoughtFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_gross_amount_from_total_bought`;
    this.getGrossAmountFromTotalSoldFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_gross_amount_from_total_sold`;

    // Strategy Information Getters
    this.getNameFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_name`;
    this.getBuyFeeBpsFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_buy_fee_bps`;
    this.getSellFeeBpsFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_sell_fee_bps`;

    // Validation and Constants
    this.isValidFeeStrategyFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::is_valid_fee_strategy`;
    this.getMaxFeeBpsFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_max_fee_bps`;
    this.getBpsDivisorFuncAddr = `${GhoModuleAccountAddress}::fee_strategy::get_bps_divisor`;
  }
}
