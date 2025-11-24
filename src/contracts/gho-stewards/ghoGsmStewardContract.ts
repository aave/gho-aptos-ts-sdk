import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoGsmStewardContract interface which defines the function addresses for managing the Gho Gsm Steward
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gsm_steward)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoGsmSteward = new GhoGsmStewardContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoGsmStewardContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  updateGsmExposureCapFuncAddr: MoveFunctionId;
  updateGsmBuySellFeesFuncAddr: MoveFunctionId;

  // View Functions
  getGsmTimelocksFuncAddr: MoveFunctionId;
  gsmFeeRateChangeMaxFuncAddr: MoveFunctionId;
  minimumDelayFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::initialize`;
    this.updateGsmExposureCapFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::update_gsm_exposure_cap`;
    this.updateGsmBuySellFeesFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::update_gsm_buy_sell_fees`;

    // View Functions
    this.getGsmTimelocksFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::get_gsm_timelocks`;
    this.gsmFeeRateChangeMaxFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::gsm_fee_rate_change_max`;
    this.minimumDelayFuncAddr = `${ghoModuleAccountAddress}::gsm_steward::minimum_delay`;
  }
}
