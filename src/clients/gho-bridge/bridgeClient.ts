import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
  MoveVector,
  Network,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoProvider } from "../aptosProvider";
import {
  SupportedTestnetChain,
  SupportedMainnetChain,
  SupportedChain,
  TESTNET_CHAIN_SELECTORS,
  MAINNET_CHAIN_SELECTORS,
} from "../../configs/bridge";

/**
 * Configuration for the CCIP Router on Aptos
 */
export interface BridgeConfig {
  ccipRouterAddress: AccountAddress;
  ghoTokenAddress: AccountAddress;
  aptFeeTokenAddress: AccountAddress;
}

// Re-export types for convenience
export { SupportedTestnetChain, SupportedMainnetChain, SupportedChain };

/**
 * Parameters for bridging GHO tokens
 */
export interface BridgeParams {
  /** Amount of GHO to bridge (in smallest units, 6 decimals) */
  amount: bigint;
  /** Destination chain */
  destinationChain: SupportedChain;
  /** Receiver address on the destination chain (EVM address) */
  receiverAddress: string;
  /** Optional: Custom gas limit for the destination chain (default: 0 for token-only transfers per CCIP docs) */
  gasLimit?: bigint;
  /** Optional: Allow out-of-order execution (default: true) */
  allowOutOfOrder?: boolean;
  /** Optional: Additional data payload (default: empty) */
  data?: Uint8Array;
}

/**
 * Response from a bridge transaction
 */
export interface BridgeResponse {
  response: CommittedTransactionResponse;
  explorerUrl: string;
  ccipTrackerUrl: string;
}

/**
 * Result from bridge parameter validation
 */
export interface BridgeValidationResult {
  isValid: boolean;
  reason?: string;
  ghoBalance: bigint;
  requiredAmount: bigint;
}

/**
 * Represents the GhoBridgeClient class which provides methods to bridge GHO tokens from Aptos
 * to EVM-compatible chains using Chainlink's Cross-Chain Interoperability Protocol (CCIP).
 * 
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides a comprehensive set of methods for
 * managing cross-chain GHO transfers, including bridging operations, transaction simulation, amount
 * validation, and balance checking.
 * 
 * The client handles:
 * - Encoding of CCIP extra arguments (V2 format)
 * - EVM address formatting (padding to 32 bytes)
 * - Amount conversion utilities (6 decimal places for GHO)
 * - Transaction building and submission
 * - Pre-bridge validation and simulation
 * 
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider, signer, and configuration
 * 2. Using the static buildWithDefaults method which automatically configures the client with default settings
 * 
 * @example
 * ```typescript
 * // Using buildWithDefaults
 * const provider = new GhoProvider(config);
 * const signer = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(privateKey) });
 * const bridgeClient = GhoBridgeClient.buildWithDefaults(
 *   provider,
 *   signer,
 *   AccountAddress.fromString(CCIP_ROUTER_ADDRESS),
 *   AccountAddress.fromString(GHO_TOKEN_ADDRESS)
 * );
 * 
 * // Using constructor directly
 * const bridgeClient = new GhoBridgeClient(provider, signer, {
 *   ccipRouterAddress: AccountAddress.fromString("0x..."),
 *   ghoTokenAddress: AccountAddress.fromString("0x..."),
 *   aptFeeTokenAddress: AccountAddress.fromString("0xa"),
 * });
 * 
 * // Validate before bridging
 * const validation = await bridgeClient.validateBridge({
 *   amount: GhoBridgeClient.parseAmount("1.0"),
 *   destinationChain: SupportedChain.ARBITRUM_SEPOLIA,
 *   receiverAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
 * });
 * 
 * // Bridge GHO tokens
 * const response = await bridgeClient.bridgeGHO({
 *   amount: GhoBridgeClient.parseAmount("1.0"),
 *   destinationChain: SupportedChain.ARBITRUM_SEPOLIA,
 *   receiverAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
 * });
 * 
 * console.log(`Transaction: ${response.explorerUrl}`);
 * console.log(`Track CCIP: ${response.ccipTrackerUrl}`);
 * ```
 * 
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - The Ed25519Account signer for transaction signing.
 * @param config - The bridge configuration containing router and token addresses.
 */
