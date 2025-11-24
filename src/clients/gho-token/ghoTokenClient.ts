import {
  AccountAddress,
  CommittedTransactionResponse,
  MoveFunctionId,
  MoveValue,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoProvider } from "../aptosProvider";
import { GhoTokenContract } from "../../contracts/gho-token/ghoTokenContract";

// Custom response types
export interface FacilitatorData {
  label: string;
  bucketCapacity: bigint;
  bucketLevel: bigint;
}

export interface FacilitatorBucket {
  capacity: bigint;
  level: bigint;
}

export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  metadataAddress: AccountAddress;
  isInitialized: boolean;
}

/**
 * Client for the GHO Token module.
 */
export class GhoTokenClient extends AptosContractWrapperBaseClass {
  public readonly GhoTokenContract: GhoTokenContract;

  constructor(provider: GhoProvider) {
    super(provider);
    this.GhoTokenContract = new GhoTokenContract(provider);
  }

  public static async buildWithDefaultSigner(
    provider: GhoProvider,
  ): Promise<GhoTokenClient> {
    const instance = new GhoTokenClient(provider);
    return instance;
  }

  // Entry methods

  public async addFacilitator(
    facilitatorAddress: AccountAddress,
    facilitatorLabel: string,
    bucketCapacity: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoTokenContract.addFacilitatorFuncAddr,
      [
        facilitatorAddress.toString(),
        facilitatorLabel,
        bucketCapacity.toString(),
      ],
    );
  }

  public async removeFacilitator(
    facilitatorAddress: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoTokenContract.removeFacilitatorFuncAddr,
      [facilitatorAddress.toString()],
    );
  }

  public async setFacilitatorBucketCapacity(
    facilitator: AccountAddress,
    newCapacity: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoTokenContract.setFacilitatorBucketCapacityFuncAddr,
      [facilitator.toString(), newCapacity.toString()],
    );
  }

  public async transfer(
    to: AccountAddress,
    amount: bigint,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(this.GhoTokenContract.transferFuncAddr, [
      to.toString(),
      amount.toString(),
    ]);
  }

  // View methods

  public async isInitialized(
    metadataAddress: AccountAddress,
  ): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.isInitializedFuncAddr,
      [metadataAddress.toString()],
    );
    return resp as boolean;
  }

  public async getMetadata(): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.getMetadataFuncAddr,
      [],
    );
    return AccountAddress.fromString(resp as string);
  }

  public async getBalance(address: AccountAddress): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.getBalanceFuncAddr,
      [address.toString()],
    );
    return BigInt(resp as string);
  }

  public async getFacilitatorBucket(
    facilitator: AccountAddress,
  ): Promise<FacilitatorBucket> {
    const [capacity, level] = await this.callViewMethod(
      this.GhoTokenContract.getFacilitatorBucketFuncAddr,
      [facilitator.toString()],
    );
    return {
      capacity: BigInt(capacity as string),
      level: BigInt(level as string),
    };
  }

  public async getFacilitatorsList(): Promise<AccountAddress[]> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.getFacilitatorsListFuncAddr,
      [],
    );
    return (resp as string[]).map((addr) => AccountAddress.fromString(addr));
  }

  public async getFacilitator(
    facilitator: AccountAddress,
  ): Promise<FacilitatorData> {
    const [label, bucketCapacity, bucketLevel] = await this.callViewMethod(
      this.GhoTokenContract.getFacilitatorFuncAddr,
      [facilitator.toString()],
    );
    return {
      label: label as string,
      bucketCapacity: BigInt(bucketCapacity as string),
      bucketLevel: BigInt(bucketLevel as string),
    };
  }

  public async getMetadataAddress(): Promise<AccountAddress> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.getMetadataAddressFuncAddr,
      [],
    );
    return AccountAddress.fromString(resp as string);
  }

  public async name(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.nameFuncAddr,
      [],
    );
    return resp as string;
  }

  public async symbol(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.symbolFuncAddr,
      [],
    );
    return resp as string;
  }

  public async decimals(): Promise<number> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.decimalsFuncAddr,
      [],
    );
    return Number(resp as number);
  }

  public async totalSupply(): Promise<bigint> {
    const [resp] = await this.callViewMethod(
      this.GhoTokenContract.totalSupplyFuncAddr,
      [],
    );
    return BigInt(resp as string);
  }

  // Composed method
  public async getTokenDetails(): Promise<TokenDetails> {
    const metadataPromise = this.getMetadataAddress();
    const isInitializedPromise = metadataPromise.then((addr) =>
      this.isInitialized(addr),
    );

    const [
      name,
      symbol,
      decimals,
      totalSupply,
      metadataAddress,
      isInitialized,
    ] = await Promise.all([
      this.name(),
      this.symbol(),
      this.decimals(),
      this.totalSupply(),
      metadataPromise,
      isInitializedPromise,
    ]);

    return {
      name,
      symbol,
      decimals,
      totalSupply,
      metadataAddress,
      isInitialized,
    };
  }
}
