import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GsmRegistryContract } from "../../contracts/gho-gsm/gsmRegistryContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type GsmRegistryDetails = {
  gsmList: AccountAddress[];
  length: bigint;
};

/**
 * Represents the GsmRegistryClient class which provides methods to interact with the GSM registry contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for adding/removing GSMs and querying the registry.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const gsmRegistryClient = GsmRegistryClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const gsmRegistryClient = new GsmRegistryClient(provider, signer);
 *
 * // Add a GSM
 * await gsmRegistryClient.addGsm(gsmAddress);
 *
 * // Get GSM list
 * const gsmList = await gsmRegistryClient.getGsmList();
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GsmRegistryClient extends AptosContractWrapperBaseClass {
  GsmRegistryContract: GsmRegistryContract;

  /**
   * Constructs an instance of GsmRegistryClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GsmRegistryContract = new GsmRegistryContract(provider);
  }

  /**
   * Creates an instance of GsmRegistryClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GsmRegistryClient.
   * @returns A new instance of GsmRegistryClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GsmRegistryClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GsmRegistryClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Registry Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Adds a GSM to the registry.
   * @param gsmAddress The address of the GSM to add.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addGsm(
    gsmAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmRegistryContract.addGsmFuncAddr,
      [gsmAddress.toString()],
    );
  }

  /**
   * Removes a GSM from the registry.
   * @param gsmAddress The address of the GSM to remove.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeGsm(
    gsmAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GsmRegistryContract.removeGsmFuncAddr,
      [gsmAddress.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the list of GSMs in the registry.
   * @returns A promise that resolves to an array of AccountAddress.
   */
  public async getGsmList(): Promise<AccountAddress[]> {
    const [gsmList] = await this.callViewMethod<[string[]]>(
      this.GsmRegistryContract.getGsmListFuncAddr,
      [],
    );
    return gsmList.map((addr) => AccountAddress.fromString(addr));
  }

  /**
   * Gets the length of the GSM list.
   * @returns A promise that resolves to a U64 (bigint).
   */
  public async getGsmListLength(): Promise<bigint> {
    const [length] = await this.callViewMethod<[string]>(
      this.GsmRegistryContract.getGsmListLengthFuncAddr,
      [],
    );
    return BigInt(length as string);
  }

  /**
   * Gets the GSM address at a specific sorted index in the registry.
   * @param index The sorted index position.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getGsmBySortedIndex(index: bigint): Promise<AccountAddress> {
    const [gsmAddress] = await this.callViewMethod<[string]>(
      this.GsmRegistryContract.getGsmBySortedIndexFuncAddr,
      [index.toString()],
    );
    return AccountAddress.fromString(gsmAddress);
  }

  /**
   * Checks if a GSM is registered in the registry.
   * @param gsmAddress The address of the GSM to check.
   * @returns A promise that resolves to a boolean.
   */
  public async isRegistered(gsmAddress: AccountAddress): Promise<boolean> {
    const [isRegistered] = await this.callViewMethod<[boolean]>(
      this.GsmRegistryContract.isRegisteredFuncAddr,
      [gsmAddress.toString()],
    );
    return isRegistered;
  }

  // New composed method for aggregated details
  public async getRegistryDetails(): Promise<GsmRegistryDetails> {
    const gsmList = await this.getGsmList();
    const length = await this.getGsmListLength();
    return {
      gsmList,
      length,
    };
  }
}
