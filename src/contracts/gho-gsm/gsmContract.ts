import { MoveFunctionId } from "@aptos-labs/ts-sdk";
import { GHO_PROFILES, GhoProvider } from "../../clients/aptosProvider";

/**
 * Represents the GsmManagerContract interface which defines the function addresses for managing GSM (Gho Stability Module)
 * operations within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This interface is used by the corresponding client classes to make actual calls to the blockchain.
 * The constructor initializes all function addresses by combining:
 * - The GHO module's account address from the provider
 * - The module name (gsm)
 * - The specific function name
 *
 * @example
 * ```typescript
 * const provider = new GhoProvider();
 * const gsmManager = new GsmManagerContract(provider);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 */
export class GsmManagerContract {
  // GSM Creation
  createAndInitializeGsmFuncAddr: MoveFunctionId;

  // Fee Strategy Management
  createAndSetFeeStrategyFuncAddr: MoveFunctionId;
  updateFeeStrategyFuncAddr: MoveFunctionId;

  // Asset Trading
  buyAssetFuncAddr: MoveFunctionId;
  sellAssetFuncAddr: MoveFunctionId;

  // Emergency Operations
  rescueTokensFuncAddr: MoveFunctionId;
  setSwapFreezeFuncAddr: MoveFunctionId;
  seizeFuncAddr: MoveFunctionId;
  burnAfterSeizeFuncAddr: MoveFunctionId;

  // Configuration Updates
  updateExposureCapFuncAddr: MoveFunctionId;
  updateGhoTreasuryFuncAddr: MoveFunctionId;
  updateGhoReserveFuncAddr: MoveFunctionId;
  updatePriceRatioFuncAddr: MoveFunctionId;

  // Fee Distribution
  distributeFeesToTreasuryFuncAddr: MoveFunctionId;

  // View Functions - Buy/Sell Calculations
  getAssetAmountForBuyAssetFuncAddr: MoveFunctionId;
  getAssetAmountForSellAssetFuncAddr: MoveFunctionId;
  getGhoAmountForSellAssetFuncAddr: MoveFunctionId;
  getGhoAmountForBuyAssetFuncAddr: MoveFunctionId;

  // View Functions - State Getters
  getExposureCapFuncAddr: MoveFunctionId;
  getCurrentExposureFuncAddr: MoveFunctionId;
  getFeeStrategyObjectFuncAddr: MoveFunctionId;
  getPriceStrategyObjectFuncAddr: MoveFunctionId;
  getAccruedFeesFuncAddr: MoveFunctionId;
  getIsFrozenFuncAddr: MoveFunctionId;
  getIsSeizedFuncAddr: MoveFunctionId;
  canSwapFuncAddr: MoveFunctionId;
  getGhoTreasuryFuncAddr: MoveFunctionId;
  getRemainingExposureFuncAddr: MoveFunctionId;
  getFeeStoreFuncAddr: MoveFunctionId;
  getPriceRatioFuncAddr: MoveFunctionId;
  getUnderlyingAssetFuncAddr: MoveFunctionId;
  getUnderlyingAssetDecimalsFuncAddr: MoveFunctionId;
  getGhoTokenFuncAddr: MoveFunctionId;
  getUsedFuncAddr: MoveFunctionId;
  getUsageFuncAddr: MoveFunctionId;
  getLimitFuncAddr: MoveFunctionId;
  getGhoReserveAddressFuncAddr: MoveFunctionId;
  getGsmByAssetAndLabelFuncAddr: MoveFunctionId;
  gsmExistsFuncAddr: MoveFunctionId;

