import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoGsmStewardContract } from "../../contracts/gho-stewards/ghoGsmStewardContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type GsmTimelockData = {
  gsm_exposure_cap_last_updated: bigint;
  gsm_fee_strategy_last_updated: bigint;
};

export type GsmStewardDetails = {
  feeRateChangeMax: bigint;
  minimumDelay: bigint;
  // Per-GSM if provided
  timelocks?: GsmTimelockData;
};

/**
 * Represents the GhoGsmStewardClient class which provides methods to interact with the Gho Gsm Steward contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides methods for updating GSM parameters like exposure caps and fees,
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
 * const ghoGsmStewardClient = GhoGsmStewardClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoProfileAccount();
 * const ghoGsmStewardClient = new GhoGsmStewardClient(provider, signer);
 *
 * // Initialize steward
 * await ghoGsmStewardClient.initialize(riskCouncil);
 *
 * // Update exposure cap
 * await ghoGsmStewardClient.updateGsmExposureCap(gsmAddress, newExposureCap);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoGsmStewardClient extends AptosContractWrapperBaseClass {
  GhoGsmStewardContract: GhoGsmStewardContract;

  /**
   * Constructs an instance of GhoGsmStewardClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoGsmStewardContract = new GhoGsmStewardContract(provider);
  }

  /**
   * Creates an instance of GhoGsmStewardClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoGsmStewardClient.
   * @returns A new instance of GhoGsmStewardClient.
   */
  public static buildWithDefaultSigner(
    provider: GhoProvider,
  ): GhoGsmStewardClient {
    const signer = provider.getGhoProfileAccount();
    const client = new GhoGsmStewardClient(provider, signer);
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Initialization and Updates
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Initializes the Gho Gsm Steward.
   * @param riskCouncil The risk council address.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async initialize(
    riskCouncil: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoGsmStewardContract.initializeFuncAddr,
      [riskCouncil.toString()],
    );
  }

  /**
   * Updates the exposure cap of the GSM.
   * @param gsmAddress Address of the GSM to update.
   * @param newExposureCap The new exposure cap (U128).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGsmExposureCap(
    gsmAddress: AccountAddress,
    newExposureCap: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoGsmStewardContract.updateGsmExposureCapFuncAddr,
      [gsmAddress.toString(), newExposureCap.toString()],
    );
  }

  /**
   * Updates the fixed percent fees of the GSM.
   * @param gsmAddress Address of the GSM to update.
   * @param feeStrategyName The name of the new fee strategy (Uint8Array).
   * @param buyFee The new buy fee (U256).
   * @param sellFee The new sell fee (U256).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async updateGsmBuySellFees(
    gsmAddress: AccountAddress,
    feeStrategyName: Uint8Array,
    buyFee: bigint,
    sellFee: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoGsmStewardContract.updateGsmBuySellFeesFuncAddr,
      [
        gsmAddress.toString(),
        feeStrategyName,
        buyFee.toString(),
        sellFee.toString(),
      ],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // View Functions
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Returns timestamp of the last update of Gsm parameters.
   * @param gsmAddress The GSM address.
   * @returns A promise that resolves to [U64, U64] (exposure cap last updated, fee strategy last updated).
   */
  public async getGsmTimelocks(
    gsmAddress: AccountAddress,
  ): Promise<GsmTimelockData> {
    const [exposure, fee] = await this.callViewMethod<[string, string]>(
      this.GhoGsmStewardContract.getGsmTimelocksFuncAddr,
      [gsmAddress.toString()],
    );
    return {
      gsm_exposure_cap_last_updated: BigInt(exposure as string),
      gsm_fee_strategy_last_updated: BigInt(fee as string),
    };
  }

  /**
   * Returns the maximum increase for GSM fee rates (buy or sell).
   * @returns A promise that resolves to a U256.
   */
  public async gsmFeeRateChangeMax(): Promise<bigint> {
    const [max] = await this.callViewMethod<[string]>(
      this.GhoGsmStewardContract.gsmFeeRateChangeMaxFuncAddr,
      [],
    );
    return BigInt(max as string);
  }

  /**
   * Returns the minimum delay for timelock.
   * @returns A promise that resolves to a U64.
   */
  public async minimumDelay(): Promise<bigint> {
    const [delay] = await this.callViewMethod<[string]>(
      this.GhoGsmStewardContract.minimumDelayFuncAddr,
      [],
    );
    return BigInt(delay as string);
  }

  // New composed method for aggregated details (optional gsmAddress for per-GSM timelocks)
  public async getGsmStewardDetails(
    gsmAddress?: AccountAddress,
  ): Promise<GsmStewardDetails> {
    const feeRateChangeMax = await this.gsmFeeRateChangeMax();
    const minimumDelay = await this.minimumDelay();

    const details: GsmStewardDetails = {
      feeRateChangeMax,
      minimumDelay,
    };

    if (gsmAddress) {
      details.timelocks = await this.getGsmTimelocks(gsmAddress);
    }

    return details;
  }
}
