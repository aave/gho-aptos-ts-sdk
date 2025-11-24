import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoAaveStewardContract interface which defines the function addresses for managing the GHO Aave Steward
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_aave_steward)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoAaveSteward = new GhoAaveStewardContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoAaveStewardContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  updateGhoBorrowRateFuncAddr: MoveFunctionId;
  updateGhoBorrowCapFuncAddr: MoveFunctionId;
  updateGhoSupplyCapFuncAddr: MoveFunctionId;
  setBorrowRateConfigFuncAddr: MoveFunctionId;
  transferOwnershipFuncAddr: MoveFunctionId;

  // View Functions
  getBorrowRateConfigFuncAddr: MoveFunctionId;
  getGhoTimelocksFuncAddr: MoveFunctionId;
  getGhoTokenFuncAddr: MoveFunctionId;
  getOwnerFuncAddr: MoveFunctionId;
  minimumDelayFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::initialize`;
    this.updateGhoBorrowRateFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::update_gho_borrow_rate`;
    this.updateGhoBorrowCapFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::update_gho_borrow_cap`;
    this.updateGhoSupplyCapFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::update_gho_supply_cap`;
    this.setBorrowRateConfigFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::set_borrow_rate_config`;
    this.transferOwnershipFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::transfer_ownership`;

    // View Functions
    this.getBorrowRateConfigFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::get_borrow_rate_config`;
    this.getGhoTimelocksFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::get_gho_timelocks`;
    this.getGhoTokenFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::get_gho_token`;
    this.getOwnerFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::get_owner`;
    this.minimumDelayFuncAddr = `${ghoModuleAccountAddress}::gho_aave_steward::minimum_delay`;
  }
}