  constructor(provider: GhoProvider) {
    const GhoModule = provider.getProfileAddressByName(GHO_PROFILES.GHO);
    const GhoModuleAccountAddress = GhoModule.toString();

    // GSM Creation
    this.createAndInitializeGsmFuncAddr = `${GhoModuleAccountAddress}::gsm::create_and_initialize_gsm`;

    // Fee Strategy Management
    this.createAndSetFeeStrategyFuncAddr = `${GhoModuleAccountAddress}::gsm::create_and_set_fee_strategy`;
    this.updateFeeStrategyFuncAddr = `${GhoModuleAccountAddress}::gsm::update_fee_strategy`;

    // Asset Trading
    this.buyAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::buy_asset`;
    this.sellAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::sell_asset`;

    // Emergency Operations
    this.rescueTokensFuncAddr = `${GhoModuleAccountAddress}::gsm::rescue_tokens`;
    this.setSwapFreezeFuncAddr = `${GhoModuleAccountAddress}::gsm::set_swap_freeze`;
    this.seizeFuncAddr = `${GhoModuleAccountAddress}::gsm::seize`;
    this.burnAfterSeizeFuncAddr = `${GhoModuleAccountAddress}::gsm::burn_after_seize`;

    // Configuration Updates
    this.updateExposureCapFuncAddr = `${GhoModuleAccountAddress}::gsm::update_exposure_cap`;
    this.updateGhoTreasuryFuncAddr = `${GhoModuleAccountAddress}::gsm::update_gho_treasury`;
    this.updateGhoReserveFuncAddr = `${GhoModuleAccountAddress}::gsm::update_gho_reserve`;
    this.updatePriceRatioFuncAddr = `${GhoModuleAccountAddress}::gsm::update_price_ratio`;

    // Fee Distribution
    this.distributeFeesToTreasuryFuncAddr = `${GhoModuleAccountAddress}::gsm::distribute_fees_to_treasury`;

    // View Functions - Buy/Sell Calculations
    this.getAssetAmountForBuyAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::get_asset_amount_for_buy_asset`;
    this.getAssetAmountForSellAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::get_asset_amount_for_sell_asset`;
    this.getGhoAmountForSellAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gho_amount_for_sell_asset`;
    this.getGhoAmountForBuyAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gho_amount_for_buy_asset`;

    // View Functions - State Getters
    this.getExposureCapFuncAddr = `${GhoModuleAccountAddress}::gsm::get_exposure_cap`;
    this.getCurrentExposureFuncAddr = `${GhoModuleAccountAddress}::gsm::get_current_exposure`;
    this.getFeeStrategyObjectFuncAddr = `${GhoModuleAccountAddress}::gsm::get_fee_strategy_object`;
    this.getPriceStrategyObjectFuncAddr = `${GhoModuleAccountAddress}::gsm::get_price_strategy_object`;
    this.getAccruedFeesFuncAddr = `${GhoModuleAccountAddress}::gsm::get_accrued_fees`;
    this.getIsFrozenFuncAddr = `${GhoModuleAccountAddress}::gsm::get_is_frozen`;
    this.getIsSeizedFuncAddr = `${GhoModuleAccountAddress}::gsm::get_is_seized`;
    this.canSwapFuncAddr = `${GhoModuleAccountAddress}::gsm::can_swap`;
    this.getGhoTreasuryFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gho_treasury`;
    this.getRemainingExposureFuncAddr = `${GhoModuleAccountAddress}::gsm::get_remaining_exposure`;
    this.getFeeStoreFuncAddr = `${GhoModuleAccountAddress}::gsm::get_fee_store`;
    this.getPriceRatioFuncAddr = `${GhoModuleAccountAddress}::gsm::get_price_ratio`;
    this.getUnderlyingAssetFuncAddr = `${GhoModuleAccountAddress}::gsm::get_underlying_asset`;
    this.getUnderlyingAssetDecimalsFuncAddr = `${GhoModuleAccountAddress}::gsm::get_underlying_asset_decimals`;
    this.getGhoTokenFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gho_token`;
    this.getUsedFuncAddr = `${GhoModuleAccountAddress}::gsm::get_used`;
    this.getUsageFuncAddr = `${GhoModuleAccountAddress}::gsm::get_usage`;
    this.getLimitFuncAddr = `${GhoModuleAccountAddress}::gsm::get_limit`;
    this.getGhoReserveAddressFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gho_reserve_address`;
    this.getGsmByAssetAndLabelFuncAddr = `${GhoModuleAccountAddress}::gsm::get_gsm_by_asset_and_label`;
    this.gsmExistsFuncAddr = `${GhoModuleAccountAddress}::gsm::gsm_exists`;
  }
}
