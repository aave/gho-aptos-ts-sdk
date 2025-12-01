import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoBurnMintTokenPoolContract interface which defines the function addresses
 * for managing the GHO burn/mint token pool operations within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_burn_mint_token_pool)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const tokenPool = new GhoBurnMintTokenPoolContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoBurnMintTokenPoolContract {
  // Initialization
  startInitializeFuncAddr: MoveFunctionId;

  // Remote Pool Management
  addRemotePoolFuncAddr: MoveFunctionId;
  removeRemotePoolFuncAddr: MoveFunctionId;
  applyChainUpdatesFuncAddr: MoveFunctionId;

  // Allowlist Management
  applyAllowlistUpdatesFuncAddr: MoveFunctionId;

  // Rate Limiter Configuration
  setChainRateLimiterConfigFuncAddr: MoveFunctionId;
  setChainRateLimiterConfigsFuncAddr: MoveFunctionId;

  // Ownership Management
  transferOwnershipFuncAddr: MoveFunctionId;
  acceptOwnershipFuncAddr: MoveFunctionId;
  executeOwnershipTransferFuncAddr: MoveFunctionId;

  // Ref Migration
  migrateMintRefFuncAddr: MoveFunctionId;
  migrateBurnRefFuncAddr: MoveFunctionId;
  setMintRefFuncAddr: MoveFunctionId;
  setBurnRefFuncAddr: MoveFunctionId;

  // View Functions - Pool Info
  typeAndVersionFuncAddr: MoveFunctionId;
  getTokenFuncAddr: MoveFunctionId;
  getRouterFuncAddr: MoveFunctionId;
  getTokenDecimalsFuncAddr: MoveFunctionId;
  getStoreAddressFuncAddr: MoveFunctionId;

  // View Functions - Remote Mapping
  getRemotePoolsFuncAddr: MoveFunctionId;
  isRemotePoolFuncAddr: MoveFunctionId;
  getRemoteTokenFuncAddr: MoveFunctionId;
  isSupportedChainFuncAddr: MoveFunctionId;
  getSupportedChainsFuncAddr: MoveFunctionId;
  getRemoteMappingFuncAddr: MoveFunctionId;

  // View Functions - Allowlist
  getAllowlistEnabledFuncAddr: MoveFunctionId;
  getAllowlistFuncAddr: MoveFunctionId;

  // View Functions - Rate Limiter
  getCurrentInboundRateLimiterStateFuncAddr: MoveFunctionId;
  getCurrentOutboundRateLimiterStateFuncAddr: MoveFunctionId;

  // View Functions - Ownership
  ownerFuncAddr: MoveFunctionId;
  hasPendingTransferFuncAddr: MoveFunctionId;
  pendingTransferFromFuncAddr: MoveFunctionId;
  pendingTransferToFuncAddr: MoveFunctionId;
  pendingTransferAcceptedFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // Initialization
    this.startInitializeFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::start_initialize`;

    // Remote Pool Management
    this.addRemotePoolFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::add_remote_pool`;
    this.removeRemotePoolFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::remove_remote_pool`;
    this.applyChainUpdatesFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::apply_chain_updates`;

    // Allowlist Management
    this.applyAllowlistUpdatesFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::apply_allowlist_updates`;

    // Rate Limiter Configuration
    this.setChainRateLimiterConfigFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::set_chain_rate_limiter_config`;
    this.setChainRateLimiterConfigsFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::set_chain_rate_limiter_configs`;

    // Ownership Management
    this.transferOwnershipFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::transfer_ownership`;
    this.acceptOwnershipFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::accept_ownership`;
    this.executeOwnershipTransferFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::execute_ownership_transfer`;

    // Ref Migration
    this.migrateMintRefFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::migrate_mint_ref`;
    this.migrateBurnRefFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::migrate_burn_ref`;
    this.setMintRefFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::set_mint_ref`;
    this.setBurnRefFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::set_burn_ref`;

    // View Functions - Pool Info
    this.typeAndVersionFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::type_and_version`;
    this.getTokenFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_token`;
    this.getRouterFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_router`;
    this.getTokenDecimalsFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_token_decimals`;
    this.getStoreAddressFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_store_address`;

    // View Functions - Remote Mapping
    this.getRemotePoolsFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_remote_pools`;
    this.isRemotePoolFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::is_remote_pool`;
    this.getRemoteTokenFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_remote_token`;
    this.isSupportedChainFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::is_supported_chain`;
    this.getSupportedChainsFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_supported_chains`;
    this.getRemoteMappingFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_remote_mapping`;

    // View Functions - Allowlist
    this.getAllowlistEnabledFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_allowlist_enabled`;
    this.getAllowlistFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_allowlist`;

    // View Functions - Rate Limiter
    this.getCurrentInboundRateLimiterStateFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_current_inbound_rate_limiter_state`;
    this.getCurrentOutboundRateLimiterStateFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::get_current_outbound_rate_limiter_state`;

    // View Functions - Ownership
    this.ownerFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::owner`;
    this.hasPendingTransferFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::has_pending_transfer`;
    this.pendingTransferFromFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::pending_transfer_from`;
    this.pendingTransferToFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::pending_transfer_to`;
    this.pendingTransferAcceptedFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool::pending_transfer_accepted`;
  }
}
