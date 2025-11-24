import { AccountAddress, Ed25519Account } from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { PriceStrategyManagerContract } from "../../contracts/gho-gsm/priceStrategyContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type PriceCalculation = {
  amount: bigint;
};

export type PriceStrategyDetails = {
  name: Uint8Array;
  priceRatio: bigint;
  underlyingAsset: AccountAddress;
  underlyingAssetDecimals: number;
  underlyingAssetUnits: bigint;
  isValid: boolean;
  ghoDecimals: number;
};

/**
 * Represents the PriceStrategyClient class which provides methods to interact with PriceStrategy objects
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for querying price strategy information,
 * calculating price conversions between underlying assets and GHO tokens, and validating price strategies.
 * Note that price strategies are immutable objects created through the GSM client's `createAndInitializeGsm` or
 * `updatePriceRatio` methods, as the `create_fixed_price_strategy` function is a friend function only accessible
 * to GSM module.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const priceStrategyClient = PriceStrategyClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const priceStrategyClient = new PriceStrategyClient(provider, signer);
 *
 * // Calculate GHO amount for a given asset amount
 * const ghoAmount = await priceStrategyClient.getAssetPriceInGho(
 *   priceStrategyObject,
 *   assetAmount,
 *   true // round up
 * );
 *
 * // Get price strategy information
 * const priceRatio = await priceStrategyClient.getPriceRatio(priceStrategyObject);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing (not typically needed for view functions).
 */
export class PriceStrategyClient extends AptosContractWrapperBaseClass {
  PriceStrategyManagerContract: PriceStrategyManagerContract;

  /**
   * Constructs an instance of PriceStrategyClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.PriceStrategyManagerContract = new PriceStrategyManagerContract(
      provider,
    );
  }

  /**
   * Creates an instance of PriceStrategyClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the PriceStrategyClient.
   * @returns A new instance of PriceStrategyClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): PriceStrategyClient {
    const client = new PriceStrategyClient(
      provider,
      provider.getGhoProfileAccount(),
    );
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Price Calculation Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Calculates the amount of GHO tokens for a given amount of underlying asset.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @param assetAmount The amount of underlying asset (in asset's smallest unit).
   * @param roundUp Whether to round up (true) or down (false) the result.
   * @returns A promise that resolves to the amount of GHO tokens (in GHO's smallest unit) as U256.
   */
  public async getAssetPriceInGho(
    strategy: AccountAddress,
    assetAmount: bigint,
    roundUp: boolean,
  ): Promise<PriceCalculation> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getAssetPriceInGhoFuncAddr,
      [strategy, assetAmount, roundUp],
    );
    return { amount: BigInt(resp as string) };
  }

  /**
   * Calculates the amount of underlying asset for a given amount of GHO tokens.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @param ghoAmount The amount of GHO tokens (in GHO's smallest unit).
   * @param roundUp Whether to round up (true) or down (false) the result.
   * @returns A promise that resolves to the amount of underlying asset (in asset's smallest unit) as U256.
   */
  public async getGhoPriceInAsset(
    strategy: AccountAddress,
    ghoAmount: bigint,
    roundUp: boolean,
  ): Promise<PriceCalculation> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getGhoPriceInAssetFuncAddr,
      [strategy, ghoAmount, roundUp],
    );
    return { amount: BigInt(resp as string) };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Strategy Information Getters
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the name of the price strategy.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the name as Uint8Array.
   */
  public async getName(strategy: AccountAddress): Promise<Uint8Array> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getNameFuncAddr,
      [strategy],
    );
    return resp as Uint8Array;
  }

  /**
   * Returns the underlying asset address.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the underlying asset address.
   */
  public async getUnderlyingAsset(
    strategy: AccountAddress,
  ): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getUnderlyingAssetFuncAddr,
      [strategy],
    );
    return AccountAddress.fromString(resp as string);
  }

  /**
   * Returns the underlying asset decimals.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the underlying asset decimals as U8.
   */
  public async getUnderlyingAssetDecimals(
    strategy: AccountAddress,
  ): Promise<number> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getUnderlyingAssetDecimalsFuncAddr,
      [strategy],
    );
    return Number(resp as number);
  }

  /**
   * Returns the price ratio from underlying asset to GHO.
   * @param strategy The PriceStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the price ratio as U256.
   */
  public async getPriceRatio(strategy: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getPriceRatioFuncAddr,
      [strategy],
    );
    return BigInt(resp as string);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Validation and Constants
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Checks if an address points to a valid PriceStrategy object.
   * @param strategyAddr The PriceStrategy address to validate.
   * @returns A promise that resolves to a boolean indicating if the strategy exists.
   */
  public async isValidPriceStrategy(
    strategyAddr: AccountAddress,
  ): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.isValidPriceStrategyFuncAddr,
      [strategyAddr],
    );
    return resp as boolean;
  }

  /**
   * Gets the GHO decimals constant.
   * @returns A promise that resolves to the number of decimals for GHO token (always 6) as U8.
   */
  public async getGhoDecimals(): Promise<number> {
    const [resp] = await this.callViewMethod(
      this.PriceStrategyManagerContract.getGhoDecimalsFuncAddr,
      [],
    );
    return Number(resp as number);
  }

  // New composed method for aggregated details
  public async getPriceStrategyDetails(
    strategy: AccountAddress,
  ): Promise<PriceStrategyDetails> {
    const name = await this.getName(strategy);
    const priceRatio = await this.getPriceRatio(strategy);
    const underlyingAsset = await this.getUnderlyingAsset(strategy);
    const underlyingAssetDecimals =
      await this.getUnderlyingAssetDecimals(strategy);
    // underlyingAssetUnits derived as 10^decimals, but since not directly available, calculate it
    const underlyingAssetUnits = BigInt(10 ** underlyingAssetDecimals);
    const isValid = await this.isValidPriceStrategy(strategy);
    const ghoDecimals = await this.getGhoDecimals();

    return {
      name,
      priceRatio,
      underlyingAsset,
      underlyingAssetDecimals,
      underlyingAssetUnits,
      isValid,
      ghoDecimals,
    };
  }
}
