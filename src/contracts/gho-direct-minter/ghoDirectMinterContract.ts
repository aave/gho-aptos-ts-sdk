import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoDirectMinterContract interface which defines the function addresses for managing the Gho Direct Minter
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_direct_minter)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoDirectMinter = new GhoDirectMinterContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoDirectMinterContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  useAndSupplyFuncAddr: MoveFunctionId;
  withdrawAndRestoreFuncAddr: MoveFunctionId;
  transferExcessToTreasuryFuncAddr: MoveFunctionId;
  updateGhoReserveFuncAddr: MoveFunctionId;
  setGhoAddressFuncAddr: MoveFunctionId;

  // View Functions
  ghoDirectMinterAddressFuncAddr: MoveFunctionId;
  ghoDirectMinterObjectFuncAddr: MoveFunctionId;
  getGhoTokenAddressFuncAddr: MoveFunctionId;
  getCollectorAddressFuncAddr: MoveFunctionId;
  isRiskAdminFuncAddr: MoveFunctionId;
  isGhoGuardianFuncAddr: MoveFunctionId;
  getDirectMinterSignerAddressFuncAddr: MoveFunctionId;
  getGhoReserveAddressFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::initialize`;
    this.useAndSupplyFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::use_and_supply`;
    this.withdrawAndRestoreFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::withdraw_and_restore`;
    this.transferExcessToTreasuryFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::transfer_excess_to_treasury`;
    this.updateGhoReserveFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::update_gho_reserve`;
    this.setGhoAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::set_gho_address`;

    // View Functions
    this.ghoDirectMinterAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::gho_direct_minter_address`;
    this.ghoDirectMinterObjectFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::gho_direct_minter_object`;
    this.getGhoTokenAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::get_gho_token_address`;
    this.getCollectorAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::get_collector_address`;
    this.isRiskAdminFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::is_risk_admin`;
    this.isGhoGuardianFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::is_gho_guardian`;
    this.getDirectMinterSignerAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::get_direct_minter_signer_address`;
    this.getGhoReserveAddressFuncAddr = `${ghoModuleAccountAddress}::gho_direct_minter::get_gho_reserve_address`;
  }
}
