import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoBucketStewardContract interface which defines the function addresses for managing the Gho Bucket Steward
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_bucket_steward)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoBucketSteward = new GhoBucketStewardContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoBucketStewardContract {
  // Entry Functions
  initializeFuncAddr: MoveFunctionId;
  updateFacilitatorBucketCapacityFuncAddr: MoveFunctionId;
  setControlledFacilitatorFuncAddr: MoveFunctionId;

  // View Functions
  getControlledFacilitatorsFuncAddr: MoveFunctionId;
  isControlledFacilitatorFuncAddr: MoveFunctionId;
  getFacilitatorBucketCapacityTimelockFuncAddr: MoveFunctionId;
  minimumDelayFuncAddr: MoveFunctionId;
  ghoTokenFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const ghoModuleAddr = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const ghoModuleAccountAddress = ghoModuleAddr.toString();

    // Entry Functions
    this.initializeFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::initialize`;
    this.updateFacilitatorBucketCapacityFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::update_facilitator_bucket_capacity`;
    this.setControlledFacilitatorFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::set_controlled_facilitator`;

    // View Functions
    this.getControlledFacilitatorsFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::get_controlled_facilitators`;
    this.isControlledFacilitatorFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::is_controlled_facilitator`;
    this.getFacilitatorBucketCapacityTimelockFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::get_facilitator_bucket_capacity_timelock`;
    this.minimumDelayFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::minimum_delay`;
    this.ghoTokenFuncAddr = `${ghoModuleAccountAddress}::gho_bucket_steward::gho_token`;
  }
}