export class GhoBridgeClient extends AptosContractWrapperBaseClass {
  private readonly config: BridgeConfig;
  private readonly chainSelectors: Readonly<Record<string, bigint>>;
  private readonly isMainnet: boolean;

  /**
   * Constructs an instance of GhoBridgeClient.
   * @param provider - The GhoProvider instance.
   * @param signer - The Ed25519Account signer for signing transactions.
   * @param config - The bridge configuration containing router and token addresses.
   */
  constructor(
    provider: GhoProvider,
    signer: Ed25519Account,
    config: BridgeConfig,
  ) {
    super(provider, signer);
    this.config = config;
    
    // Cache network type for efficiency
    const network = provider.getNetwork();
    this.isMainnet = this.detectMainnet(network);
    
    // Dynamically select chain selectors based on network (immutable)
    this.chainSelectors = this.isMainnet
      ? (MAINNET_CHAIN_SELECTORS as Record<string, bigint>)
      : (TESTNET_CHAIN_SELECTORS as Record<string, bigint>);
  }

  /**
   * Detects if the network is mainnet.
   * @param network - The Aptos network
   * @returns true if mainnet, false otherwise
   */
  private detectMainnet(network: Network): boolean {
    const networkStr = network.toString().toLowerCase();
    return networkStr.includes('mainnet');
  }

