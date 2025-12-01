import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GhoBurnMintTokenPoolConfiguratorContract interface which defines the function addresses
 * for managing the GHO burn/mint token pool configurator operations within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gho_burn_mint_token_pool_configurator)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const configurator = new GhoBurnMintTokenPoolConfiguratorContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GhoBurnMintTokenPoolConfiguratorContract {
  // Pool Initialization
  initPoolFuncAddr: MoveFunctionId;
  configurePoolFuncAddr: MoveFunctionId;

  // Configuration Updates
  setCounterpartAndApplyFuncAddr: MoveFunctionId;
  setInboundLimitsFuncAddr: MoveFunctionId;

  // Pause/Resume Operations
  pauseInboundFuncAddr: MoveFunctionId;
  resumeInboundFuncAddr: MoveFunctionId;

  // View Functions
  typeAndVersionFuncAddr: MoveFunctionId;
  getStoreAddressFuncAddr: MoveFunctionId;
  getRemoteChainEntitiesFuncAddr: MoveFunctionId;
  isPoolInitializedFuncAddr: MoveFunctionId;
  getConfigSummaryFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // Pool Initialization
    this.initPoolFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::init_pool`;
    this.configurePoolFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::configure_pool`;

    // Configuration Updates
    this.setCounterpartAndApplyFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::set_counterpart_and_apply`;
    this.setInboundLimitsFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::set_inbound_limits`;

    // Pause/Resume Operations
    this.pauseInboundFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::pause_inbound`;
    this.resumeInboundFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::resume_inbound`;

    // View Functions
    this.typeAndVersionFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::type_and_version`;
    this.getStoreAddressFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::get_store_address`;
    this.getRemoteChainEntitiesFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::get_remote_chain_entities`;
    this.isPoolInitializedFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::is_pool_initialized`;
    this.getConfigSummaryFuncAddr = `${GhoModuleAccountAddress}::gho_burn_mint_token_pool_configurator::get_config_summary`;
  }
}
