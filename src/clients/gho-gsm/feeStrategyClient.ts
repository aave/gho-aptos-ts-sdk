import { AccountAddress, Ed25519Account } from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { FeeStrategyManagerContract } from "../../contracts/gho-gsm/feeStrategyContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type FeeCalculation = {
  fee: bigint;
};

export type FeeStrategyDetails = {
  name: Uint8Array;
  buyFeeBps: bigint;
  sellFeeBps: bigint;
  isValid: boolean;
  maxFeeBps: bigint;
  bpsDivisor: bigint;
};

/**
 * Represents the FeeStrategyClient class which provides methods to interact with FeeStrategy objects
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for querying fee strategy information,
 * calculating fees, and validating fee strategies. Note that fee strategies are immutable objects created through
 * the GSM client's `createAndSetFeeStrategy` method, as the `create_fee_strategy` function is a friend function
 * only accessible to GSM and GSM steward modules.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const feeStrategyClient = FeeStrategyClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const feeStrategyClient = new FeeStrategyClient(provider, signer);
 *
 * // Get buy fee for a given gross amount
 * const buyFee = await feeStrategyClient.getBuyFee(feeStrategyObject, grossAmount);
 *
 * // Get fee strategy information
 * const buyFeeBps = await feeStrategyClient.getBuyFeeBps(feeStrategyObject);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing (not typically needed for view functions).
 */
export class FeeStrategyClient extends AptosContractWrapperBaseClass {
  FeeStrategyManagerContract: FeeStrategyManagerContract;

  /**
   * Constructs an instance of FeeStrategyClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.FeeStrategyManagerContract = new FeeStrategyManagerContract(provider);
  }

  /**
   * Creates an instance of FeeStrategyClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the FeeStrategyClient.
   * @returns A new instance of FeeStrategyClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): FeeStrategyClient {
    const client = new FeeStrategyClient(
      provider,
      provider.getGhoProfileAccount(),
    );
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Updated View Functions with custom types
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Retrieves the buy fee for a given gross amount.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @param grossAmount The gross amount before the fee is applied.
   * @returns A promise that resolves to the calculated buy fee as U256.
   */
  public async getBuyFee(
    strategy: AccountAddress,
    grossAmount: bigint,
  ): Promise<FeeCalculation> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getBuyFeeFuncAddr,
      [strategy, grossAmount],
    );
    return { fee: BigInt(resp as string) };
  }

  /**
   * Retrieves the sell fee for a given gross amount.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @param grossAmount The gross amount before the fee is applied.
   * @returns A promise that resolves to the calculated sell fee as U256.
   */
  public async getSellFee(
    strategy: AccountAddress,
    grossAmount: bigint,
  ): Promise<FeeCalculation> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getSellFeeFuncAddr,
      [strategy, grossAmount],
    );
    return { fee: BigInt(resp as string) };
  }

  /**
   * Calculates the gross amount from the total amount bought, accounting for the buy fee.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @param totalAmount The total amount paid, including the fee.
   * @returns A promise that resolves to the gross amount before the buy fee as U256.
   */
  public async getGrossAmountFromTotalBought(
    strategy: AccountAddress,
    totalAmount: bigint,
  ): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getGrossAmountFromTotalBoughtFuncAddr,
      [strategy, totalAmount],
    );
    return BigInt(resp as string);
  }

  /**
   * Calculates the gross amount from the total amount sold, accounting for the sell fee.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @param totalAmount The total amount received, including the fee.
   * @returns A promise that resolves to the gross amount before the sell fee as U256.
   */
  public async getGrossAmountFromTotalSold(
    strategy: AccountAddress,
    totalAmount: bigint,
  ): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getGrossAmountFromTotalSoldFuncAddr,
      [strategy, totalAmount],
    );
    return BigInt(resp as string);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Fee Strategy Getters
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Retrieves the name of the specified fee strategy.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the name as Uint8Array.
   */
  public async getName(strategy: AccountAddress): Promise<Uint8Array> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getNameFuncAddr,
      [strategy],
    );
    return resp as Uint8Array;
  }

  /**
   * Retrieves the buy fee rate in basis points for the specified strategy.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the buy fee rate in basis points as U256.
   */
  public async getBuyFeeBps(strategy: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getBuyFeeBpsFuncAddr,
      [strategy],
    );
    return BigInt(resp as string);
  }

  /**
   * Retrieves the sell fee rate in basis points for the specified strategy.
   * @param strategy The FeeStrategy object address (as AccountAddress).
   * @returns A promise that resolves to the sell fee rate in basis points as U256.
   */
  public async getSellFeeBps(strategy: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getSellFeeBpsFuncAddr,
      [strategy],
    );
    return BigInt(resp as string);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Validation and Constants
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Checks if the specified fee strategy is valid and exists.
   * @param strategyAddr The FeeStrategy address to validate.
   * @returns A promise that resolves to a boolean indicating if the strategy exists.
   */
  public async isValidFeeStrategy(
    strategyAddr: AccountAddress,
  ): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.isValidFeeStrategyFuncAddr,
      [strategyAddr],
    );
    return resp as boolean;
  }

  /**
   * Retrieves the maximum allowable fee in basis points.
   * @returns A promise that resolves to the maximum fee in basis points (5000) as U256.
   */
  public async getMaxFeeBps(): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getMaxFeeBpsFuncAddr,
      [],
    );
    return BigInt(resp as string);
  }

  /**
   * Retrieves the basis points divisor used in fee calculations.
   * @returns A promise that resolves to the basis points divisor (10000) as U256.
   */
  public async getBpsDivisor(): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.FeeStrategyManagerContract.getBpsDivisorFuncAddr,
      [],
    );
    return BigInt(resp as string);
  }

  // New composed method for aggregated details
  public async getFeeStrategyDetails(
    strategy: AccountAddress,
  ): Promise<FeeStrategyDetails> {
    const name = await this.getName(strategy);
    const buyFeeBps = await this.getBuyFeeBps(strategy);
    const sellFeeBps = await this.getSellFeeBps(strategy);
    const isValid = await this.isValidFeeStrategy(strategy);
    const maxFeeBps = await this.getMaxFeeBps(); // Global, not per-strategy
    const bpsDivisor = await this.getBpsDivisor(); // Global

    return {
      name,
      buyFeeBps,
      sellFeeBps,
      isValid,
      maxFeeBps,
      bpsDivisor,
    };
  }
}