  /**
   * Creates a GhoBridgeClient with default configuration.
   * 
   * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
   * @param signer - The Ed25519Account for signing transactions.
   * @param ccipRouterAddress - The address of the CCIP router contract on Aptos.
   * @param ghoTokenAddress - The address of the GHO token on Aptos.
   * @returns A configured GhoBridgeClient instance.
   */
  public static buildWithDefaults(
    provider: GhoProvider,
    signer: Ed25519Account,
    ccipRouterAddress: AccountAddress,
    ghoTokenAddress: AccountAddress,
  ): GhoBridgeClient {
    const aptFeeTokenAddress = AccountAddress.fromString("0xa"); // APT metadata address

    return new GhoBridgeClient(provider, signer, {
      ccipRouterAddress,
      ghoTokenAddress,
      aptFeeTokenAddress,
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // View Functions - Fee Estimation
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Estimates the fee required for bridging GHO tokens to a destination chain.
   * 
   * @param params - Bridge parameters to estimate fees for.
   * @returns A promise that resolves to the estimated fee amount in APT (octas).
   * 
   * @throws Error if the destination chain is not supported.
   * @throws Error if the fee query fails.
   * 
   * @remarks
   * Per CCIP documentation, token-only transfers should use gasLimit = 0.
   * 
   * @example
   * ```typescript
   * const estimatedFee = await bridgeClient.estimateBridgeFee({
   *   amount: 1000000n, // 1 GHO
   *   destinationChain: SupportedTestnetChain.ARBITRUM_SEPOLIA,
   *   receiverAddress: "0x1234...",
   * });
   * console.log(`Bridge fee: ${estimatedFee} octas`);
   * ```
   */
  public async estimateBridgeFee(params: BridgeParams): Promise<bigint> {
    const {
      amount,
      destinationChain,
      receiverAddress,
      gasLimit = 0n, // Default to 0 for token-only transfers per CCIP docs
      allowOutOfOrder = true,
      data = new Uint8Array([]),
    } = params;

    // Get chain selector
    const chainSelector = this.chainSelectors[destinationChain];
    if (!chainSelector) {
      const supportedChains = Object.keys(this.chainSelectors).join(", ");
      throw new Error(
        `Unsupported destination chain: ${destinationChain}. Supported chains: ${supportedChains}`,
      );
    }

    // Encode parameters
    const encodedReceiver = this.padEvmAddress(receiverAddress);
    const extraArgs = this.encodeExtraArgsV2(gasLimit, allowOutOfOrder);

    try {
      // Query the CCIP router's get_fee function
      const functionId: `${string}::${string}::${string}` = 
        `${this.config.ccipRouterAddress.toString()}::router::get_fee` as `${string}::${string}::${string}`;

      const [feeResult] = await this.callViewMethod(functionId, [
        chainSelector.toString(), // Chain selector as string
        Array.from(encodedReceiver), // Receiver as array
        Array.from(data), // Data as array
        [this.config.ghoTokenAddress.toString()], // Token addresses
        [amount.toString()], // Amounts as string array
        ["0x0"], // Pools - one pool address per token (0x0 = use sender's primary store)
        this.config.aptFeeTokenAddress.toString(), // Fee token
        "0x0", // Fee recipient
        Array.from(extraArgs), // Extra args as array
      ]);

      return BigInt(feeResult as string);
    } catch (error) {
      // If fee query fails, return a default fallback fee
      console.warn(
        `Fee estimation failed, using default fee: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return 100000000n; // 1 APT default fallback
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Entry Functions - Bridge Operations
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Bridges GHO tokens from Aptos to a supported EVM chain via CCIP.
   * 
   * @param params - Bridge parameters including amount, chain, and receiver.
   * @param params.amount - Amount of GHO to bridge in smallest units (6 decimals).
   * @param params.destinationChain - The target blockchain to bridge to.
   * @param params.receiverAddress - The EVM wallet address on the destination chain.
   * @param params.gasLimit - Optional custom gas limit for destination chain (default: 0 for token-only transfers).
   * @param params.allowOutOfOrder - Optional flag to allow out-of-order execution (default: true).
   * @param params.data - Optional additional data payload (default: empty).
   * @returns A promise that resolves to the bridge transaction response with URLs.
   * 
   * @throws Error if the destination chain is not supported.
   * @throws Error if the receiver address is invalid.
   * @throws Error if the transaction fails.
   * 
   * @remarks
   * Per CCIP documentation: Token-only transfers use gasLimit = 0 and may require manual execution
   * on testnet. This is expected behavior for Aptos → EVM token bridges.
   */
  public async bridgeGHO(params: BridgeParams): Promise<BridgeResponse> {
    const {
      amount,
      destinationChain,
      receiverAddress,
      gasLimit = 0n, // Default to 0 for token-only transfers per CCIP docs
      allowOutOfOrder = true,
      data = new Uint8Array([]),
    } = params;

    // Get chain selector dynamically based on network
    const chainSelector = this.chainSelectors[destinationChain];
    if (!chainSelector) {
      const supportedChains = Object.keys(this.chainSelectors).join(", ");
      throw new Error(
        `Unsupported destination chain: ${destinationChain}. Supported chains for current network: ${supportedChains}`,
      );
    }

    // STEP 1: Estimate the required fee for CCIP execution
    // Note: CCIP will automatically deduct this fee from the sender's APT balance
    console.log("🔍 Estimating CCIP bridge fee...");
    const requiredFee = await this.estimateBridgeFee(params);
    console.log(`✅ Estimated fee: ${requiredFee} octas (${Number(requiredFee) / 100000000} APT)`);

    // STEP 2: Check user has enough APT for fees (CCIP auto-deducts this amount)
    const aptBalance = await this.getAptBalance(this.signer.accountAddress);
    if (aptBalance < requiredFee) {
      throw new Error(
        `Insufficient APT for bridge fees. Required: ${requiredFee} octas (${Number(requiredFee) / 100000000} APT), Available: ${aptBalance} octas (${Number(aptBalance) / 100000000} APT)`,
      );
    }
    console.log(`✅ APT balance check passed: ${aptBalance} octas available`);

    // Encode receiver address (EVM) to 32 bytes
    const encodedReceiver = this.padEvmAddress(receiverAddress);

    // Encode extra args (V2)
    const extraArgs = this.encodeExtraArgsV2(gasLimit, allowOutOfOrder);

    // STEP 3: Build the transaction (CCIP auto-deducts fees based on estimation)
    const functionId: `${string}::${string}::${string}` = 
      `${this.config.ccipRouterAddress.toString()}::router::ccip_send` as `${string}::${string}::${string}`;
    
    const functionArguments = [
      chainSelector.toString(), // Chain selector as string (matching working UI)
      Array.from(encodedReceiver), // Receiver as array (matching working UI)
      Array.from(data), // Data as array (matching working UI)
      [this.config.ghoTokenAddress.toString()], // Token addresses as array
      [amount.toString()], // Amounts as string array (matching working UI)
      ["0x0"], // Pools - one pool address per token (0x0 = use sender's primary store)
      this.config.aptFeeTokenAddress.toString(), // Fee token
      "0x0", // Fee recipient address (CCIP auto-deducts the calculated fee)
      Array.from(extraArgs), // Extra args as array (matching working UI)
    ];

    // DEBUG: Log token address being passed to CCIP
    console.log("🔍 DEBUG - Token address being passed to CCIP:");
    console.log("  Token address:", this.config.ghoTokenAddress.toString());
    console.log("  Token addresses array:", [this.config.ghoTokenAddress.toString()]);
    console.log("  Full functionArguments:", JSON.stringify(functionArguments, null, 2));

    // Send transaction and await response
    const response = await this.sendTxAndAwaitResponse(
      functionId,
      functionArguments,
    );

    // Extract CCIP message ID from events
    let ccipMessageId: string | undefined;
    if ('events' in response && Array.isArray(response.events)) {
      for (const event of response.events) {
        // Look for CCIP send event - check multiple possible event type patterns
        const eventType = event.type.toLowerCase();
        if (eventType.includes("ccipsend") || 
            eventType.includes("ccip_send") || 
            eventType.includes("sendrequest") ||
            eventType.includes("router::") ||
            eventType.includes("message")) {
          
          // Try to extract message ID from event data - check multiple formats
          const eventData = event.data as any;
          
          // Format 1: Nested in message.header.message_id (CCIPMessageSent event structure)
          if (eventData?.message?.header?.message_id) {
            ccipMessageId = eventData.message.header.message_id;
            break;
          }
          
          // Format 2: Direct message_id field
          if (eventData?.message_id) {
            ccipMessageId = eventData.message_id;
            break;
          }
          
          // Format 3: messageId field
          if (eventData?.messageId) {
            ccipMessageId = eventData.messageId;
            break;
          }
          
          // Format 4: Nested in data object
          if (eventData?.data?.message_id) {
            ccipMessageId = eventData.data.message_id;
            break;
          }
          
          // Format 5: Check if the entire event data is the message ID (32 bytes hex)
          if (typeof eventData === 'string' && eventData.startsWith('0x') && eventData.length === 66) {
            ccipMessageId = eventData;
            break;
          }
        }
      }
    }

    // Build response with additional URLs
    const network = this.aptosProvider.getAptos().config.network;
    const explorerUrl = `https://explorer.aptoslabs.com/txn/${response.hash}?network=${network}`;
    
    // Build CCIP tracker URL with message ID if available
    const ccipTrackerUrl = ccipMessageId 
      ? `https://ccip.chain.link/msg/${ccipMessageId}`
      : `https://ccip.chain.link`;

    return {
      response,
      explorerUrl,
      ccipTrackerUrl,
    };
  }

  /**
   * Validates bridge parameters before submission.
   * This is useful for frontend validation before submitting a transaction.
   * 
   * @param params - Bridge parameters to validate.
   * @returns A promise that resolves to a validation result object containing:
   *   - isValid: boolean indicating if the bridge parameters are valid.
   *   - reason: string explaining why validation failed (only present if isValid is false).
   *   - ghoBalance: the user's current GHO balance.
   *   - requiredAmount: the amount of GHO required for the bridge.
   * @throws Error with descriptive message if validation fails.
   */
  public async validateBridge(
    params: BridgeParams,
  ): Promise<BridgeValidationResult> {
    const { amount, destinationChain, receiverAddress } = params;

    // Validate chain
    const chainSelector = this.chainSelectors[destinationChain];
    if (!chainSelector) {
      const supportedChains = Object.keys(this.chainSelectors).join(", ");
      throw new Error(
        `Unsupported destination chain: ${destinationChain}. Supported chains for current network: ${supportedChains}`,
      );
    }

    // Validate EVM address
    if (!GhoBridgeClient.isValidEvmAddress(receiverAddress)) {
      throw new Error(
        `Invalid EVM address: ${receiverAddress}. Address must be a valid 20-byte Ethereum address.`,
      );
    }

    // Validate amount
    if (amount <= 0n) {
      throw new Error(
        `Invalid amount: ${amount}. Amount must be greater than zero.`,
      );
    }

    // Check user's GHO balance
    const ghoBalance = await this.getGhoBalance(this.signer.accountAddress);

    if (ghoBalance < amount) {
      const shortfall = amount - ghoBalance;
      const reason = `Insufficient GHO balance. Required: ${GhoBridgeClient.formatAmount(amount)} GHO, Available: ${GhoBridgeClient.formatAmount(ghoBalance)} GHO, Shortfall: ${GhoBridgeClient.formatAmount(shortfall)} GHO`;
      throw new Error(reason);
    }

    return {
      isValid: true,
      ghoBalance,
      requiredAmount: amount,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // View Functions - Simulation & Queries
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Simulates a bridge transaction without submitting it to the blockchain.
   * Useful for estimating gas costs and validating parameters before execution.
   * 
   * @param params - Bridge parameters to simulate.
   * @returns A promise that resolves to the simulation result from the Aptos SDK.
   * 
   * @throws Error if the destination chain is not supported.
   * @throws Error if the receiver address is invalid.
   * 
   * @remarks
   * Per CCIP documentation, token-only transfers should use gasLimit = 0.
   */
  public async simulateBridge(params: BridgeParams) {
    const {
      amount,
      destinationChain,
      receiverAddress,
      gasLimit = 0n, // Default to 0 for token-only transfers per CCIP docs
      allowOutOfOrder = true,
      data = new Uint8Array([]),
    } = params;

    const chainSelector = this.chainSelectors[destinationChain];
    if (!chainSelector) {
      const supportedChains = Object.keys(this.chainSelectors).join(", ");
      throw new Error(
        `Unsupported destination chain: ${destinationChain}. Supported chains for current network: ${supportedChains}`,
      );
    }

    // Estimate fee for simulation
    const requiredFee = await this.estimateBridgeFee(params);

    const encodedReceiver = this.padEvmAddress(receiverAddress);
    const extraArgs = this.encodeExtraArgsV2(gasLimit, allowOutOfOrder);

    const txn = await this.aptosProvider.getAptos().transaction.build.simple({
      sender: this.signer.accountAddress,
      data: {
        function: `${this.config.ccipRouterAddress.toString()}::router::ccip_send` as `${string}::${string}::${string}`,
        functionArguments: [
          chainSelector.toString(), // Chain selector as string
          Array.from(encodedReceiver), // Receiver as array
          Array.from(data), // Data as array
          [this.config.ghoTokenAddress.toString()], // Token addresses
          [amount.toString()], // Amounts as string array
          ["0x0"], // Pools - one pool address per token (0x0 = use sender's primary store)
          this.config.aptFeeTokenAddress.toString(), // Fee token
          "0x0", // Fee recipient (CCIP auto-deducts the calculated fee)
          Array.from(extraArgs), // Extra args as array
        ],
      },
    });

    const [simulation] = await this.aptosProvider
      .getAptos()
      .transaction.simulate.simple({
        signerPublicKey: this.signer.publicKey,
        transaction: txn,
      });

    return simulation;
  }

  /**
   * Gets the GHO balance for a given user address.
   * This is useful for validating if a user has enough balance before bridging.
   * 
   * @param userAddress - The address of the user whose balance to check.
   * @returns A promise that resolves to the user's GHO balance in smallest units.
   * 
   * @throws Error if the balance query fails.
   */
  public async getGhoBalance(userAddress: AccountAddress): Promise<bigint> {
    try {
      const balance = await this.aptosProvider
        .getAptos()
        .getCurrentFungibleAssetBalances({
          options: {
            where: {
              owner_address: { _eq: userAddress.toString() },
              asset_type: { _eq: this.config.ghoTokenAddress.toString() },
            },
          },
        });

      if (balance && balance.length > 0) {
        return BigInt(balance[0].amount);
      }
      // User has no GHO balance
      return 0n;
    } catch (error) {
      // Network or API error
      throw new Error(
        `Failed to fetch GHO balance for user ${userAddress.toString()}: ${error.message}`,
      );
    }
  }

  /**
   * Gets the APT balance for a given user address.
   * This is useful for checking if a user has enough APT to pay for transaction fees.
   * 
   * @param userAddress - The address of the user whose balance to check.
   * @returns A promise that resolves to the user's APT balance in octas.
   * 
   * @throws Error if the balance query fails.
   */
  public async getAptBalance(userAddress: AccountAddress): Promise<bigint> {
    try {
      const amount = await this.aptosProvider
        .getAptos()
        .getAccountAPTAmount({ accountAddress: userAddress });
      return BigInt(amount);
    } catch (error) {
      throw new Error(
        `Failed to fetch APT balance for user ${userAddress.toString()}: ${error.message}`,
      );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Static Utility Methods
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Converts a human-readable GHO amount string to the smallest unit (6 decimals).
   * 
   * @param amount - Amount in GHO as a string (e.g., "1.5" for 1.5 GHO).
   * @returns Amount in smallest units as bigint.
   * 
   * @example
   * ```typescript
   * GhoBridgeClient.parseAmount("1.5")     // returns 1500000n
   * GhoBridgeClient.parseAmount("0.001")   // returns 1000n
   * GhoBridgeClient.parseAmount("10")      // returns 10000000n
   * ```
   */
  public static parseAmount(amount: string): bigint {
    const [whole, frac = ""] = amount.split(".");
    const paddedFrac = frac.padEnd(6, "0").slice(0, 6);
    return BigInt(whole + paddedFrac);
  }

  /**
   * Converts amount from smallest units back to human-readable format.
   * 
   * @param amount - Amount in smallest units as bigint.
   * @returns Formatted string with up to 6 decimal places.
   * 
   * @example
   * ```typescript
   * GhoBridgeClient.formatAmount(1500000n)  // returns "1.5"
   * GhoBridgeClient.formatAmount(1000n)     // returns "0.001"
   * GhoBridgeClient.formatAmount(10000000n) // returns "10"
   * ```
   */
  public static formatAmount(amount: bigint): string {
    const str = amount.toString().padStart(7, "0");
    const whole = str.slice(0, -6) || "0";
    const frac = str.slice(-6).replace(/0+$/, "");
    return frac ? `${whole}.${frac}` : whole;
  }

  /**
   * Gets the CCIP chain selector for a supported destination chain.
   * 
   * @param chain - The destination chain enum value.
   * @param isMainnet - Whether to get mainnet selector (default: false for testnet).
   * @returns The CCIP chain selector as bigint.
   */
  public static getChainSelector(
    chain: SupportedChain,
    isMainnet: boolean = false,
  ): bigint {
    const selectors = isMainnet
      ? MAINNET_CHAIN_SELECTORS
      : TESTNET_CHAIN_SELECTORS;
    return selectors[chain as keyof typeof selectors];
  }

  /**
   * Gets all supported destination chains for bridging.
   * 
   * @param isMainnet - Whether to get mainnet chains (default: false for testnet).
   * @returns Array of supported chain enum values.
   */
  public static getSupportedChains(isMainnet: boolean = false): SupportedChain[] {
    return isMainnet
      ? Object.values(SupportedMainnetChain)
      : Object.values(SupportedTestnetChain);
  }

  /**
   * Gets the supported chains for the current instance based on its network.
   * 
   * @returns Array of supported chain enum values for the current network.
   */
  public getSupportedChainsForNetwork(): SupportedChain[] {
    return Object.keys(this.chainSelectors) as SupportedChain[];
  }

  /**
   * Gets the chain selector for a chain on the current network.
   * 
   * @param chain - The destination chain enum value.
   * @returns The CCIP chain selector as bigint, or undefined if not supported.
   */
  public getChainSelectorForNetwork(chain: SupportedChain): bigint | undefined {
    return this.chainSelectors[chain];
  }

  /**
   * Validates an EVM address format (20 bytes, 40 hex characters).
   * 
   * @param address - EVM address to validate (with or without 0x prefix).
   * @returns true if the address is valid, false otherwise.
   * 
   * @example
   * ```typescript
   * GhoBridgeClient.isValidEvmAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")  // true
   * GhoBridgeClient.isValidEvmAddress("742d35Cc6634C0532925a3b844Bc9e7595f0bEb")    // true
   * GhoBridgeClient.isValidEvmAddress("0xinvalid")                                   // false
   * ```
   */
  public static isValidEvmAddress(address: string): boolean {
    const cleaned = address.startsWith("0x") ? address.slice(2) : address;
    return /^[0-9a-fA-F]{40}$/.test(cleaned);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Private Helper Methods
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Encodes CCIP extra arguments (V2 format).
   * 
   * @param gasLimit - Gas limit for destination chain (0 for auto)
   * @param allowOutOfOrder - Whether to allow out-of-order execution
   * @returns Encoded bytes
   */
  private encodeExtraArgsV2(
    gasLimit: bigint,
    allowOutOfOrder: boolean,
  ): Uint8Array {
    // GENERIC_EXTRA_ARGS_V2_TAG
    const tag = new Uint8Array([0x18, 0x1d, 0xcf, 0x10]);

    // BCS encode u256 gas_limit (32 bytes little-endian)
    const gasLimitBytes = new Uint8Array(32);
    let tempGasLimit = gasLimit;
    for (let i = 0; i < 32 && tempGasLimit > 0n; i++) {
      gasLimitBytes[i] = Number(tempGasLimit & 0xffn);
      tempGasLimit >>= 8n;
    }

    // BCS encode bool allow_out_of_order (1 byte)
    const allowOOOByte = new Uint8Array([allowOutOfOrder ? 1 : 0]);

    // Concatenate: tag + gasLimit + allowOOO
    const result = new Uint8Array(
      tag.length + gasLimitBytes.length + allowOOOByte.length,
    );
    result.set(tag, 0);
    result.set(gasLimitBytes, tag.length);
    result.set(allowOOOByte, tag.length + gasLimitBytes.length);

    return result;
  }

  /**
   * Pads an EVM address (20 bytes) to 32 bytes for CCIP.
   * 
   * @param address - EVM address (with or without 0x prefix)
   * @returns 32-byte padded address
   * @throws Error if address is invalid
   */
  private padEvmAddress(address: string): Uint8Array {
    if (!GhoBridgeClient.isValidEvmAddress(address)) {
      throw new Error(`Invalid EVM address: ${address}`);
    }

    const cleaned = address.startsWith("0x") ? address.slice(2) : address;
    const addressBytes = new Uint8Array(20);

    for (let i = 0; i < 20; i++) {
      addressBytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
    }

    // Pad to 32 bytes (12 zeros + 20 bytes address)
    const padded = new Uint8Array(32);
    padded.set(addressBytes, 12);

    return padded;
  }
}
