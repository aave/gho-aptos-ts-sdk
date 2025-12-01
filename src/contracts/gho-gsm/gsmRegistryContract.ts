import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GsmRegistryContract interface which defines the function addresses for managing the GSM registry
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gsm_registry)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const gsmRegistry = new GsmRegistryContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GsmRegistryContract {
  // Entry Functions
  addGsmFuncAddr: MoveFunctionId;
  removeGsmFuncAddr: MoveFunctionId;

  // View Functions
  getGsmListFuncAddr: MoveFunctionId;
  getGsmListLengthFuncAddr: MoveFunctionId;
  getGsmBySortedIndexFuncAddr: MoveFunctionId;
  isRegisteredFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.addGsmFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::add_gsm`;
    this.removeGsmFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::remove_gsm`;

    // View Functions
    this.getGsmListFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::get_gsm_list`;
    this.getGsmListLengthFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::get_gsm_list_length`;
    this.getGsmBySortedIndexFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::get_gsm_by_sorted_index`;
    this.isRegisteredFuncAddr = `${ghoModuleAccountAddress}::gsm_registry::is_registered`;
  }
}
