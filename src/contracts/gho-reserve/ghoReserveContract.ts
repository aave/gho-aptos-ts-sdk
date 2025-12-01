import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoReserveContract interface which defines the function addresses for managing the GhoReserve
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_reserve)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoReserve = new GhoReserveContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoReserveContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  useGhoFuncAddr: MoveFunctionId;
  restoreFuncAddr: MoveFunctionId;
  transferFuncAddr: MoveFunctionId;
  addEntityFuncAddr: MoveFunctionId;
  removeEntityFuncAddr: MoveFunctionId;
  setLimitFuncAddr: MoveFunctionId;
  transferOwnershipFuncAddr: MoveFunctionId;

  // View Functions
  getEntitiesFuncAddr: MoveFunctionId;
  getUsedFuncAddr: MoveFunctionId;
  getUsageFuncAddr: MoveFunctionId;
  getLimitFuncAddr: MoveFunctionId;
  getOwnerFuncAddr: MoveFunctionId;
  isEntityFuncAddr: MoveFunctionId;
  totalEntitiesFuncAddr: MoveFunctionId;
  ghoTokenFuncAddr: MoveFunctionId;
  ghoRemoteReserveRevisionFuncAddr: MoveFunctionId;
  getGhoReserveAddressFuncAddr: MoveFunctionId;
  getReserveAddressFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::initialize`;
    this.useGhoFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::use_gho`;
    this.restoreFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::restore`;
    this.transferFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::transfer`;
    this.addEntityFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::add_entity`;
    this.removeEntityFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::remove_entity`;
    this.setLimitFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::set_limit`;
    this.transferOwnershipFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::transfer_ownership`;

    // View Functions
    this.getEntitiesFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_entities`;
    this.getUsedFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_used`;
    this.getUsageFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_usage`;
    this.getLimitFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_limit`;
    this.getOwnerFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_owner`;
    this.isEntityFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::is_entity`;
    this.totalEntitiesFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::total_entities`;
    this.ghoTokenFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::gho_token`;
    this.ghoRemoteReserveRevisionFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::gho_remote_reserve_revision`;
    this.getGhoReserveAddressFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_gho_reserve_address`;
    this.getReserveAddressFuncAddr = `${ghoModuleAccountAddress}::gho_reserve::get_reserve_address`;
  }
}
