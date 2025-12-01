import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoAaveStewardContract } from "../../contracts/gho-stewards/ghoAaveStewardContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type BorrowRateConfig = {
  optimal_usage_ratio_max_change: bigint;
  base_variable_borrow_rate_max_change: bigint;
  variable_rate_slope1_max_change: bigint;
  variable_rate_slope2_max_change: bigint;
};

export type TimelockData = {
  gho_borrow_rate_last_update: bigint;
  gho_borrow_cap_last_update: bigint;
  gho_supply_cap_last_update: bigint;
};

export type StewardDetails = {
  borrowRateConfig: BorrowRateConfig;
  timelocks: TimelockData;
  ghoToken: AccountAddress;
  owner: AccountAddress;
  minimumDelay: bigint;
};

/**
 * Represents the GhoAaveStewardClient class which provides methods to interact with the GHO Aave Steward contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for updating GHO parameters like borrow rates and caps,
 * with timelock protections.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ghoAaveStewardClient = GhoAaveStewardClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ghoAaveStewardClient = new GhoAaveStewardClient(provider, signer);
 *
 * // Initialize steward
 * await ghoAaveStewardClient.initialize(owner, ghoToken, riskCouncil, ...rate changes);
 *
 * // Update borrow rate
 * await ghoAaveStewardClient.updateGhoBorrowRate(optimalUsageRatio, baseVariableBorrowRate, ...);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoAaveStewardClient extends AptosContractWrapperBaseClass {
  GhoAaveStewardContract: GhoAaveStewardContract;

  /**
   * Constructs an instance of GhoAaveStewardClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoAaveStewardContract = new GhoAaveStewardContract(provider);
  }

  /**
   * Creates an instance of GhoAaveStewardClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoAaveStewardClient.
   * @returns A new instance of GhoAaveStewardClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoAaveStewardClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GhoAaveStewardClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Configuration
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the GHO Aave Steward.
   * @param owner The owner address.
   * @param ghoToken The GHO token address.
   * @param riskCouncil The risk council address.
   * @param optimalUsageRatioMaxChange Max change for optimal usage ratio (U256).
   * @param baseVariableBorrowRateMaxChange Max change for base variable borrow rate (U256).
   * @param variableRateSlope1MaxChange Max change for variable rate slope 1 (U256).
   * @param variableRateSlope2MaxChange Max change for variable rate slope 2 (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    owner: AccountAddress,
    ghoToken: AccountAddress,
    riskCouncil: AccountAddress,
    optimalUsageRatioMaxChange: bigint,
    baseVariableBorrowRateMaxChange: bigint,
    variableRateSlope1MaxChange: bigint,
    variableRateSlope2MaxChange: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.initializeFuncAddr,
      [
        owner.toString(),
        ghoToken.toString(),
        riskCouncil.toString(),
        optimalUsageRatioMaxChange.toString(),
        baseVariableBorrowRateMaxChange.toString(),
        variableRateSlope1MaxChange.toString(),
        variableRateSlope2MaxChange.toString(),
      ],
    );
  }

  /**
   * Updates the borrow rate of GHO.
   * @param optimalUsageRatio New optimal usage ratio (U16).
   * @param baseVariableBorrowRate New base variable borrow rate (U32).
   * @param variableRateSlope1 New variable rate slope 1 (U32).
   * @param variableRateSlope2 New variable rate slope 2 (U32).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoBorrowRate(
    optimalUsageRatio: bigint,
    baseVariableBorrowRate: bigint,
    variableRateSlope1: bigint,
    variableRateSlope2: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.updateGhoBorrowRateFuncAddr,
      [
        optimalUsageRatio.toString(),
        baseVariableBorrowRate.toString(),
        variableRateSlope1.toString(),
        variableRateSlope2.toString(),
      ],
    );
  }

  /**
   * Updates the GHO borrow cap.
   * @param newBorrowCap The new borrow cap (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoBorrowCap(
    newBorrowCap: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.updateGhoBorrowCapFuncAddr,
      [newBorrowCap.toString()],
    );
  }

  /**
   * Updates the GHO supply cap.
   * @param newSupplyCap The new supply cap (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoSupplyCap(
    newSupplyCap: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.updateGhoSupplyCapFuncAddr,
      [newSupplyCap.toString()],
    );
  }

  /**
   * Updates the configuration conditions for borrow rate changes.
   * @param optimalUsageRatioMaxChange New max change for optimal usage ratio (U256).
   * @param baseVariableBorrowRateMaxChange New max change for base variable borrow rate (U256).
   * @param variableRateSlope1MaxChange New max change for variable rate slope 1 (U256).
   * @param variableRateSlope2MaxChange New max change for variable rate slope 2 (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setBorrowRateConfig(
    optimalUsageRatioMaxChange: bigint,
    baseVariableBorrowRateMaxChange: bigint,
    variableRateSlope1MaxChange: bigint,
    variableRateSlope2MaxChange: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.setBorrowRateConfigFuncAddr,
      [
        optimalUsageRatioMaxChange.toString(),
        baseVariableBorrowRateMaxChange.toString(),
        variableRateSlope1MaxChange.toString(),
        variableRateSlope2MaxChange.toString(),
      ],
    );
  }

  /**
   * Transfers ownership to a new address.
   * @param newOwner The new owner address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async transferOwnership(
    newOwner: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAaveStewardContract.transferOwnershipFuncAddr,
      [newOwner.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the current borrow rate configuration limits.
   * @returns A promise that resolves to [U256, U256, U256, U256].
   */
  public async getBorrowRateConfig(): Promise<BorrowRateConfig> {
    const [optimal, base, slope1, slope2] = await this.callViewMethod<
      [string, string, string, string]
    >(this.GhoAaveStewardContract.getBorrowRateConfigFuncAddr, []);
    return {
      optimal_usage_ratio_max_change: BigInt(optimal as string),
      base_variable_borrow_rate_max_change: BigInt(base as string),
      variable_rate_slope1_max_change: BigInt(slope1 as string),
      variable_rate_slope2_max_change: BigInt(slope2 as string),
    };
  }

  /**
   * Returns the timestamps of the last parameter updates.
   * @returns A promise that resolves to [U64, U64, U64] (borrow cap, supply cap, borrow rate last updates).
   */
  public async getGhoTimelocks(): Promise<TimelockData> {
    const [borrowRate, borrowCap, supplyCap] = await this.callViewMethod<
      [string, string, string]
    >(this.GhoAaveStewardContract.getGhoTimelocksFuncAddr, []);
    return {
      gho_borrow_rate_last_update: BigInt(borrowRate as string),
      gho_borrow_cap_last_update: BigInt(borrowCap as string),
      gho_supply_cap_last_update: BigInt(supplyCap as string),
    };
  }

  /**
   * Returns the GHO token address.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getGhoToken(): Promise<AccountAddress> {
    const [token] = await this.callViewMethod<[string]>(
      this.GhoAaveStewardContract.getGhoTokenFuncAddr,
      [],
    );
    return AccountAddress.fromString(token);
  }

  /**
   * Returns the current owner address.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getOwner(): Promise<AccountAddress> {
    const [owner] = await this.callViewMethod<[string]>(
      this.GhoAaveStewardContract.getOwnerFuncAddr,
      [],
    );
    return AccountAddress.fromString(owner);
  }

  /**
   * Returns the minimum delay for timelock.
   * @returns A promise that resolves to a U64.
   */
  public async minimumDelay(): Promise<bigint> {
    const [delay] = await this.callViewMethod<[string]>(
      this.GhoAaveStewardContract.minimumDelayFuncAddr,
      [],
    );
    return BigInt(delay as string);
  }

  // New composed method for aggregated details
  public async getAaveStewardDetails(): Promise<StewardDetails> {
    const borrowRateConfig = await this.getBorrowRateConfig();
    const timelocks = await this.getGhoTimelocks();
    const ghoToken = await this.getGhoToken();
    const owner = await this.getOwner();
    const minimumDelay = await this.minimumDelay();

    return {
      borrowRateConfig,
      timelocks,
      ghoToken,
      owner,
      minimumDelay,
    };
  }
}
