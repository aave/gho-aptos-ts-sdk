import {
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoBurnMintTokenPoolContract } from "../../contracts/gho-ccip/ghoBurnMintTokenPoolContract";
import { GhoProvider } from "../aptosProvider";

export type TokenBucket = {
  tokens: bigint;
  capacity: bigint;
  rate: bigint;
  last_updated: bigint;
  is_enabled: boolean;
};

export type RemoteMapping = {
  exists: boolean;
  remote_token: Uint8Array;
  remote_pools: Uint8Array[];
};

export type AllowlistState = {
  enabled: boolean;
  allowlist: string[];
};

/**
 * Represents the GhoBurnMintTokenPoolClient class which provides methods to interact
 * with the GHO burn/mint token pool contract within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides a comprehensive set of methods for managing
 * token pool operations, including initialization, remote pool management, allowlist configuration,
 * rate limiting, and ownership management.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const tokenPoolClient = GhoBurnMintTokenPoolClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const tokenPoolClient = new GhoBurnMintTokenPoolClient(provider, signer);
 *
 * // Initialize the pool
 * await tokenPoolClient.startInitialize();
 *
 * // Add a remote pool
 * await tokenPoolClient.addRemotePool(remoteChainSelector, remotePoolAddress);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoBurnMintTokenPoolClient extends AptosContractWrapperBaseClass {
  GhoBurnMintTokenPoolContract: GhoBurnMintTokenPoolContract;

  /**
   * Constructs an instance of GhoBurnMintTokenPoolClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoBurnMintTokenPoolContract = new GhoBurnMintTokenPoolContract(
      provider,
    );
  }

  /**
   * Creates an instance of GhoBurnMintTokenPoolClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoBurnMintTokenPoolClient.
   * @returns A new instance of GhoBurnMintTokenPoolClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoBurnMintTokenPoolClient {
    const client = new GhoBurnMintTokenPoolClient(
      provider,
      provider.getGhoProfileAccount(),
    );
    return client;
  }

  // ================================================================
  // |                      Initialization                          |
  // ================================================================

  /**
   * Initializes the burn/mint pool and prepares deployment state.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async startInitialize(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.startInitializeFuncAddr,
      [],
    );
  }

  // ================================================================
  // |                  Remote Pool Management                      |
  // ================================================================

  /**
   * Adds a remote pool for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @param remotePoolAddress Remote pool address (bytes20)
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addRemotePool(
    remoteChainSelector: bigint,
    remotePoolAddress: Uint8Array,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.addRemotePoolFuncAddr,
      [remoteChainSelector.toString(), remotePoolAddress],
    );
  }

  /**
   * Removes a remote pool for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @param remotePoolAddress Remote pool address (bytes20)
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeRemotePool(
    remoteChainSelector: bigint,
    remotePoolAddress: Uint8Array,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.removeRemotePoolFuncAddr,
      [remoteChainSelector.toString(), remotePoolAddress],
    );
  }

  /**
   * Batch update chain mappings and remote tokens.
   * @param remoteChainSelectorsToRemove Chains to remove
   * @param remoteChainSelectorsToAdd Chains to add
   * @param remotePoolAddressesToAdd Pools for each added chain
   * @param remoteTokenAddressesToAdd Remote token for each added chain
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async applyChainUpdates(
    remoteChainSelectorsToRemove: bigint[],
    remoteChainSelectorsToAdd: bigint[],
    remotePoolAddressesToAdd: Uint8Array[][],
    remoteTokenAddressesToAdd: Uint8Array[],
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.applyChainUpdatesFuncAddr,
      [
        remoteChainSelectorsToRemove.map((x) => x.toString()),
        remoteChainSelectorsToAdd.map((x) => x.toString()),
        remotePoolAddressesToAdd,
        remoteTokenAddressesToAdd,
      ],
    );
  }

  // ================================================================
  // |                   Allowlist Management                       |
  // ================================================================

  /**
   * Applies allowlist updates.
   * @param removes Addresses to remove
   * @param adds Addresses to add
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async applyAllowlistUpdates(
    removes: string[],
    adds: string[],
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.applyAllowlistUpdatesFuncAddr,
      [removes, adds],
    );
  }

  // ================================================================
  // |                Rate Limiter Configuration                    |
  // ================================================================

  /**
   * Sets rate-limiter config for a single chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @param outboundIsEnabled Whether outbound is enabled
   * @param outboundCapacity Outbound capacity
   * @param outboundRate Outbound rate
   * @param inboundIsEnabled Whether inbound is enabled
   * @param inboundCapacity Inbound capacity
   * @param inboundRate Inbound rate
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setChainRateLimiterConfig(
    remoteChainSelector: bigint,
    outboundIsEnabled: boolean,
    outboundCapacity: bigint,
    outboundRate: bigint,
    inboundIsEnabled: boolean,
    inboundCapacity: bigint,
    inboundRate: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.setChainRateLimiterConfigFuncAddr,
      [
        remoteChainSelector.toString(),
        outboundIsEnabled,
        outboundCapacity.toString(),
        outboundRate.toString(),
        inboundIsEnabled,
        inboundCapacity.toString(),
        inboundRate.toString(),
      ],
    );
  }

  /**
   * Batch sets rate-limiter configs for multiple chains.
   * @param remoteChainSelectors Chains
   * @param outboundIsEnableds Flags for outbound
   * @param outboundCapacities Outbound capacities
   * @param outboundRates Outbound refill rates
   * @param inboundIsEnableds Flags for inbound
   * @param inboundCapacities Inbound capacities
   * @param inboundRates Inbound refill rates
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setChainRateLimiterConfigs(
    remoteChainSelectors: bigint[],
    outboundIsEnableds: boolean[],
    outboundCapacities: bigint[],
    outboundRates: bigint[],
    inboundIsEnableds: boolean[],
    inboundCapacities: bigint[],
    inboundRates: bigint[],
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.setChainRateLimiterConfigsFuncAddr,
      [
        remoteChainSelectors.map((x) => x.toString()),
        outboundIsEnableds,
        outboundCapacities.map((x) => x.toString()),
        outboundRates.map((x) => x.toString()),
        inboundIsEnableds,
        inboundCapacities.map((x) => x.toString()),
        inboundRates.map((x) => x.toString()),
      ],
    );
  }

  // ================================================================
  // |                  Ownership Management                        |
  // ================================================================

  /**
   * Initiates ownership transfer to a new address.
   * @param to New owner address
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async transferOwnership(
    to: string,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.transferOwnershipFuncAddr,
      [to],
    );
  }

  /**
   * Accepts a pending ownership transfer.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async acceptOwnership(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.acceptOwnershipFuncAddr,
      [],
    );
  }

  /**
   * Executes a two-step ownership transfer.
   * @param to New owner address
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async executeOwnershipTransfer(
    to: string,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolContract.executeOwnershipTransferFuncAddr,
      [to],
    );
  }

  // ================================================================
  // |                      View Functions                          |
  // ================================================================

  /**
   * Returns a human-readable type & version string.
   * @returns A promise that resolves to the module version string.
   */
  public async typeAndVersion(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.typeAndVersionFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns the local token (GHO metadata) address handled by this pool.
   * @returns A promise that resolves to the token address.
   */
  public async getToken(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getTokenFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns the CCIP router address used by this pool.
   * @returns A promise that resolves to the router address.
   */
  public async getRouter(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getRouterFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns decimals of the local token.
   * @returns A promise that resolves to the token decimals.
   */
  public async getTokenDecimals(): Promise<number> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getTokenDecimalsFuncAddr,
      [],
    );
    return Number(resp);
  }

  /**
   * Returns the resource-account address holding the pool state.
   * @returns A promise that resolves to the store address.
   */
  public async getStoreAddress(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getStoreAddressFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns all remote pool addresses registered for a given remote chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @returns A promise that resolves to a vector of remote pool addresses.
   */
  public async getRemotePools(
    remoteChainSelector: bigint,
  ): Promise<Uint8Array[]> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getRemotePoolsFuncAddr,
      [remoteChainSelector],
    );
    return (resp as number[][]).map((arr) => new Uint8Array(arr));
  }

  /**
   * Checks if a specific remote pool is registered for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @param remotePoolAddress Remote pool address (bytes20)
   * @returns A promise that resolves to true if registered.
   */
  public async isRemotePool(
    remoteChainSelector: bigint,
    remotePoolAddress: Uint8Array,
  ): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.isRemotePoolFuncAddr,
      [remoteChainSelector, remotePoolAddress],
    );
    return resp as boolean;
  }

  /**
   * Returns the remote token address registered for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @returns A promise that resolves to the remote token address (bytes32).
   */
  public async getRemoteToken(
    remoteChainSelector: bigint,
  ): Promise<Uint8Array> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getRemoteTokenFuncAddr,
      [remoteChainSelector],
    );
    return new Uint8Array(resp as number[]);
  }

  /**
   * Returns true if a chain is supported (has mapping).
   * @param remoteChainSelector Chain selector (EVM)
   * @returns A promise that resolves to true if supported.
   */
  public async isSupportedChain(remoteChainSelector: bigint): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.isSupportedChainFuncAddr,
      [remoteChainSelector],
    );
    return resp as boolean;
  }

  /**
   * Returns all supported remote chain selectors.
   * @returns A promise that resolves to a vector of chain selectors.
   */
  public async getSupportedChains(): Promise<bigint[]> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getSupportedChainsFuncAddr,
      [],
    );
    return (resp as string[]).map((x) => BigInt(x));
  }

  /**
   * Returns whether a remote mapping exists and, if so, the token and pools for a chain.
   * @param chain Chain selector (EVM)
   * @returns A promise that resolves to (exists, remote_token, remote_pools).
   */
  public async getRemoteMapping(chain: bigint): Promise<RemoteMapping> {
    const [exists, remoteToken, remotePools] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getRemoteMappingFuncAddr,
      [chain],
    );
    return {
      exists: exists as boolean,
      remote_token: new Uint8Array(remoteToken as number[]),
      remote_pools: (remotePools as number[][]).map(
        (arr) => new Uint8Array(arr),
      ),
    };
  }

  /**
   * Returns whether allowlist checks are enabled and the allowlist state.
   * @returns A promise that resolves to (enabled, allowlist).
   */
  public async getAllowlistEnabled(): Promise<AllowlistState> {
    const [enabled, allowlist] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getAllowlistEnabledFuncAddr,
      [],
    );
    return {
      enabled: enabled as boolean,
      allowlist: allowlist as string[],
    };
  }

  /**
   * Returns the current allowlisted senders.
   * @returns A promise that resolves to the allowlist.
   */
  public async getAllowlist(): Promise<string[]> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.getAllowlistFuncAddr,
      [],
    );
    return resp as string[];
  }

  /**
   * Returns current inbound token-bucket state for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @returns A promise that resolves to the TokenBucket snapshot.
   */
  public async getCurrentInboundRateLimiterState(
    remoteChainSelector: bigint,
  ): Promise<TokenBucket> {
    const [bucket] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract
        .getCurrentInboundRateLimiterStateFuncAddr,
      [remoteChainSelector],
    );
    const bucketObj = bucket as any;
    return {
      tokens: BigInt(bucketObj.tokens),
      capacity: BigInt(bucketObj.capacity),
      rate: BigInt(bucketObj.rate),
      last_updated: BigInt(bucketObj.last_updated),
      is_enabled: bucketObj.is_enabled,
    };
  }

  /**
   * Returns current outbound token-bucket state for a chain.
   * @param remoteChainSelector Chain selector (EVM)
   * @returns A promise that resolves to the TokenBucket snapshot.
   */
  public async getCurrentOutboundRateLimiterState(
    remoteChainSelector: bigint,
  ): Promise<TokenBucket> {
    const [bucket] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract
        .getCurrentOutboundRateLimiterStateFuncAddr,
      [remoteChainSelector],
    );
    const bucketObj = bucket as any;
    return {
      tokens: BigInt(bucketObj.tokens),
      capacity: BigInt(bucketObj.capacity),
      rate: BigInt(bucketObj.rate),
      last_updated: BigInt(bucketObj.last_updated),
      is_enabled: bucketObj.is_enabled,
    };
  }

  /**
   * Returns the current owner address.
   * @returns A promise that resolves to the owner address.
   */
  public async owner(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.ownerFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * True if there is a pending ownership transfer.
   * @returns A promise that resolves to true if there is a pending transfer.
   */
  public async hasPendingTransfer(): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.hasPendingTransferFuncAddr,
      [],
    );
    return resp as boolean;
  }

  /**
   * Address that initiated the pending transfer (if any).
   * @returns A promise that resolves to the pending transfer from address.
   */
  public async pendingTransferFrom(): Promise<string | null> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.pendingTransferFromFuncAddr,
      [],
    );
    const option = resp as any;
    return option.vec && option.vec.length > 0 ? option.vec[0] : null;
  }

  /**
   * Address set to receive ownership (if any).
   * @returns A promise that resolves to the pending transfer to address.
   */
  public async pendingTransferTo(): Promise<string | null> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.pendingTransferToFuncAddr,
      [],
    );
    const option = resp as any;
    return option.vec && option.vec.length > 0 ? option.vec[0] : null;
  }

  /**
   * Whether the pending transfer has been accepted (if any).
   * @returns A promise that resolves to true if accepted.
   */
  public async pendingTransferAccepted(): Promise<boolean | null> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolContract.pendingTransferAcceptedFuncAddr,
      [],
    );
    const option = resp as any;
    return option.vec && option.vec.length > 0 ? option.vec[0] : null;
  }
}
