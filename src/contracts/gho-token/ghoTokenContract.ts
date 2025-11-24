import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Contract class for the GHO Token module.
 */
export class GhoTokenContract {
  // Entry functions
  addFacilitatorFuncAddr: MoveFunctionId;
  removeFacilitatorFuncAddr: MoveFunctionId;
  setFacilitatorBucketCapacityFuncAddr: MoveFunctionId;
  transferFuncAddr: MoveFunctionId;

  // View functions
  isInitializedFuncAddr: MoveFunctionId;
  getMetadataFuncAddr: MoveFunctionId;
  getBalanceFuncAddr: MoveFunctionId;
  getFacilitatorBucketFuncAddr: MoveFunctionId;
  getFacilitatorsListFuncAddr: MoveFunctionId;
  getFacilitatorFuncAddr: MoveFunctionId;
  getMetadataAddressFuncAddr: MoveFunctionId;
  nameFuncAddr: MoveFunctionId;
  symbolFuncAddr: MoveFunctionId;
  decimalsFuncAddr: MoveFunctionId;
  totalSupplyFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // Entry functions
    this.addFacilitatorFuncAddr = `${GhoModuleAccountAddress}::gho_token::add_facilitator`;
    this.removeFacilitatorFuncAddr = `${GhoModuleAccountAddress}::gho_token::remove_facilitator`;
    this.setFacilitatorBucketCapacityFuncAddr = `${GhoModuleAccountAddress}::gho_token::set_facilitator_bucket_capacity`;
    this.transferFuncAddr = `${GhoModuleAccountAddress}::gho_token::transfer`;

    // View functions
    this.isInitializedFuncAddr = `${GhoModuleAccountAddress}::gho_token::is_initialized`;
    this.getMetadataFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_metadata`;
    this.getBalanceFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_balance`;
    this.getFacilitatorBucketFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_facilitator_bucket`;
    this.getFacilitatorsListFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_facilitators_list`;
    this.getFacilitatorFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_facilitator`;
    this.getMetadataAddressFuncAddr = `${GhoModuleAccountAddress}::gho_token::get_metadata_address`;
    this.nameFuncAddr = `${GhoModuleAccountAddress}::gho_token::name`;
    this.symbolFuncAddr = `${GhoModuleAccountAddress}::gho_token::symbol`;
    this.decimalsFuncAddr = `${GhoModuleAccountAddress}::gho_token::decimals`;
    this.totalSupplyFuncAddr = `${GhoModuleAccountAddress}::gho_token::total_supply`;
  }
}
