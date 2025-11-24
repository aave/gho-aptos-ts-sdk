import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../clients/aptosProvider";

/**
 * Represents the GhoAclManagerContract interface which defines the function addresses for managing ACL (Access Control List) roles and permissions
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO ACL manager's account address from the provider
 * - The module name (acl_manage)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const ghoAclManager = new GhoAclManagerContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoAclManagerContract {
  // Core role management functions
  hasRoleFuncAddr: MoveFunctionId;
  grantRoleFuncAddr: MoveFunctionId;
  renounceRoleFuncAddr: MoveFunctionId;
  revokeRoleFuncAddr: MoveFunctionId;
  defaultAdminRoleFuncAddr: MoveFunctionId;
  getRoleAdminFuncAddr: MoveFunctionId;
  setRoleAdminFuncAddr: MoveFunctionId;

  // Default admin functions
  isDefaultAdminFuncAddr: MoveFunctionId;
  addDefaultAdminFuncAddr: MoveFunctionId;
  renounceDefaultAdminFuncAddr: MoveFunctionId;

  // Facilitator manager functions
  getFacilitatorManagerRoleFuncAddr: MoveFunctionId;
  isFacilitatorManagerFuncAddr: MoveFunctionId;
  addFacilitatorManagerFuncAddr: MoveFunctionId;
  removeFacilitatorManagerFuncAddr: MoveFunctionId;

  // Bucket manager functions
  getBucketManagerRoleFuncAddr: MoveFunctionId;
  isBucketManagerFuncAddr: MoveFunctionId;
  addBucketManagerFuncAddr: MoveFunctionId;
  removeBucketManagerFuncAddr: MoveFunctionId;

  // Configurator functions
  getConfiguratorRoleFuncAddr: MoveFunctionId;
  isConfiguratorFuncAddr: MoveFunctionId;
  addConfiguratorFuncAddr: MoveFunctionId;
  removeConfiguratorFuncAddr: MoveFunctionId;

  // Token rescuer functions
  getTokenRescuerRoleFuncAddr: MoveFunctionId;
  isTokenRescuerFuncAddr: MoveFunctionId;
  addTokenRescuerFuncAddr: MoveFunctionId;
  removeTokenRescuerFuncAddr: MoveFunctionId;

  // Swap freezer functions
  getSwapFreezerRoleFuncAddr: MoveFunctionId;
  isSwapFreezerFuncAddr: MoveFunctionId;
  addSwapFreezerFuncAddr: MoveFunctionId;
  removeSwapFreezerFuncAddr: MoveFunctionId;

  // Liquidator functions
  getLiquidatorRoleFuncAddr: MoveFunctionId;
  isLiquidatorFuncAddr: MoveFunctionId;
  addLiquidatorFuncAddr: MoveFunctionId;
  removeLiquidatorFuncAddr: MoveFunctionId;

  // Direct pool minter functions
  getDirectPoolMinterRoleFuncAddr: MoveFunctionId;
  isDirectPoolMinterFuncAddr: MoveFunctionId;
  addDirectPoolMinterFuncAddr: MoveFunctionId;
  removeDirectPoolMinterFuncAddr: MoveFunctionId;

  // Risk council functions
  getRiskCouncilRoleFuncAddr: MoveFunctionId;
  addRiskCouncilFuncAddr: MoveFunctionId;
  removeRiskCouncilFuncAddr: MoveFunctionId;

  // GHO guardian functions
  getGhoGuardianRoleFuncAddr: MoveFunctionId;
  isGhoGuardianFuncAddr: MoveFunctionId;
  addGhoGuardianFuncAddr: MoveFunctionId;
  removeGhoGuardianFuncAddr: MoveFunctionId;

  // Risk admin functions
  getRiskAdminRoleFuncAddr: MoveFunctionId;
  isRiskAdminFuncAddr: MoveFunctionId;
  addRiskAdminFuncAddr: MoveFunctionId;
  removeRiskAdminFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoAclManager = provider.getProfileAddressByName(
      GHO_PROFILES.GHO_ACL,
    );
    const GhoAclManagerAccountAddress = GhoAclManager.toString();

    // Core role management functions
    this.hasRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::has_role`;
    this.grantRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::grant_role`;
    this.renounceRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::renounce_role`;
    this.revokeRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::revoke_role`;
    this.defaultAdminRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::default_admin_role`;
    this.getRoleAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_role_admin`;
    this.setRoleAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::set_role_admin`;

    // Default admin functions
    this.isDefaultAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_default_admin`;
    this.addDefaultAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_default_admin`;
    this.renounceDefaultAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::renounce_default_admin`;

    // Facilitator manager functions
    this.getFacilitatorManagerRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_facilitator_manager_role`;
    this.isFacilitatorManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_facilitator_manager`;
    this.addFacilitatorManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_facilitator_manager`;
    this.removeFacilitatorManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_facilitator_manager`;

    // Bucket manager functions
    this.getBucketManagerRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_bucket_manager_role`;
    this.isBucketManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_bucket_manager`;
    this.addBucketManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_bucket_manager`;
    this.removeBucketManagerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_bucket_manager`;

    // Configurator functions
    this.getConfiguratorRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_configurator_role`;
    this.isConfiguratorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_configurator`;
    this.addConfiguratorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_configurator`;
    this.removeConfiguratorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_configurator`;

    // Token rescuer functions
    this.getTokenRescuerRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_token_rescuer_role`;
    this.isTokenRescuerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_token_rescuer`;
    this.addTokenRescuerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_token_rescuer`;
    this.removeTokenRescuerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_token_rescuer`;

    // Swap freezer functions
    this.getSwapFreezerRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_swap_freezer_role`;
    this.isSwapFreezerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_swap_freezer`;
    this.addSwapFreezerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_swap_freezer`;
    this.removeSwapFreezerFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_swap_freezer`;

    // Liquidator functions
    this.getLiquidatorRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_liquidator_role`;
    this.isLiquidatorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_liquidator`;
    this.addLiquidatorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_liquidator`;
    this.removeLiquidatorFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_liquidator`;

    // Direct pool minter functions
    this.getDirectPoolMinterRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_direct_pool_minter_role`;
    this.isDirectPoolMinterFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_direct_pool_minter`;
    this.addDirectPoolMinterFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_direct_pool_minter`;
    this.removeDirectPoolMinterFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_direct_pool_minter`;

    // Risk council functions
    this.getRiskCouncilRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_risk_council_role`;
    this.addRiskCouncilFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_risk_council`;
    this.removeRiskCouncilFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_risk_council`;

    // GHO guardian functions
    this.getGhoGuardianRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_gho_guardian_role`;
    this.isGhoGuardianFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_gho_guardian`;
    this.addGhoGuardianFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_gho_guardian`;
    this.removeGhoGuardianFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_gho_guardian`;

    // Risk admin functions
    this.getRiskAdminRoleFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::get_risk_admin_role`;
    this.isRiskAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::is_risk_admin`;
    this.addRiskAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::add_risk_admin`;
    this.removeRiskAdminFuncAddr = `${GhoAclManagerAccountAddress}::acl_manage::remove_risk_admin`;
  }
}

// GHO-specific role constants
export const FACILITATOR_MANAGER_ROLE = "FACILITATOR_MANAGER_ROLE";
export const BUCKET_MANAGER_ROLE = "BUCKET_MANAGER_ROLE";
export const CONFIGURATOR_ROLE = "CONFIGURATOR_ROLE";
export const TOKEN_RESCUER_ROLE = "TOKEN_RESCUER_ROLE";
export const SWAP_FREEZER_ROLE = "SWAP_FREEZER_ROLE";
export const LIQUIDATOR_ROLE = "LIQUIDATOR_ROLE";
export const DIRECT_POOL_MINTER_ROLE = "DIRECT_POOL_MINTER_ROLE";
export const RISK_COUNCIL_ROLE = "RISK_COUNCIL_ROLE";
export const GHO_GUARDIAN_ROLE = "GHO_GUARDIAN_ROLE";
export const RISK_ADMIN_ROLE = "RISK_ADMIN_ROLE";
