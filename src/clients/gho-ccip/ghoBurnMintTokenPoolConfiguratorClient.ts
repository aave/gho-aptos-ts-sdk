import {
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoBurnMintTokenPoolConfiguratorContract } from "../../contracts/gho-ccip/ghoBurnMintTokenPoolConfiguratorContract";
import { GhoProvider } from "../aptosProvider";

export type ConfigSummary = {
  initialized: boolean;
  store: string;
  remote_chain_selector: bigint;
  remote_token_address: Uint8Array;
  remote_pool_address: Uint8Array;
  bridge_inbound_capacity: bigint;
  bridge_inbound_rate: bigint;
};

export type TokenBucket = {
  tokens: bigint;
  capacity: bigint;
  rate: bigint;
  last_updated: bigint;
  is_enabled: boolean;
};

/**
 * Represents the GhoBurnMintTokenPoolConfiguratorClient class which provides methods to interact
 * with the GHO burn/mint token pool configurator contract within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides a comprehensive set of methods for managing
 * pool configuration operations, including initializing pools, configuring counterparts, managing rate limits,
 * and querying state.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO module account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const configuratorClient = GhoBurnMintTokenPoolConfiguratorClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoModuleAccount();
 * const configuratorClient = new GhoBurnMintTokenPoolConfiguratorClient(provider, signer);
 *
 * // Initialize a pool
 * await configuratorClient.initPool(
 *   admin,
 *   remoteChainSelector,
 *   remoteTokenAddress,
 *   remotePoolAddress,
 *   bridgeInboundCapacity,
 *   bridgeInboundRate
 * );
 *
 * // Configure the pool
 * await configuratorClient.configurePool(owner);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoBurnMintTokenPoolConfiguratorClient extends AptosContractWrapperBaseClass {
  GhoBurnMintTokenPoolConfiguratorContract: GhoBurnMintTokenPoolConfiguratorContract;

  /**
   * Constructs an instance of GhoBurnMintTokenPoolConfiguratorClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoBurnMintTokenPoolConfiguratorContract =
      new GhoBurnMintTokenPoolConfiguratorContract(provider);
  }

  /**
   * Creates an instance of GhoBurnMintTokenPoolConfiguratorClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoBurnMintTokenPoolConfiguratorClient.
   * @returns A new instance of GhoBurnMintTokenPoolConfiguratorClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoBurnMintTokenPoolConfiguratorClient {
    const client = new GhoBurnMintTokenPoolConfiguratorClient(
      provider,
      provider.getGhoProfileAccount(),
    );
    return client;
  }

  /**
   * Initializes the burn/mint pool and persists the remote counterpart details.
   * @param remoteChainSelector EVM chain selector to pair with
   * @param remoteTokenAddress EVM token address (20 or 32 bytes; normalized)
   * @param remotePoolAddress EVM pool address (20 bytes)
   * @param bridgeInboundCapacity Inbound capacity to set
   * @param bridgeInboundRate Inbound rate to set
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initPool(
    remoteChainSelector: bigint,
    remoteTokenAddress: Uint8Array,
    remotePoolAddress: Uint8Array,
    bridgeInboundCapacity: bigint,
    bridgeInboundRate: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract.initPoolFuncAddr,
      [
        remoteChainSelector.toString(),
        remoteTokenAddress,
        remotePoolAddress,
        bridgeInboundCapacity.toString(),
        bridgeInboundRate.toString(),
      ],
    );
  }

  /**
   * Applies the saved remote counterpart mapping and configures inbound rate limits.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async configurePool(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract.configurePoolFuncAddr,
      [],
    );
  }

  /**
   * Updates the remote counterpart (chain/token/pool) and applies it to the pool.
   * @param remoteChainSelector New remote chain selector
   * @param remoteTokenAddress New remote token address (20/32 bytes; normalized)
   * @param remotePoolAddress New remote pool address (20 bytes)
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setCounterpartAndApply(
    remoteChainSelector: bigint,
    remoteTokenAddress: Uint8Array,
    remotePoolAddress: Uint8Array,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract
        .setCounterpartAndApplyFuncAddr,
      [remoteChainSelector.toString(), remoteTokenAddress, remotePoolAddress],
    );
  }

  /**
   * Sets inbound token-bucket capacity and rate for the saved remote chain.
   * @param bridgeInboundCapacity New inbound capacity
   * @param bridgeInboundRate New inbound rate
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setInboundLimits(
    bridgeInboundCapacity: bigint,
    bridgeInboundRate: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract.setInboundLimitsFuncAddr,
      [bridgeInboundCapacity.toString(), bridgeInboundRate.toString()],
    );
  }

  /**
   * Pauses inbound transfers by setting inbound bucket to (0, 0).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async pauseInbound(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract.pauseInboundFuncAddr,
      [],
    );
  }

  /**
   * Resumes inbound transfers by restoring the saved inbound bucket.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async resumeInbound(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoBurnMintTokenPoolConfiguratorContract.resumeInboundFuncAddr,
      [],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Returns a human-readable type & version string.
   * @returns A promise that resolves to the module version string.
   */
  public async typeAndVersion(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolConfiguratorContract.typeAndVersionFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns the OBJECT address where the configurator state is stored.
   * @returns A promise that resolves to the state OBJECT address.
   */
  public async getStoreAddress(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolConfiguratorContract.getStoreAddressFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Returns the saved remote chain selector, token address and pool address.
   * @returns A promise that resolves to a tuple of (remote_chain_selector, remote_token_address, remote_pool_address).
   */
  public async getRemoteChainEntities(): Promise<
    [bigint, Uint8Array, Uint8Array]
  > {
    const [chainSelector, tokenAddress, poolAddress] =
      await this.callViewMethod(
        this.GhoBurnMintTokenPoolConfiguratorContract
          .getRemoteChainEntitiesFuncAddr,
        [],
      );
    return [
      BigInt(chainSelector as string),
      new Uint8Array(tokenAddress as number[]),
      new Uint8Array(poolAddress as number[]),
    ];
  }

  /**
   * Returns whether the pool was initialized via this configurator.
   * @returns A promise that resolves to true if initialized.
   */
  public async isPoolInitialized(): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolConfiguratorContract.isPoolInitializedFuncAddr,
      [],
    );
    return resp as boolean;
  }

  /**
   * Returns a consolidated snapshot of the current configuration.
   * @returns A promise that resolves to ConfigSummary with all key fields.
   */
  public async getConfigSummary(): Promise<ConfigSummary> {
    const [summary] = await this.callViewMethod(
      this.GhoBurnMintTokenPoolConfiguratorContract.getConfigSummaryFuncAddr,
      [],
    );

    const summaryObj = summary as any;

    return {
      initialized: summaryObj.initialized,
      store: summaryObj.store,
      remote_chain_selector: BigInt(summaryObj.remote_chain_selector),
      remote_token_address: new Uint8Array(summaryObj.remote_token_address),
      remote_pool_address: new Uint8Array(summaryObj.remote_pool_address),
      bridge_inbound_capacity: BigInt(summaryObj.bridge_inbound_capacity),
      bridge_inbound_rate: BigInt(summaryObj.bridge_inbound_rate),
    };
  }
}
