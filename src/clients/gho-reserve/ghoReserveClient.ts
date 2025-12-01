import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoReserveContract } from "../../contracts/gho-reserve/ghoReserveContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type UsageData = {
  limit: bigint;
  used: bigint;
};

export type ReserveDetails = {
  owner: AccountAddress;
  entities: AccountAddress[];
  totalEntities: bigint;
  ghoToken: AccountAddress;
  revision: bigint;
};

/**
 * Represents the GhoReserveClient class which provides methods to interact with the GhoReserve contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for managing entities, usage limits,
 * transferring GHO, and querying reserve state.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ghoReserveClient = GhoReserveClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ghoReserveClient = new GhoReserveClient(provider, signer);
 *
 * // Initialize reserve
 * await ghoReserveClient.initialize(ghoTokenMetadata, newOwner, seed);
 *
 * // Add entity
 * await ghoReserveClient.addEntity(reserveAddress, entity);
 *
 * // Get entities
 * const entities = await ghoReserveClient.getEntities(reserveAddress);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoReserveClient extends AptosContractWrapperBaseClass {
  GhoReserveContract: GhoReserveContract;

  /**
   * Constructs an instance of GhoReserveClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoReserveContract = new GhoReserveContract(provider);
  }

  /**
   * Creates an instance of GhoReserveClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoReserveClient.
   * @returns A new instance of GhoReserveClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoReserveClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GhoReserveClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Ownership
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the GhoReserve.
   * @param ghoTokenMetadata The address of the GHO token metadata.
   * @param newOwner The address of the new owner.
   * @param seed The seed for object creation (Uint8Array).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    ghoTokenMetadata: AccountAddress,
    newOwner: AccountAddress,
    seed: Uint8Array,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.initializeFuncAddr,
      [ghoTokenMetadata.toString(), newOwner.toString(), seed],
    );
  }

  /**
   * Transfers ownership of the GhoReserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param newOwner The new owner address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async transferOwnership(
    reserveAddress: AccountAddress,
    newOwner: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.transferOwnershipFuncAddr,
      [reserveAddress.toString(), newOwner.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Entity Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Adds an entity to the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The address of the entity to add.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addEntity(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.addEntityFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
  }

  /**
   * Removes an entity from the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The address of the entity to remove.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeEntity(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.removeEntityFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
  }

  /**
   * Sets the usage limit for an entity.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The address of the entity.
   * @param limit The new usage limit (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setLimit(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
    limit: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.setLimitFuncAddr,
      [reserveAddress.toString(), entity.toString(), limit.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // GHO Operations
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Uses GHO from the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param amount The amount to use (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async useGho(
    reserveAddress: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(this.GhoReserveContract.useGhoFuncAddr, [
      reserveAddress.toString(),
      amount.toString(),
    ]);
  }

  /**
   * Restores GHO to the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param amount The amount to restore (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async restore(
    reserveAddress: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.restoreFuncAddr,
      [reserveAddress.toString(), amount.toString()],
    );
  }

  /**
   * Transfers GHO from the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param to The recipient address.
   * @param amount The amount to transfer (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async transfer(
    reserveAddress: AccountAddress,
    to: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoReserveContract.transferFuncAddr,
      [reserveAddress.toString(), to.toString(), amount.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the list of entities in the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @returns A promise that resolves to an array of AccountAddress.
   */
  public async getEntities(
    reserveAddress: AccountAddress,
  ): Promise<AccountAddress[]> {
    const [entities] = await this.callViewMethod<[string[]]>(
      this.GhoReserveContract.getEntitiesFuncAddr,
      [reserveAddress.toString()],
    );
    return entities.map((addr) => AccountAddress.fromString(addr));
  }

  /**
   * Gets the amount of GHO used by an entity.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The entity address.
   * @returns A promise that resolves to a U256 (bigint).
   */
  public async getUsed(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<bigint> {
    const [used] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.getUsedFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
    return BigInt(used as string);
  }

  /**
   * Gets the usage data (limit and used) for an entity.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The entity address.
   * @returns A promise that resolves to [U256, U256] (limit, used).
   */
  public async getUsage(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<UsageData> {
    const [limit, used] = await this.callViewMethod<[string, string]>(
      this.GhoReserveContract.getUsageFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
    return { limit: BigInt(limit as string), used: BigInt(used as string) };
  }

  /**
   * Gets the usage limit for an entity.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The entity address.
   * @returns A promise that resolves to a U256 (bigint).
   */
  public async getLimit(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<bigint> {
    const [limit] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.getLimitFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
    return BigInt(limit as string);
  }

  /**
   * Gets the owner of the GhoReserve.
   * @param reserveAddress The address of the GhoReserve.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getOwner(
    reserveAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [owner] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.getOwnerFuncAddr,
      [reserveAddress.toString()],
    );
    return AccountAddress.fromString(owner);
  }

  /**
   * Checks if an address is an entity in the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @param entity The address to check.
   * @returns A promise that resolves to a boolean.
   */
  public async isEntity(
    reserveAddress: AccountAddress,
    entity: AccountAddress,
  ): Promise<boolean> {
    const [isEntity] = await this.callViewMethod<[boolean]>(
      this.GhoReserveContract.isEntityFuncAddr,
      [reserveAddress.toString(), entity.toString()],
    );
    return isEntity;
  }

  /**
   * Gets the total number of entities in the reserve.
   * @param reserveAddress The address of the GhoReserve.
   * @returns A promise that resolves to a U64 (bigint).
   */
  public async totalEntities(reserveAddress: AccountAddress): Promise<bigint> {
    const [total] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.totalEntitiesFuncAddr,
      [reserveAddress.toString()],
    );
    return BigInt(total as string);
  }

  /**
   * Gets the address of the GHO token.
   * @param reserveAddress The address of the GhoReserve.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async ghoToken(
    reserveAddress: AccountAddress,
  ): Promise<AccountAddress> {
    const [token] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.ghoTokenFuncAddr,
      [reserveAddress.toString()],
    );
    return AccountAddress.fromString(token);
  }

  /**
   * Gets the revision number of the GhoReserve.
   * @param reserveAddress The address of the GhoReserve.
   * @returns A promise that resolves to a U64 (bigint).
   */
  public async ghoRemoteReserveRevision(
    reserveAddress: AccountAddress,
  ): Promise<bigint> {
    const [revision] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.ghoRemoteReserveRevisionFuncAddr,
      [reserveAddress.toString()],
    );
    return BigInt(revision as string);
  }

  /**
   * Gets the GhoReserve address from seed.
   * @param seed The seed (Uint8Array).
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getGhoReserveAddress(seed: Uint8Array): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.getGhoReserveAddressFuncAddr,
      [seed],
    );
    return AccountAddress.fromString(address);
  }

  /**
   * Gets the reserve address from deployer and seed.
   * @param deployerAddr The deployer address.
   * @param seed The seed (Uint8Array).
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getReserveAddress(
    deployerAddr: AccountAddress,
    seed: Uint8Array,
  ): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoReserveContract.getReserveAddressFuncAddr,
      [deployerAddr.toString(), seed],
    );
    return AccountAddress.fromString(address);
  }

  // New composed method for aggregated details
  public async getReserveDetails(
    reserveAddress: AccountAddress,
  ): Promise<ReserveDetails> {
    const owner = await this.getOwner(reserveAddress);
    const entities = await this.getEntities(reserveAddress);
    const totalEntities = await this.totalEntities(reserveAddress);
    const ghoToken = await this.ghoToken(reserveAddress);
    const revision = await this.ghoRemoteReserveRevision(reserveAddress);

    return {
      owner,
      entities,
      totalEntities,
      ghoToken,
      revision,
    };
  }
}
