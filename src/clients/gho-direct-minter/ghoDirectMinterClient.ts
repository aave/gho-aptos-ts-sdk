import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoDirectMinterContract } from "../../contracts/gho-direct-minter/ghoDirectMinterContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type DirectMinterDetails = {
  minterAddress: AccountAddress;
  minterObject: string;
  ghoTokenAddress: AccountAddress;
  collectorAddress: AccountAddress;
  directMinterSignerAddress: AccountAddress;
  ghoReserveAddress: AccountAddress;
  isRiskAdmin: boolean; // For a sample account, or pass as param
  isGhoGuardian: boolean; // For a sample account
};

/**
 * Represents the GhoDirectMinterClient class which provides methods to interact with the Gho Direct Minter contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for minting, burning, supplying, withdrawing,
 * and managing the direct minter configuration.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ghoDirectMinterClient = GhoDirectMinterClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ghoDirectMinterClient = new GhoDirectMinterClient(provider, signer);
 *
 * // Initialize minter
 * await ghoDirectMinterClient.initialize(ghoReserveAddress);
 *
 * // Use and supply
 * await ghoDirectMinterClient.useAndSupply(amount);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoDirectMinterClient extends AptosContractWrapperBaseClass {
  GhoDirectMinterContract: GhoDirectMinterContract;

  /**
   * Constructs an instance of GhoDirectMinterClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoDirectMinterContract = new GhoDirectMinterContract(provider);
  }

  /**
   * Creates an instance of GhoDirectMinterClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoDirectMinterClient.
   * @returns A new instance of GhoDirectMinterClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoDirectMinterClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GhoDirectMinterClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Configuration
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the GHO direct minter.
   * @param ghoReserveAddress The address of the GHO reserve.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    ghoReserveAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.initializeFuncAddr,
      [ghoReserveAddress.toString()],
    );
  }

  /**
   * Updates the GHO reserve address.
   * @param newGhoReserve The new GHO reserve address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGhoReserve(
    newGhoReserve: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.updateGhoReserveFuncAddr,
      [newGhoReserve.toString()],
    );
  }

  /**
   * Sets the GHO token address.
   * @param ghoAddress The new GHO token address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setGhoAddress(
    ghoAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.setGhoAddressFuncAddr,
      [ghoAddress.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Mint/Burn Operations
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Uses (mints) GHO from the reserve and supplies it to the protocol.
   * @param amount The amount of GHO to use and supply (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async useAndSupply(
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.useAndSupplyFuncAddr,
      [amount.toString()],
    );
  }

  /**
   * Withdraws GHO from the protocol and restores (burns) it to the reserve.
   * @param amount The amount of GHO to withdraw and restore (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async withdrawAndRestore(
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.withdrawAndRestoreFuncAddr,
      [amount.toString()],
    );
  }

  /**
   * Transfers any excess GHO (over current usage) from the reserve entity to the treasury.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async transferExcessToTreasury(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoDirectMinterContract.transferExcessToTreasuryFuncAddr,
      [],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the address of the GHO direct minter object.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async ghoDirectMinterAddress(): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.ghoDirectMinterAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(address);
  }

  /**
   * Gets the GHO direct minter object handle.
   * @returns A promise that resolves to a string (object address).
   */
  public async ghoDirectMinterObject(): Promise<string> {
    const [object] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.ghoDirectMinterObjectFuncAddr,
      [],
    );
    return object;
  }

  /**
   * Gets the configured GHO token address.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getGhoTokenAddress(): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.getGhoTokenAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(address);
  }

  /**
   * Gets the treasury (collector) address.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getCollectorAddress(): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.getCollectorAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(address);
  }

  /**
   * Checks if an address has the Risk Admin role.
   * @param account The address to check.
   * @returns A promise that resolves to a boolean.
   */
  public async isRiskAdmin(account: AccountAddress): Promise<boolean> {
    const [isAdmin] = await this.callViewMethod<[boolean]>(
      this.GhoDirectMinterContract.isRiskAdminFuncAddr,
      [account.toString()],
    );
    return isAdmin;
  }

  /**
   * Checks if an address is a GHO Guardian.
   * @param account The address to check.
   * @returns A promise that resolves to a boolean.
   */
  public async isGhoGuardian(account: AccountAddress): Promise<boolean> {
    const [isGuardian] = await this.callViewMethod<[boolean]>(
      this.GhoDirectMinterContract.isGhoGuardianFuncAddr,
      [account.toString()],
    );
    return isGuardian;
  }

  /**
   * Gets the address represented by the direct minter signer.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getDirectMinterSignerAddress(): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.getDirectMinterSignerAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(address);
  }

  /**
   * Gets the address of the GHO reserve.
   * @returns A promise that resolves to an AccountAddress.
   */
  public async getGhoReserveAddress(): Promise<AccountAddress> {
    const [address] = await this.callViewMethod<[string]>(
      this.GhoDirectMinterContract.getGhoReserveAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(address);
  }

  // New composed method for aggregated details (using a sample account for role checks; can be parametrized if needed)
  public async getDirectMinterDetails(
    sampleAccount: AccountAddress = AccountAddress.ZERO,
  ): Promise<DirectMinterDetails> {
    const minterAddress = await this.ghoDirectMinterAddress();
    const minterObject = await this.ghoDirectMinterObject();
    const ghoTokenAddress = await this.getGhoTokenAddress();
    const collectorAddress = await this.getCollectorAddress();
    const directMinterSignerAddress = await this.getDirectMinterSignerAddress();
    const ghoReserveAddress = await this.getGhoReserveAddress();
    const isRiskAdmin = await this.isRiskAdmin(sampleAccount);
    const isGhoGuardian = await this.isGhoGuardian(sampleAccount);

    return {
      minterAddress,
      minterObject,
      ghoTokenAddress,
      collectorAddress,
      directMinterSignerAddress,
      ghoReserveAddress,
      isRiskAdmin,
      isGhoGuardian,
    };
  }
}
