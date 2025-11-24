import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { CcipStewardContract } from "../../contracts/gho-stewards/ccipStewardContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type TimelockData = {
  bridge_limit_last_updated: bigint;
  rate_limit_last_updated: bigint;
};

export type StewardDetails = {
  timelocks: TimelockData;
  bridgeLimit: bigint;
  minimumDelay: bigint;
};

/**
 * Represents the CcipStewardClient class which provides methods to interact with the CCIP Steward contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for initializing and updating
 * CCIP configurations with timelock protections.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ccipStewardClient = CcipStewardClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ccipStewardClient = new CcipStewardClient(provider, signer);
 *
 * // Initialize steward
 * await ccipStewardClient.initialize(ghoToken, ghoTokenPool, riskCouncil);
 *
 * // Update bridge limit
 * await ccipStewardClient.updateBridgeLimit(newBridgeLimit);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class CcipStewardClient extends AptosContractWrapperBaseClass {
  CcipStewardContract: CcipStewardContract;

  /**
   * Constructs an instance of CcipStewardClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.CcipStewardContract = new CcipStewardContract(provider);
  }

  /**
   * Creates an instance of CcipStewardClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the CcipStewardClient.
   * @returns A new instance of CcipStewardClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): CcipStewardClient {
    const signer = provider.getGhoProfileAccount();
    const client = new CcipStewardClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Updates
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the CCIP Steward.
   * @param ghoToken The GHO token address.
   * @param ghoTokenPool The GHO token pool address.
   * @param riskCouncil The risk council address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    ghoToken: AccountAddress,
    ghoTokenPool: AccountAddress,
    riskCouncil: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.CcipStewardContract.initializeFuncAddr,
      [ghoToken.toString(), ghoTokenPool.toString(), riskCouncil.toString()],
    );
  }

  /**
   * Updates the CCIP bridge limit.
   * @param newBridgeLimit The new bridge limit value (U64).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateBridgeLimit(
    newBridgeLimit: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.CcipStewardContract.updateBridgeLimitFuncAddr,
      [newBridgeLimit.toString()],
    );
  }

  /**
   * Updates the CCIP rate limits.
   * @param remoteChainSelector The remote chain selector (U64).
   * @param inboundCapacity The inbound capacity (U64).
   * @param inboundRate The inbound rate (U64).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateRateLimit(
    remoteChainSelector: bigint,
    inboundCapacity: bigint,
    inboundRate: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.CcipStewardContract.updateRateLimitFuncAddr,
      [
        remoteChainSelector.toString(),
        inboundCapacity.toString(),
        inboundRate.toString(),
      ],
    );
  }

  /**
   * Toggles the bridge limit enabled state.
   * @param enable True to enable, false to disable.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async toggleBridgeLimitEnabled(
    enable: boolean,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.CcipStewardContract.toggleBridgeLimitEnabledFuncAddr,
      [enable],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the CCIP timelock information.
   * @returns A promise that resolves to an object with bridge_limit_last_updated and rate_limit_last_updated (both U64).
   */
  public async getCcipTimelocks(): Promise<TimelockData> {
    const [timelocks] = await this.callViewMethod<
      [{ bridge_limit_last_updated: string; rate_limit_last_updated: string }]
    >(this.CcipStewardContract.getCcipTimelocksFuncAddr, []);
    return {
      bridge_limit_last_updated: BigInt(
        timelocks[0].bridge_limit_last_updated as string,
      ),
      rate_limit_last_updated: BigInt(
        timelocks[0].rate_limit_last_updated as string,
      ),
    };
  }

  /**
   * Gets the CCIP bridge limit.
   * @returns A promise that resolves to a U64.
   */
  public async getBridgeLimit(): Promise<bigint> {
    const [limit] = await this.callViewMethod<[string]>(
      this.CcipStewardContract.getBridgeLimitFuncAddr,
      [],
    );
    return BigInt(limit as string);
  }

  /**
   * Gets the minimum delay for operations.
   * @returns A promise that resolves to a U64.
   */
  public async minimumDelay(): Promise<bigint> {
    const [delay] = await this.callViewMethod<[string]>(
      this.CcipStewardContract.minimumDelayFuncAddr,
      [],
    );
    return BigInt(delay as string);
  }

  // New composed method for aggregated details
  public async getCcipStewardDetails(): Promise<StewardDetails> {
    const timelocks = await this.getCcipTimelocks();
    const bridgeLimit = await this.getBridgeLimit();
    const minimumDelay = await this.minimumDelay();

    return {
      timelocks,
      bridgeLimit,
      minimumDelay,
    };
  }
}
