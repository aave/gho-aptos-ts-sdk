import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoBucketStewardContract } from "../../contracts/gho-stewards/ghoBucketStewardContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type BucketStewardDetails = {
  controlledFacilitators: AccountAddress[];
  minimumDelay: bigint;
  ghoToken: AccountAddress;
  // Optional per-facilitator info if provided
  isControlled?: boolean;
  timelock?: bigint;
};

/**
 * Represents the GhoBucketStewardClient class which provides methods to interact with the Gho Bucket Steward contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for managing bucket capacities of controlled facilitators.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ghoBucketStewardClient = GhoBucketStewardClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ghoBucketStewardClient = new GhoBucketStewardClient(provider, signer);
 *
 * // Initialize steward
 * await ghoBucketStewardClient.initialize(owner, ghoToken, riskCouncil);
 *
 * // Update bucket capacity
 * await ghoBucketStewardClient.updateFacilitatorBucketCapacity(facilitator, newBucketCapacity);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoBucketStewardClient extends AptosContractWrapperBaseClass {
  GhoBucketStewardContract: GhoBucketStewardContract;

  /**
   * Constructs an instance of GhoBucketStewardClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoBucketStewardContract = new GhoBucketStewardContract(provider);
  }

  /**
   * Creates an instance of GhoBucketStewardClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoBucketStewardClient.
   * @returns A new instance of GhoBucketStewardClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoBucketStewardClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GhoBucketStewardClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Configuration
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the Gho Bucket Steward.
   * @param owner The owner address.
   * @param ghoToken The GHO token address.
   * @param riskCouncil The risk council address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    owner: AccountAddress,
    ghoToken: AccountAddress,
    riskCouncil: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBucketStewardContract.initializeFuncAddr,
      [owner.toString(), ghoToken.toString(), riskCouncil.toString()],
    );
  }

  /**
   * Updates the facilitator's bucket capacity.
   * @param facilitator The facilitator address.
   * @param newBucketCapacity The new bucket capacity (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateFacilitatorBucketCapacity(
    facilitator: AccountAddress,
    newBucketCapacity: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBucketStewardContract.updateFacilitatorBucketCapacityFuncAddr,
      [facilitator.toString(), newBucketCapacity.toString()],
    );
  }

  /**
   * Sets controlled facilitators.
   * @param facilitatorList Array of facilitator addresses.
   * @param approve True to add, false to remove.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setControlledFacilitator(
    facilitatorList: AccountAddress[],
    approve: boolean,
  ): Promise<CommittedTransactionResponse> {
    const facilitators = facilitatorList.map((addr) => addr.toString());
    return this.sendTxAndAwaitResponse(
      this.GhoBucketStewardContract.setControlledFacilitatorFuncAddr,
      [facilitators, approve],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the list of controlled facilitators.
   * @returns A promise that resolves to an array of AccountAddress.
   */
  public async getControlledFacilitators(): Promise<AccountAddress[]> {
    const [facilitators] = await this.callViewMethod<[string[]]>(
      this.GhoBucketStewardContract.getControlledFacilitatorsFuncAddr,
      [],
    );
    return facilitators.map((addr) => AccountAddress.fromString(addr));
  }

  /**
   * Checks if a facilitator is controlled.
   * @param facilitator The facilitator address.
   * @returns A promise that resolves to a boolean.
   */
  public async isControlledFacilitator(
    facilitator: AccountAddress,
  ): Promise<boolean> {
    const [isControlled] = await this.callViewMethod<[boolean]>(
      this.GhoBucketStewardContract.isControlledFacilitatorFuncAddr,
      [facilitator.toString()],
    );
    return isControlled;
  }

  /**
   * Gets the facilitator's bucket capacity timelock.
   * @param facilitator The facilitator address.
   * @returns A promise that resolves to a U64.
   */
  public async getFacilitatorBucketCapacityTimelock(
    facilitator: AccountAddress,
  ): Promise<bigint> {
    const [timelock] = await this.callViewMethod<[string]>(
      this.GhoBucketStewardContract
        .getFacilitatorBucketCapacityTimelockFuncAddr,
      [facilitator.toString()],
    );
    return BigInt(timelock as string);
  }

  /**
   * Gets the minimum delay for operations.
   * @returns A promise that resolves to a U64.
   */
  public async minimumDelay(): Promise<bigint> {
    const [delay] = await this.callViewMethod<[string]>(
      this.GhoBucketStewardContract.minimumDelayFuncAddr,
      [],
    );
    return BigInt(delay as string);
  }

  /**
   * Gets the GHO token address.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async ghoToken(): Promise<AccountAddress> {
    const [token] = await this.callViewMethod<[string]>(
      this.GhoBucketStewardContract.ghoTokenFuncAddr,
      [],
    );
    return AccountAddress.fromString(token);
  }

  // New composed method for aggregated details (optional facilitator for specific info)
  public async getBucketStewardDetails(
    facilitator?: AccountAddress,
  ): Promise<BucketStewardDetails> {
    const controlledFacilitators = await this.getControlledFacilitators();
    const minimumDelay = await this.minimumDelay();
    const ghoToken = await this.ghoToken();

    const details: BucketStewardDetails = {
      controlledFacilitators,
      minimumDelay,
      ghoToken,
    };

    if (facilitator) {
      details.isControlled = await this.isControlledFacilitator(facilitator);
      details.timelock =
        await this.getFacilitatorBucketCapacityTimelock(facilitator);
    }

    return details;
  }
}
