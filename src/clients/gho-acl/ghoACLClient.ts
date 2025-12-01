import {
  AccountAddress,
  CommittedTransactionResponse,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { AptosContractWrapperBaseClass } from "../baseClass";
import { GhoAclManagerContract } from "../../contracts/gho-acl/ghoACLContract";
import { GhoProvider } from "../aptosProvider";

// Custom types for views
export type RoleDetails = {
  adminRole: string;
};

// Update UserRoles without isRiskCouncil
export type UserRoles = {
  isDefaultAdmin: boolean;
  isFacilitatorManager: boolean;
  isBucketManager: boolean;
  isConfigurator: boolean;
  isTokenRescuer: boolean;
  isSwapFreezer: boolean;
  isLiquidator: boolean;
  isDirectPoolMinter: boolean;
  isGhoGuardian: boolean;
  isRiskAdmin: boolean;
};

/**
 * Represents the GhoAclClient class which provides methods to interact with the GHO ACL (Access Control List) manager contract
 * within the GHO protocol on the Aptos blockchain.
 *
 * @remarks
 * This client extends AptosContractWrapperBaseClass and provides a comprehensive set of methods for managing roles and permissions
 * specific to the GHO protocol, including facilitator management, bucket management, configurator roles, token rescue operations,
 * swap freezing, liquidation, direct pool minting, risk management, and guardian controls.
 *
 * The client can be instantiated in two ways:
 * 1. Using the constructor directly with a provider and optional signer
 * 2. Using the static buildWithDefaultSigner method which automatically configures the client with the provider's GHO ACL profile account
 *
 * @example
 * ```typescript
 * // Using buildWithDefaultSigner
 * const provider = new GhoProvider();
 * const ghoAclClient = GhoAclClient.buildWithDefaultSigner(provider);
 *
 * // Using constructor directly
 * const provider = new GhoProvider();
 * const signer = provider.getGhoAclProfileAccount();
 * const ghoAclClient = new GhoAclClient(provider, signer);
 *
 * // Check if an address has a specific role
 * const hasRole = await ghoAclClient.hasRole("FACILITATOR_MANAGER_ROLE", userAddress);
 *
 * // Add a facilitator manager
 * await ghoAclClient.addFacilitatorManager(userAddress);
 * ```
 *
 * @param provider - The GhoProvider instance used to interact with the Aptos blockchain.
 * @param signer - Optional Ed25519Account signer for transaction signing.
 */
export class GhoAclClient extends AptosContractWrapperBaseClass {
  GhoAclManagerContract: GhoAclManagerContract;

  /**
   * Constructs an instance of GhoAclClient.
   * @param provider - The GhoProvider instance.
   * @param signer - Optional Ed25519Account signer.
   */
  constructor(provider: GhoProvider, signer?: Ed25519Account) {
    super(provider, signer);
    this.GhoAclManagerContract = new GhoAclManagerContract(provider);
  }

  /**
   * Creates an instance of GhoAclClient using the default signer from the provided GhoProvider.
   *
   * @param provider - The GhoProvider instance to use for creating the GhoAclClient.
   * @returns A new instance of GhoAclClient.
   */
  public static buildWithDefaultSigner(provider: GhoProvider): GhoAclClient {
    const client = new GhoAclClient(
      provider,
      provider.getGhoAclProfileAccount(),
    );
    return client;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Core Role Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Checks if a user has a specific role.
   * @param role - The role to check (as a String type).
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user has the role.
   */
  public async hasRole(role: string, user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.hasRoleFuncAddr,
      [role, user],
    );
    return resp as boolean;
  }

  /**
   * Grants a role to a user.
   * @param role - The role to grant (as a String type).
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async grantRole(
    role: string,
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.grantRoleFuncAddr,
      [role, user.toString()],
    );
  }

  /**
   * Renounces a role for the calling account.
   * @param role - The role to renounce (as a String type).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async renounceRole(
    role: string,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.renounceRoleFuncAddr,
      [role],
    );
  }

  /**
   * Revokes a role from a user.
   * @param role - The role to revoke (as a String type).
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async revokeRole(
    role: string,
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.revokeRoleFuncAddr,
      [role, user.toString()],
    );
  }

  /**
   * Gets the default admin role string.
   * @returns A promise that resolves to the default admin role as a string.
   */
  public async getDefaultAdminRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.defaultAdminRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Gets the admin role for a specific role.
   * @param role - The role to get the admin role for (as a String type).
   * @returns A promise that resolves to the admin role as a string.
   */
  public async getRoleAdmin(role: string): Promise<RoleDetails> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getRoleAdminFuncAddr,
      [role],
    );
    return { adminRole: resp as string };
  }

  /**
   * Sets the admin role for a specific role.
   * @param role - The role to set the admin role for (as a String type).
   * @param adminRole - The admin role to set (as a String type).
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async setRoleAdmin(
    role: string,
    adminRole: string,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.setRoleAdminFuncAddr,
      [role, adminRole],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Default Admin Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Checks if a user is a default admin.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a default admin.
   */
  public async isDefaultAdmin(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isDefaultAdminFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a default admin.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addDefaultAdmin(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addDefaultAdminFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Renounces the default admin role for the calling account.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async renounceDefaultAdmin(): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.renounceDefaultAdminFuncAddr,
      [],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Facilitator Manager Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the facilitator manager role string.
   * @returns A promise that resolves to the facilitator manager role as a string.
   */
  public async getFacilitatorManagerRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getFacilitatorManagerRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a facilitator manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a facilitator manager.
   */
  public async isFacilitatorManager(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isFacilitatorManagerFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a facilitator manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addFacilitatorManager(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addFacilitatorManagerFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a facilitator manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeFacilitatorManager(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeFacilitatorManagerFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Bucket Manager Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the bucket manager role string.
   * @returns A promise that resolves to the bucket manager role as a string.
   */
  public async getBucketManagerRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getBucketManagerRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a bucket manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a bucket manager.
   */
  public async isBucketManager(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isBucketManagerFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a bucket manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addBucketManager(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addBucketManagerFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a bucket manager.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeBucketManager(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeBucketManagerFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Configurator Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the configurator role string.
   * @returns A promise that resolves to the configurator role as a string.
   */
  public async getConfiguratorRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getConfiguratorRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a configurator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a configurator.
   */
  public async isConfigurator(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isConfiguratorFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a configurator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addConfigurator(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addConfiguratorFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a configurator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeConfigurator(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeConfiguratorFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Token Rescuer Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the token rescuer role string.
   * @returns A promise that resolves to the token rescuer role as a string.
   */
  public async getTokenRescuerRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getTokenRescuerRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a token rescuer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a token rescuer.
   */
  public async isTokenRescuer(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isTokenRescuerFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a token rescuer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addTokenRescuer(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addTokenRescuerFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a token rescuer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeTokenRescuer(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeTokenRescuerFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Swap Freezer Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the swap freezer role string.
   * @returns A promise that resolves to the swap freezer role as a string.
   */
  public async getSwapFreezerRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getSwapFreezerRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a swap freezer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a swap freezer.
   */
  public async isSwapFreezer(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isSwapFreezerFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a swap freezer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addSwapFreezer(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addSwapFreezerFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a swap freezer.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeSwapFreezer(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeSwapFreezerFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Liquidator Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the liquidator role string.
   * @returns A promise that resolves to the liquidator role as a string.
   */
  public async getLiquidatorRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getLiquidatorRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a liquidator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a liquidator.
   */
  public async isLiquidator(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isLiquidatorFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a liquidator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addLiquidator(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addLiquidatorFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a liquidator.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeLiquidator(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeLiquidatorFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Direct Pool Minter Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the direct pool minter role string.
   * @returns A promise that resolves to the direct pool minter role as a string.
   */
  public async getDirectPoolMinterRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getDirectPoolMinterRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a direct pool minter.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a direct pool minter.
   */
  public async isDirectPoolMinter(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isDirectPoolMinterFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a direct pool minter.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addDirectPoolMinter(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addDirectPoolMinterFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a direct pool minter.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeDirectPoolMinter(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeDirectPoolMinterFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Risk Council Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the risk council role string.
   * @returns A promise that resolves to the risk council role as a string.
   */
  public async getRiskCouncilRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getRiskCouncilRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Adds a risk council member.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addRiskCouncil(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addRiskCouncilFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a risk council member.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeRiskCouncil(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeRiskCouncilFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // GHO Guardian Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the GHO guardian role string.
   * @returns A promise that resolves to the GHO guardian role as a string.
   */
  public async getGhoGuardianRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getGhoGuardianRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a GHO guardian.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a GHO guardian.
   */
  public async isGhoGuardian(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isGhoGuardianFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a GHO guardian.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addGhoGuardian(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addGhoGuardianFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a GHO guardian.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeGhoGuardian(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeGhoGuardianFuncAddr,
      [user.toString()],
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Risk Admin Management
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the risk admin role string.
   * @returns A promise that resolves to the risk admin role as a string.
   */
  public async getRiskAdminRole(): Promise<string> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.getRiskAdminRoleFuncAddr,
      [],
    );
    return resp as string;
  }

  /**
   * Checks if a user is a risk admin.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a boolean indicating if the user is a risk admin.
   */
  public async isRiskAdmin(user: AccountAddress): Promise<boolean> {
    const [resp] = await this.callViewMethod(
      this.GhoAclManagerContract.isRiskAdminFuncAddr,
      [user.toString()],
    );
    return resp as boolean;
  }

  /**
   * Adds a risk admin.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async addRiskAdmin(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.addRiskAdminFuncAddr,
      [user.toString()],
    );
  }

  /**
   * Removes a risk admin.
   * @param user - The account address of the user.
   * @returns A promise that resolves to a CommittedTransactionResponse.
   */
  public async removeRiskAdmin(
    user: AccountAddress,
  ): Promise<CommittedTransactionResponse> {
    return this.sendTxAndAwaitResponse(
      this.GhoAclManagerContract.removeRiskAdminFuncAddr,
      [user.toString()],
    );
  }

  // New composed method to get all roles for a user
  public async getUserRoles(user: AccountAddress): Promise<UserRoles> {
    return {
      isDefaultAdmin: await this.isDefaultAdmin(user),
      isFacilitatorManager: await this.isFacilitatorManager(user),
      isBucketManager: await this.isBucketManager(user),
      isConfigurator: await this.isConfigurator(user),
      isTokenRescuer: await this.isTokenRescuer(user),
      isSwapFreezer: await this.isSwapFreezer(user),
      isLiquidator: await this.isLiquidator(user),
      isDirectPoolMinter: await this.isDirectPoolMinter(user),
      isGhoGuardian: await this.isGhoGuardian(user),
      isRiskAdmin: await this.isRiskAdmin(user),
    };
  }
}
