import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the CcipStewardContract interface which defines the function addresses for managing the CCIP Steward
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (ccip_steward)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ccipSteward = new CcipStewardContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class CcipStewardContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  updateBridgeLimitFuncAddr: MoveFunctionId;
  updateRateLimitFuncAddr: MoveFunctionId;
  toggleBridgeLimitEnabledFuncAddr: MoveFunctionId;

  // View Functions
  getCcipTimelocksFuncAddr: MoveFunctionId;
  getBridgeLimitFuncAddr: MoveFunctionId;
  minimumDelayFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::initialize`;
    this.updateBridgeLimitFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::update_bridge_limit`;
    this.updateRateLimitFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::update_rate_limit`;
    this.toggleBridgeLimitEnabledFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::toggle_bridge_limit_enabled`;

    // View Functions
    this.getCcipTimelocksFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::get_ccip_timelocks`;
    this.getBridgeLimitFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::get_bridge_limit`;
    this.minimumDelayFuncAddr = `${ghoModuleAccountAddress}::ccip_steward::minimum_delay`;
  }
}
