import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GsmManagerContract } from "../../contracts/gho-gsm/gsmContract";
import { GhoProvider } from "../aptosProvider";

export type GsmConfiguration = {
  exposureCap: bigint;
  currentExposure: bigint;
  remainingExposure: bigint;
  priceRatio: bigint;
  ghoTreasury: AccountAddress;
  underlyingAsset: AccountAddress;
  underlyingDecimals: number;
  ghoToken: AccountAddress;
  ghoReserve: AccountAddress;
  isFrozen: boolean;
  isSeized: boolean;
  canSwap: boolean;
};

export type TradeCalculation = {
  assetAmount: bigint;
  ghoAmount: bigint;
  grossGho: bigint;
  fee: bigint;
};

export type GsmDetails = {
  config: GsmConfiguration;
  accruedFees: bigint;
  feeStrategy: AccountAddress;
  priceStrategy: AccountAddress;
  feeStore: AccountAddress;
  used: bigint;
  usage: { limit: bigint; usage: bigint };
  limit: bigint;
};

/**
 * Represents the GsmClient class which provides methods to interact with the GSM (Gho Stability Module) contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides a comprehensive set of methods for managing GSM operations,
 * including creating GSMs, buying/selling assets, managing fee strategies, updating configurations, and querying state.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const gsmClient = GsmClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const gsmClient = new GsmClient(provider, signer);
 *
 * // Create a new GSM
 * await gsmClient.createAndInitializeGsm(
 *   ghoToken,
 *   ghoReserve,
 *   underlyingAsset,
 *   ghoTreasury,
 *   exposureCap,
 *   priceRatio,
 *   gsmLabel,
 *   priceStrategyName
 * );
 *
 * // Buy assets using GHO
 * await gsmClient.buyAsset(gsmAddress, minAmount, maxGhoAmount, receiver);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GsmClient extends AptosContractWrapperBaseClass {
  GsmManagerContract: GsmManagerContract;

  /**
   * Constructs an instance of GsmClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GsmManagerContract = new GsmManagerContract(provider);
  }

  /**
   * Creates an instance of GsmClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GsmClient.
   * @returns A new instance of GsmClient.
   */
  public static buildWithDefaultSigner(provider: GhoProvider): GsmClient {
    const client = new GsmClient(provider, provider.getGhoProfileAccount());
    return client;
  }

  /**
   * Creates and initializes a new GSM (Gho Stability Module) for a specific underlying asset and GHO token.
   * @param ghoToken The address of the GHO token contract
   * @param ghoReserve The address of the GHO reserve
   * @param underlyingAsset The address of the underlying asset (e.g., USDC, USDT)
   * @param ghoTreasury The address where GHO tokens will be held for this GSM
   * @param exposureCap The maximum amount of underlying asset that can be traded (in underlying asset units)
   * @param priceRatio The fixed price ratio between GHO and the underlying asset (in GHO per underlying asset units)
   * @param gsmLabel The label for the GSM
   * @param priceStrategyName The name for the price strategy object
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async createAndInitializeGsm(
    ghoToken: AccountAddress,
    ghoReserve: AccountAddress,
    underlyingAsset: AccountAddress,
    ghoTreasury: AccountAddress,
    exposureCap: bigint,
    priceRatio: bigint,
    gsmLabel: Uint8Array,
    priceStrategyName: Uint8Array,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.createAndInitializeGsmFuncAddr,
      [
        ghoToken.toString(),
        ghoReserve.toString(),
        underlyingAsset.toString(),
        ghoTreasury.toString(),
        exposureCap.toString(),
        priceRatio.toString(),
        gsmLabel,
        priceStrategyName,
      ],
    );
  }

  /**
   * Creates and sets a fee strategy for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param feeStrategyName The name for the new fee strategy object
   * @param buyFeeBps The buy fee in basis points
   * @param sellFeeBps The sell fee in basis points
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async createAndSetFeeStrategy(
    gsmAddress: AccountAddress,
    feeStrategyName: Uint8Array,
    buyFeeBps: bigint,
    sellFeeBps: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.createAndSetFeeStrategyFuncAddr,
      [
        gsmAddress.toString(),
        feeStrategyName,
        buyFeeBps.toString(),
        sellFeeBps.toString(),
      ],
    );
  }

  /**
   * Updates the fee strategy for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param feeStrategyName The name for the new fee strategy object
   * @param newBuyBps The new buy fee in basis points
   * @param newSellBps The new sell fee in basis points
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateFeeStrategy(
    gsmAddress: AccountAddress,
    feeStrategyName: Uint8Array,
    newBuyBps: bigint,
    newSellBps: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.updateFeeStrategyFuncAddr,
      [
        gsmAddress.toString(),
        feeStrategyName,
        newBuyBps.toString(),
        newSellBps.toString(),
      ],
    );
  }

  /**
   * Allows users to buy underlying assets using GHO tokens.
   * @param gsmAddress The address of the GSM to buy from
   * @param minAmount The minimum amount of underlying asset to receive (in underlying asset units)
   * @param maxGhoAmount The maximum amount of GHO to spend (in GHO units)
   * @param receiver The address to receive the underlying asset
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async buyAsset(
    gsmAddress: AccountAddress,
    minAmount: bigint,
    maxGhoAmount: bigint,
    receiver: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.buyAssetFuncAddr,
      [
        gsmAddress.toString(),
        minAmount.toString(),
        maxGhoAmount.toString(),
        receiver.toString(),
      ],
    );
  }

  /**
   * Validates if the minAmount of underlying asset is achievable given the maxGhoAmount to spend.
   * This is useful for frontend validation before submitting a transaction.
   *
   * @param gsmAddress The address of the GSM
   * @param minAmount The minimum amount of underlying asset user expects to receive
   * @param maxGhoAmount The maximum amount of GHO user is willing to spend
   * @returns A promise that resolves to a validation result object containing:
   *   - isValid: boolean indicating if the trade is valid
   *   - reason: string explaining why validation failed (only present if isValid is false)
   *   - expectedAssetAmount: the actual underlying asset amount user will receive
   *   - totalGhoWithFee: the total GHO amount that will be spent (including fees)
   *   - slippageBps: the slippage in basis points (difference between expected and actual)
   * @throws Error with descriptive message if validation fails
   */
  public async validateBuyAsset(
    gsmAddress: AccountAddress,
    minAmount: bigint,
    maxGhoAmount: bigint,
  ): Promise<{
    isValid: boolean;
    reason?: string;
    expectedAssetAmount: bigint;
    totalGhoWithFee: bigint;
    fee: bigint;
    slippageBps: bigint;
  }> {
    // Get the actual asset amount user will receive for the given GHO amount
    const calculation = await this.getAssetAmountForBuyAsset(
      gsmAddress,
      maxGhoAmount,
    );

    const expectedAssetAmount = calculation.assetAmount;
    const totalGhoWithFee = calculation.ghoAmount;
    const fee = calculation.fee;

    // Calculate slippage in basis points
    // Slippage = (minAmount - expectedAssetAmount) / minAmount * 10000
    const slippageBps =
      minAmount > 0n
        ? ((minAmount - expectedAssetAmount) * 10000n) / minAmount
        : 0n;

    const hasEnoughAsset = expectedAssetAmount >= minAmount;
    const isWithinBudget = totalGhoWithFee <= maxGhoAmount;

    if (!hasEnoughAsset) {
      const slippagePercent = Number(slippageBps) / 100;
      const reason = `Expected ${minAmount.toString()} underlying asset, but will only receive ${expectedAssetAmount.toString()} (${slippagePercent.toFixed(2)}% slippage)`;
      throw new Error(reason);
    }

    if (!isWithinBudget) {
      const excessBps =
        ((totalGhoWithFee - maxGhoAmount) * 10000n) / maxGhoAmount;
      const excessPercent = Number(excessBps) / 100;
      const reason = `Expected to spend max ${maxGhoAmount.toString()} GHO, but will need ${totalGhoWithFee.toString()} GHO (${excessPercent.toFixed(2)}% over budget)`;
      throw new Error(reason);
    }

    return {
      isValid: true,
      expectedAssetAmount,
      totalGhoWithFee,
      fee,
      slippageBps,
    };
  }

  /**
   * Allows users to sell underlying assets for GHO tokens.
   * @param gsmAddress The address of the GSM to sell to
   * @param maxAmount The maximum amount of underlying asset to sell (in underlying asset units)
   * @param minGhoAmount The minimum amount of GHO to receive (in GHO units)
   * @param receiver The address to receive the GHO tokens
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async sellAsset(
    gsmAddress: AccountAddress,
    maxAmount: bigint,
    minGhoAmount: bigint,
    receiver: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.sellAssetFuncAddr,
      [
        gsmAddress.toString(),
        maxAmount.toString(),
        minGhoAmount.toString(),
        receiver.toString(),
      ],
    );
  }

  /**
   * Validates if the minGhoAmount is achievable given the maxAmount of underlying asset to sell.
   * This is useful for frontend validation before submitting a transaction.
   *
   * @param gsmAddress The address of the GSM
   * @param maxAmount The maximum amount of underlying asset user wants to sell
   * @param minGhoAmount The minimum amount of GHO user expects to receive
   * @returns A promise that resolves to a validation result object containing:
   *   - isValid: boolean indicating if the trade is valid
   *   - reason: string explaining why validation failed (only present if isValid is false)
   *   - expectedGhoAmount: the actual GHO amount user will receive (after fees)
   *   - grossGhoAmount: the GHO amount before fees are deducted
   *   - fee: the fee amount that will be charged
   *   - slippageBps: the slippage in basis points (difference between expected and actual)
   * @throws Error with descriptive message if validation fails
   */
  public async validateSellAsset(
    gsmAddress: AccountAddress,
    maxAmount: bigint,
    minGhoAmount: bigint,
  ): Promise<{
    isValid: boolean;
    reason?: string;
    expectedGhoAmount: bigint;
    grossGhoAmount: bigint;
    fee: bigint;
    slippageBps: bigint;
  }> {
    // Get the actual GHO amount user will receive for the given asset amount
    const calculation = await this.getGhoAmountForSellAsset(
      gsmAddress,
      maxAmount,
    );

    const expectedGhoAmount = calculation.ghoAmount;
    const grossGhoAmount = calculation.grossGho;
    const fee = calculation.fee;

    // Calculate slippage in basis points
    // Slippage = (minGhoAmount - expectedGhoAmount) / minGhoAmount * 10000
    const slippageBps =
      minGhoAmount > 0n
        ? ((minGhoAmount - expectedGhoAmount) * 10000n) / minGhoAmount
        : 0n;

    // Validate: expected GHO amount should be >= minimum requested
    if (expectedGhoAmount < minGhoAmount) {
      const slippagePercent = Number(slippageBps) / 100;
      const reason = `Expected ${minGhoAmount.toString()} GHO, but will only receive ${expectedGhoAmount.toString()} GHO (${slippagePercent.toFixed(2)}% slippage)`;
      throw new Error(reason);
    }

    return {
      isValid: true,
      expectedGhoAmount,
      grossGhoAmount,
      fee,
      slippageBps,
    };
  }

  /**
   * Allows authorized rescuers to rescue tokens from a GSM.
   * @param gsmAddress The address of the GSM to rescue tokens from
   * @param token The address of the token to rescue
   * @param to The address to receive the rescued tokens
   * @param amount The amount of tokens to rescue
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async rescueTokens(
    gsmAddress: AccountAddress,
    token: AccountAddress,
    to: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.rescueTokensFuncAddr,
      [
        gsmAddress.toString(),
        token.toString(),
        to.toString(),
        amount.toString(),
      ],
    );
  }

  /**
   * Allows authorized swap freezers to freeze or unfreeze a GSM.
   * @param gsmAddress The address of the GSM to freeze/unfreeze
   * @param enable True to freeze, false to unfreeze
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setSwapFreeze(
    gsmAddress: AccountAddress,
    enable: boolean,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.setSwapFreezeFuncAddr,
      [gsmAddress.toString(), enable],
    );
  }

  /**
   * Seizes a GSM, stopping all operations and transferring assets to treasury.
   * @param gsmAddress The address of the GSM to seize
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async seize(
    gsmAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(this.GsmManagerContract.seizeFuncAddr, [
      gsmAddress.toString(),
    ]);
  }

  /**
   * Burns GHO tokens after the GSM has been seized.
   * @param gsmAddress The address of the GSM
   * @param amount The requested amount of GHO to burn
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async burnAfterSeize(
    gsmAddress: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.burnAfterSeizeFuncAddr,
      [gsmAddress.toString(), amount.toString()],
    );
  }

  /**
   * Updates the exposure cap for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param exposureCap The new exposure cap
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateExposureCap(
    gsmAddress: AccountAddress,
    exposureCap: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.updateExposureCapFuncAddr,
      [gsmAddress.toString(), exposureCap.toString()],
    );
  }

  /**
   * Updates the GHO treasury for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param newGhoTreasury The new GHO treasury address
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoTreasury(
    gsmAddress: AccountAddress,
    newGhoTreasury: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.updateGhoTreasuryFuncAddr,
      [gsmAddress.toString(), newGhoTreasury.toString()],
    );
  }

  /**
   * Updates the GHO reserve for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param newGhoReserve The new GHO reserve address
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoReserve(
    gsmAddress: AccountAddress,
    newGhoReserve: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.updateGhoReserveFuncAddr,
      [gsmAddress.toString(), newGhoReserve.toString()],
    );
  }

  /**
   * Updates the price ratio for a GSM.
   * @param gsmAddress The address of the GSM to update
   * @param priceStrategyName The name for the new price strategy object
   * @param newPriceRatio The new price ratio
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updatePriceRatio(
    gsmAddress: AccountAddress,
    priceStrategyName: Uint8Array,
    newPriceRatio: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.updatePriceRatioFuncAddr,
      [gsmAddress.toString(), priceStrategyName, newPriceRatio.toString()],
    );
  }

  /**
   * Distributes accrued fees to the GHO treasury.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async distributeFeesToTreasury(
    gsmAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmManagerContract.distributeFeesToTreasuryFuncAddr,
      [gsmAddress.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Updated View Functions with custom types
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the asset amount for a given buy asset operation.
   * @param gsmAddress The address of the GSM
   * @param maxGhoAmount The maximum amount of GHO to spend
   * @returns A promise that resolves to a tuple of (asset_amount, total_gho_with_fee, gross_gho, fee)
   */
  public async getAssetAmountForBuyAsset(
    gsmAddress: AccountAddress,
    maxGhoAmount: bigint,
  ): Promise<TradeCalculation> {
    const [assetAmount, totalGhoWithFee, grossGho, fee] =
      await this.callViewMethod(
        this.GsmManagerContract.getAssetAmountForBuyAssetFuncAddr,
        [gsmAddress, maxGhoAmount],
      );
    return {
      assetAmount: BigInt(assetAmount as string),
      ghoAmount: BigInt(totalGhoWithFee as string),
      grossGho: BigInt(grossGho as string),
      fee: BigInt(fee as string),
    };
  }

  /**
   * Gets the asset amount for a given sell asset operation.
   * @param gsmAddress The address of the GSM
   * @param minGhoAmount The minimum amount of GHO the user must receive
   * @returns A promise that resolves to a tuple of (asset_amount, net_gho, gross_gho, fee)
   */
  public async getAssetAmountForSellAsset(
    gsmAddress: AccountAddress,
    minGhoAmount: bigint,
  ): Promise<TradeCalculation> {
    const [assetAmount, netGho, grossGho, fee] = await this.callViewMethod(
      this.GsmManagerContract.getAssetAmountForSellAssetFuncAddr,
      [gsmAddress, minGhoAmount],
    );
    return {
      assetAmount: BigInt(assetAmount.toString()),
      ghoAmount: BigInt(netGho.toString()),
      grossGho: BigInt(grossGho.toString()),
      fee: BigInt(fee.toString()),
    };
  }

  /**
   * Gets the GHO amount for a given sell asset operation.
   * @param gsmAddress The address of the GSM
   * @param maxAssetAmount The maximum amount of asset to sell
   * @returns A promise that resolves to a tuple of (asset_amount, net_gho, gross_gho, fee)
   */
  public async getGhoAmountForSellAsset(
    gsmAddress: AccountAddress,
    maxAssetAmount: bigint,
  ): Promise<TradeCalculation> {
    const [assetAmount, netGho, grossGho, fee] = await this.callViewMethod(
      this.GsmManagerContract.getGhoAmountForSellAssetFuncAddr,
      [gsmAddress, maxAssetAmount],
    );
    return {
      assetAmount: BigInt(assetAmount.toString()),
      ghoAmount: BigInt(netGho.toString()),
      grossGho: BigInt(grossGho.toString()),
      fee: BigInt(fee.toString()),
    };
  }

  /**
   * Gets the GHO amount for a given buy asset operation.
   * @param gsmAddress The address of the GSM
   * @param minAssetAmount The minimum amount of asset to buy
   * @returns A promise that resolves to a tuple of (asset_amount, net_gho, gross_gho, fee)
   */
  public async getGhoAmountForBuyAsset(
    gsmAddress: AccountAddress,
    minAssetAmount: bigint,
  ): Promise<TradeCalculation> {
    const [assetAmount, netGho, grossGho, fee] = await this.callViewMethod(
      this.GsmManagerContract.getGhoAmountForBuyAssetFuncAddr,
      [gsmAddress, minAssetAmount],
    );
    return {
      assetAmount: BigInt(assetAmount.toString()),
      ghoAmount: BigInt(netGho.toString()),
      grossGho: BigInt(grossGho.toString()),
      fee: BigInt(fee.toString()),
    };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions - State Getters
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the exposure cap for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the exposure cap as U128.
   */
  public async getExposureCap(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getExposureCapFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the current exposure for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the current exposure as U128.
   */
  public async getCurrentExposure(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getCurrentExposureFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the fee strategy object for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the fee strategy object address.
   */
  public async getFeeStrategyAddress(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getFeeStrategyObjectFuncAddr,
      [gsmAddress],
    );
    // The response is an object with structure { inner: "0x..." }
    // Extract the inner address and convert to AccountAddress
    if (typeof resp === "object" && resp !== null && "inner" in resp) {
      return AccountAddress.fromString((resp as any).inner);
    }
    // Fallback: if it's already a string, convert directly
    return AccountAddress.fromString(resp as string);
  }

  /**
   * Gets the price strategy object for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the price strategy object address.
   */
  public async getPriceStrategyAddress(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getPriceStrategyObjectFuncAddr,
      [gsmAddress],
    );
    // The response is an object with structure { inner: "0x..." }
    // Extract the inner address and convert to AccountAddress
    if (typeof resp === "object" && resp !== null && "inner" in resp) {
      return AccountAddress.fromString((resp as any).inner);
    }
    // Fallback: if it's already a string, convert directly
    return AccountAddress.fromString(resp as string);
  }

  /**
   * Gets the accrued fees for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the accrued fees as U256.
   */
  public async getAccruedFees(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getAccruedFeesFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets if a given GSM is frozen.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to a boolean indicating if the GSM is frozen.
   */
  public async getIsFrozen(gsmAddress: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getIsFrozenFuncAddr,
      [gsmAddress],
    );
    return resp as boolean;
  }

  /**
   * Gets if a given GSM is seized.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to a boolean indicating if the GSM is seized.
   */
  public async getIsSeized(gsmAddress: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getIsSeizedFuncAddr,
      [gsmAddress],
    );
    return resp as boolean;
  }

  /**
   * Gets if a given GSM can swap.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to a boolean indicating if the GSM can swap.
   */
  public async canSwap(gsmAddress: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.canSwapFuncAddr,
      [gsmAddress],
    );
    return resp as boolean;
  }

  /**
   * Gets the GHO treasury for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the GHO treasury address.
   */
  public async getGhoTreasury(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getGhoTreasuryFuncAddr,
      [gsmAddress],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Gets the remaining exposure for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the remaining exposure as U128.
   */
  public async getRemainingExposure(
    gsmAddress: AccountAddress,
  ): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getRemainingExposureFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the fee store for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the fee store address.
   */
  public async getFeeStore(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getFeeStoreFuncAddr,
      [gsmAddress],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Gets the price ratio for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the price ratio as U256.
   */
  public async getPriceRatio(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getPriceRatioFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the underlying asset for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the underlying asset address.
   */
  public async getUnderlyingAsset(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getUnderlyingAssetFuncAddr,
      [gsmAddress],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Gets the underlying asset decimals for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the underlying asset decimals as U8.
   */
  public async getUnderlyingAssetDecimals(
    gsmAddress: AccountAddress,
  ): Promise<number> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getUnderlyingAssetDecimalsFuncAddr,
      [gsmAddress],
    );
    return Number(resp as number);
  }

  /**
   * Gets the GHO token for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the GHO token address.
   */
  public async getGhoToken(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getGhoTokenFuncAddr,
      [gsmAddress],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Gets the used amount for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the used amount as U256.
   */
  public async getUsed(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getUsedFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the usage and limit for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to a tuple of (limit, usage) as U256.
   */
  public async getUsage(
    gsmAddress: AccountAddress,
  ): Promise<{ limit: bigint; usage: bigint }> {
    const [limit, usage] = await this.callViewMethod(
      this.GsmManagerContract.getUsageFuncAddr,
      [gsmAddress],
    );
    return { limit: BigInt(limit as string), usage: BigInt(usage as string) };
  }

  /**
   * Gets the limit for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the limit as U256.
   */
  public async getLimit(gsmAddress: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getLimitFuncAddr,
      [gsmAddress],
    );
    return BigInt(resp.toString());
  }

  /**
   * Gets the GHO reserve address for a given GSM.
   * @param gsmAddress The address of the GSM
   * @returns A promise that resolves to the GHO reserve address.
   */
  public async getGhoReserveAddress(
    gsmAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getGhoReserveAddressFuncAddr,
      [gsmAddress],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Gets the GSM address for a given underlying asset and label.
   * @param underlyingAsset The address of the underlying asset
   * @param targetLabel The label of the GSM
   * @returns A promise that resolves to the GSM address.
   */
  public async getGsmByAssetAndLabel(
    underlyingAsset: AccountAddress,
    targetLabel: Uint8Array,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.getGsmByAssetAndLabelFuncAddr,
      [underlyingAsset, targetLabel],
    );
    return AccountAddress.fromString(resp.toString());
  }

  /**
   * Checks if a GSM exists.
   * @param addr The address of the GSM to check
   * @returns A promise that resolves to a boolean indicating if the GSM exists.
   */
  public async gsmExists(addr: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GsmManagerContract.gsmExistsFuncAddr,
      [addr],
    );
    return resp as boolean;
  }

  // New composed method for aggregated details
  public async getGsmDetails(gsmAddress: AccountAddress): Promise<GsmDetails> {
    // Parallel calls for efficiency (but since we can't truly parallel in JS, sequential is fine)
    const exposureCap = await this.getExposureCap(gsmAddress);
    const currentExposure = await this.getCurrentExposure(gsmAddress);
    const remainingExposure = await this.getRemainingExposure(gsmAddress);
    const priceRatio = await this.getPriceRatio(gsmAddress);
    const ghoTreasury = await this.getGhoTreasury(gsmAddress);
    const underlyingAsset = await this.getUnderlyingAsset(gsmAddress);
    const underlyingDecimals =
      await this.getUnderlyingAssetDecimals(gsmAddress);
    const ghoToken = await this.getGhoToken(gsmAddress);
    const ghoReserve = await this.getGhoReserveAddress(gsmAddress);
    const isFrozen = await this.getIsFrozen(gsmAddress);
    const isSeized = await this.getIsSeized(gsmAddress);
    const canSwap = await this.canSwap(gsmAddress);
    const accruedFees = await this.getAccruedFees(gsmAddress);
    const feeStrategy = await this.getFeeStrategyAddress(gsmAddress);
    const priceStrategy = await this.getPriceStrategyAddress(gsmAddress);
    const feeStore = await this.getFeeStore(gsmAddress);
    const used = await this.getUsed(gsmAddress);
    const usage = await this.getUsage(gsmAddress);
    const limit = await this.getLimit(gsmAddress); 

    return {
      config: {
        exposureCap,
        currentExposure,
        remainingExposure,
        priceRatio,
        ghoTreasury,
        underlyingAsset,
        underlyingDecimals,
        ghoToken,
        ghoReserve,
        isFrozen,
        isSeized,
        canSwap,
      },
      accruedFees,
      feeStrategy,
      priceStrategy,
      feeStore,
      used,
      usage,
      limit,
    };
  }

  /**
   * Gets the underlying asset balance for a given user address.
   * This is useful for validating if a user has enough balance before selling assets.
   *
   * @param gsmAddress The address of the GSM
   * @param userAddress The address of the user whose balance to check
   * @returns A promise that resolves to the user's underlying asset balance
   */
  public async getUnderlyingAssetBalanceForUser(
    gsmAddress: AccountAddress,
    userAddress: AccountAddress,
  ): Promise<bigint> {
    // First get the underlying asset address from the GSM
    const underlyingAsset = await this.getUnderlyingAsset(gsmAddress);

    // Get the user's balance of the underlying asset
    try {
      const balance = await this.aptosProvider
        .getAptos()
        .getCurrentFungibleAssetBalances({
          options: {
            where: {
              owner_address: { _eq: userAddress.toString() },
              asset_type: { _eq: underlyingAsset.toString() },
            },
          },
        });

      if (balance && balance.length > 0) {
        return BigInt(balance[0].amount);
      }
      // User has no balance of this asset
      return 0n;
    } catch (error) {
      // Network or API error
      throw new Error(
        `Failed to fetch underlying asset balance for user ${userAddress.toString()}: ${error.message}`,
      );
    }
  }
}
