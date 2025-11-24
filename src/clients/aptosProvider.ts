import {
  Network,
  AptosConfig,
  Aptos,
  AccountAddress,
  Ed25519PrivateKey,
  Account,
  Ed25519Account,
  PrivateKeyVariants,
  PrivateKey,
} from "@aptos-labs/ts-sdk";
import YAML from "yaml";

/**
 * Configuration interface for the GhoProvider.
 *
 * @interface GhoProviderConfig
 *
 * @property {Network} network - The network configuration for the GhoProvider.
 * @property {string} aptosApiKey - The aptos api key.
 * @property {Object} addresses - The contract addresses used by the GhoProvider.
 * @property {string} addresses.GHO - The address for GHO token module.
 * @property {string} addresses.GHO_ACL - The address for GHO ACL.
 * @property {string} addresses.GHO_CONFIG - The address for GHO configuration.
 * @property {string} addresses.AAVE_MOCK_UNDERLYINGS - The address for underlying tokens.
 * @property {string} addresses.AAVE_ACL - The address for AAVE ACL.
 * @property {string} addresses.AAVE_CONFIG - The address for AAVE configuration.
 * @property {string} addresses.AAVE_ORACLE - The address for AAVE oracle.
 * @property {string} addresses.AAVE_POOL - The address for AAVE pool.
 * @property {string} addresses.AAVE_DATA - The address for AAVE data.
 * @property {string} addresses.AAVE_MATH - The address for AAVE math.
 */
export interface GhoProviderConfig {
  network: Network;
  aptosApiKey?: string;
  addresses: {
    GHO: AccountAddress;
    GHO_ACL: AccountAddress;
    GHO_CONFIG: AccountAddress;
  };
  assets?: {
    USDC: AccountAddress;
    USDT: AccountAddress;
  };
}

/**
 * Configuration interface for an Aptos account.
 *
 * @interface AptosAccountConfig
 *
 * @property {string} network - The network to which the account belongs (e.g., mainnet, testnet).
 * @property {string} private_key - The private key associated with the account.
 * @property {string} public_key - The public key associated with the account.
 * @property {string} account - The account address.
 * @property {string} rest_url - The REST API URL for interacting with the Aptos blockchain.
 * @property {string} faucet_url - The URL for the faucet service to fund the account with test tokens.
 */
export interface AptosAccountConfig {
  network: string;
  private_key: string;
  public_key: string;
  account: string;
  rest_url: string;
  faucet_url: string;
}

export enum GHO_PROFILES {
  GHO = "gho",
  GHO_ACL = "gho_acl",
  GHO_CONFIG = "gho_config",
  AAVE_MOCK_UNDERLYINGS = "aave_mock_underlyings",
  AAVE_ACL = "aave_acl",
  AAVE_CONFIG = "aave_config",
  AAVE_ORACLE = "aave_oracle",
  AAVE_POOL = "aave_pool",
  AAVE_LARGE_PACKAGES = "aave_large_packages",
  AAVE_MATH = "aave_math",
  AAVE_DATA = "aave_data",
  AAVE_DATA_FEEDS = "data_feeds",
  AAVE_PLATFORM = "platform",
  DEFAULT_FUNDER = "default",
  FACILITATOR_MANAGER = "facilitator_manager",
  BUCKET_MANAGER = "bucket_manager",
  TOKEN_RESCUER = "token_rescuer",
  LIQUIDATOR = "liquidator",
  RISK_COUNCIL = "risk_council",
  CONFIGURATOR = "configurator",
  DIRECT_POOL_MINTER = "direct_pool_minter",
  GHO_GUARDIAN = "gho_guardian",
  SWAP_FREEZER = "swap_freezer",
  BURN_MINT_TOKEN_POOL_OWNER = "burn_mint_token_pool_owner",
  TEST_ACCOUNT_0 = "test_account_0",
  TEST_ACCOUNT_1 = "test_account_1",
  TEST_ACCOUNT_2 = "test_account_2",
  TEST_ACCOUNT_3 = "test_account_3",
  TEST_ACCOUNT_4 = "test_account_4",
  TEST_ACCOUNT_5 = "test_account_5",
}

/**
 * The `GhoProvider` class is responsible for managing the configuration and profiles
 * for interacting with the GHO protocol on the Aptos blockchain. It allows setting up
 * network configurations, adding profile addresses and accounts, and initializing the Aptos instance.
 *
 * @class
 */
export class GhoProvider {
  private network: Network;
  private profileAddressMap = new Map<string, AccountAddress>();
  private profileAccountMap = new Map<string, Ed25519PrivateKey>();

  private aptos: Aptos;

  private constructor() {}

  /**
   * Sets the network for the GHO provider.
   *
   * @param network - The network to set, represented by the `Network` type.
   */
  public setNetwork(network: Network) {
    this.network = network;
  }

  /**
   * Adds a profile address to the profile address map.
   *
   * @param profileName - The name of the profile to associate with the address.
   * @param address - The account address to be added.
   */
  public addProfileAddress(profileName: string, address: AccountAddress) {
    this.profileAddressMap.set(profileName, address);
  }

  /**
   * Adds a profile account to the profile account map.
   *
   * @param profileName - The name of the profile to associate with the account.
   * @param account - The Ed25519 private key of the account to add.
   */
  public addProfileAccount(profileName: string, account: Ed25519PrivateKey) {
    this.profileAccountMap.set(profileName, account);
  }

  /**
   * Sets the Aptos configuration for the client.
   *
   * @param aptosConfig - The configuration object for Aptos.
   */
  public setAptos(aptosConfig: AptosConfig) {
    this.aptos = new Aptos(aptosConfig);
  }

  /**
   * Creates an instance of `GhoProvider` from the given configuration.
   *
   * @param config - The configuration object for the `GhoProvider`.
   * @returns A new instance of `GhoProvider` configured with the provided settings.
   *
   * @example
   * ```typescript
   * const config: GhoProviderConfig = {
   *   network: Network.TESTNET,
   *   addresses: {
   *     GHO: '0x...',
   *     GHO_ACL: '0x...',
   *     GHO_CONFIG: '0x...',
   *     AAVE_MOCK_UNDERLYINGS: '0x...',
   *     AAVE_ACL: '0x...',
   *     AAVE_CONFIG: '0x...',
   *     AAVE_ORACLE: '0x...',
   *     AAVE_POOL: '0x...',
   *     AAVE_DATA: '0x...',
   *     AAVE_MATH: '0x...'
   *   }
   * };
   * const ghoProvider = GhoProvider.fromConfig(config);
   * ```
   */
  public static fromConfig(config: GhoProviderConfig): GhoProvider {
    let ghoProvider = new GhoProvider();
    ghoProvider.setNetwork(config.network);

    ghoProvider.addProfileAddress(GHO_PROFILES.GHO, config.addresses.GHO);
    ghoProvider.addProfileAddress(
      GHO_PROFILES.GHO_ACL,
      config.addresses.GHO_ACL,
    );
    ghoProvider.addProfileAddress(
      GHO_PROFILES.GHO_CONFIG,
      config.addresses.GHO_CONFIG,
    );
    const aptosConfig = new AptosConfig({
      network: ghoProvider.getNetwork(),
      clientConfig: {
        ...(process.env.APTOS_API_KEY && {
          API_KEY: process.env.APTOS_API_KEY,
        }),
        ...(config.aptosApiKey && {
          API_KEY: config.aptosApiKey,
        }),
      },
    });
    ghoProvider.setAptos(aptosConfig);
    return ghoProvider;
  }

  /**
   * Creates an instance of `GhoProvider` by reading configuration from environment variables.
   *
   * @throws {Error} If any required environment variable is missing or if an unknown network is specified.
   *
   * @returns {GhoProvider} The configured `GhoProvider` instance.
   *
   * Environment Variables:
   * - `APTOS_NETWORK`: The network to connect to (testnet, devnet, mainnet, local).
   * - `GHO_PRIVATE_KEY`: Private key for GHO profile.
   * - `GHO_ACL_PRIVATE_KEY`: Private key for GHO_ACL profile.
   * - `GHO_CONFIG_PRIVATE_KEY`: Private key for GHO_CONFIG profile.
   * - `AAVE_MOCK_UNDERLYING_TOKENS_PRIVATE_KEY`: Private key for UNDERLYING_TOKENS profile.
   * - `AAVE_ACL_PRIVATE_KEY`: Private key for AAVE_ACL profile.
   * - `AAVE_CONFIG_PRIVATE_KEY`: Private key for AAVE_CONFIG profile.
   * - `AAVE_ORACLE_PRIVATE_KEY`: Private key for AAVE_ORACLE profile.
   * - `AAVE_POOL_PRIVATE_KEY`: Private key for AAVE_POOL profile.
   * - `AAVE_LARGE_PACKAGES_PRIVATE_KEY`: Private key for AAVE_LARGE_PACKAGES profile.
   * - `AAVE_MATH_PRIVATE_KEY`: Private key for AAVE_MATH profile.
   * - `AAVE_DATA_PRIVATE_KEY`: Private key for AAVE_DATA profile.
   * - `DEFAULT_FUNDER_PRIVATE_KEY`: Private key for DEFAULT_FUNDER profile.
   * - `FACILITATOR_MANAGER_PRIVATE_KEY`: Private key for FACILITATOR_MANAGER profile.
   * - `BUCKET_MANAGER_PRIVATE_KEY`: Private key for BUCKET_MANAGER profile.
   * - `TOKEN_RESCUER_PRIVATE_KEY`: Private key for TOKEN_RESCUER profile.
   * - `LIQUIDATOR_PRIVATE_KEY`: Private key for LIQUIDATOR profile.
   * - `RISK_COUNCIL_PRIVATE_KEY`: Private key for RISK_COUNCIL profile.
   * - `CONFIGURATOR_PRIVATE_KEY`: Private key for CONFIGURATOR profile.
   * - `DIRECT_POOL_MINTER_PRIVATE_KEY`: Private key for DIRECT_POOL_MINTER profile.
   * - `GHO_GUARDIAN_PRIVATE_KEY`: Private key for GHO_GUARDIAN profile.
   * - `SWAP_FREEZER_PRIVATE_KEY`: Private key for SWAP_FREEZER profile.
   * - `BURN_MINT_TOKEN_POOL_OWNER_PRIVATE_KEY`: Private key for BURN_MINT_TOKEN_POOL_OWNER profile.
   * - `TEST_ACCOUNT_0_PRIVATE_KEY`: Private key for TEST_ACCOUNT_0 profile.
   * - `TEST_ACCOUNT_1_PRIVATE_KEY`: Private key for TEST_ACCOUNT_1 profile.
   * - `TEST_ACCOUNT_2_PRIVATE_KEY`: Private key for TEST_ACCOUNT_2 profile.
   * - `TEST_ACCOUNT_3_PRIVATE_KEY`: Private key for TEST_ACCOUNT_3 profile.
   * - `TEST_ACCOUNT_4_PRIVATE_KEY`: Private key for TEST_ACCOUNT_4 profile.
   * - `TEST_ACCOUNT_5_PRIVATE_KEY`: Private key for TEST_ACCOUNT_5 profile.
   */
  public static fromEnvs(): GhoProvider {
    const ghoProvider = new GhoProvider();
    // read vars from .env file
    if (!process.env.APTOS_NETWORK) {
      throw new Error("Missing APTOS_NETWORK in .env file");
    }
    switch (process.env.APTOS_NETWORK.toLowerCase()) {
      case "testnet": {
        ghoProvider.setNetwork(Network.TESTNET);
        break;
      }
      case "devnet": {
        ghoProvider.setNetwork(Network.DEVNET);
        break;
      }
      case "mainnet": {
        ghoProvider.setNetwork(Network.MAINNET);
        break;
      }
      case "local": {
        ghoProvider.setNetwork(Network.LOCAL);
        break;
      }
      default:
        throw new Error(
          `Unknown network ${process.env.APTOS_NETWORK ? process.env.APTOS_NETWORK : "undefined"}`,
        );
    }

    // GHO-specific profiles
    if (!process.env.GHO_PRIVATE_KEY) {
      throw new Error("Env variable GHO_PRIVATE_KEY does not exist");
    }
    addProfilePkey(ghoProvider, GHO_PROFILES.GHO, process.env.GHO_PRIVATE_KEY);

    if (!process.env.GHO_ACL_PRIVATE_KEY) {
      throw new Error("Env variable GHO_ACL_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.GHO_ACL,
      process.env.GHO_ACL_PRIVATE_KEY,
    );

    if (!process.env.GHO_CONFIG_PRIVATE_KEY) {
      throw new Error("Env variable GHO_CONFIG_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.GHO_CONFIG,
      process.env.GHO_CONFIG_PRIVATE_KEY,
    );

    // AAVE-related profiles (inherited from base AAVE)
    if (!process.env.AAVE_MOCK_UNDERLYING_TOKENS_PRIVATE_KEY) {
      throw new Error(
        "Env variable AAVE_MOCK_UNDERLYING_TOKENS_PRIVATE_KEY does not exist",
      );
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_MOCK_UNDERLYINGS,
      process.env.AAVE_MOCK_UNDERLYING_TOKENS_PRIVATE_KEY,
    );

    if (!process.env.AAVE_ACL_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_ACL_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_ACL,
      process.env.AAVE_ACL_PRIVATE_KEY,
    );

    if (!process.env.AAVE_CONFIG_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_CONFIG_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_CONFIG,
      process.env.AAVE_CONFIG_PRIVATE_KEY,
    );

    if (!process.env.AAVE_ORACLE_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_ORACLE_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_ORACLE,
      process.env.AAVE_ORACLE_PRIVATE_KEY,
    );

    if (!process.env.AAVE_POOL_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_POOL_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_POOL,
      process.env.AAVE_POOL_PRIVATE_KEY,
    );

    if (!process.env.AAVE_LARGE_PACKAGES_PRIVATE_KEY) {
      throw new Error(
        "Env variable AAVE_LARGE_PACKAGES_PRIVATE_KEY does not exist",
      );
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_LARGE_PACKAGES,
      process.env.AAVE_LARGE_PACKAGES_PRIVATE_KEY,
    );

    if (!process.env.AAVE_MATH_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_MATH_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_MATH,
      process.env.AAVE_MATH_PRIVATE_KEY,
    );

    if (!process.env.AAVE_DATA_PRIVATE_KEY) {
      throw new Error("Env variable AAVE_DATA_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.AAVE_DATA,
      process.env.AAVE_DATA_PRIVATE_KEY,
    );

    if (!process.env.DEFAULT_FUNDER_PRIVATE_KEY) {
      throw new Error("Env variable DEFAULT_FUNDER_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.DEFAULT_FUNDER,
      process.env.DEFAULT_FUNDER_PRIVATE_KEY,
    );

    // GHO role-specific profiles
    if (!process.env.FACILITATOR_MANAGER_PRIVATE_KEY) {
      throw new Error(
        "Env variable FACILITATOR_MANAGER_PRIVATE_KEY does not exist",
      );
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.FACILITATOR_MANAGER,
      process.env.FACILITATOR_MANAGER_PRIVATE_KEY,
    );

    if (!process.env.BUCKET_MANAGER_PRIVATE_KEY) {
      throw new Error("Env variable BUCKET_MANAGER_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.BUCKET_MANAGER,
      process.env.BUCKET_MANAGER_PRIVATE_KEY,
    );

    if (!process.env.TOKEN_RESCUER_PRIVATE_KEY) {
      throw new Error("Env variable TOKEN_RESCUER_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TOKEN_RESCUER,
      process.env.TOKEN_RESCUER_PRIVATE_KEY,
    );

    if (!process.env.LIQUIDATOR_PRIVATE_KEY) {
      throw new Error("Env variable LIQUIDATOR_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.LIQUIDATOR,
      process.env.LIQUIDATOR_PRIVATE_KEY,
    );

    if (!process.env.RISK_COUNCIL_PRIVATE_KEY) {
      throw new Error("Env variable RISK_COUNCIL_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.RISK_COUNCIL,
      process.env.RISK_COUNCIL_PRIVATE_KEY,
    );

    if (!process.env.CONFIGURATOR_PRIVATE_KEY) {
      throw new Error("Env variable CONFIGURATOR_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.CONFIGURATOR,
      process.env.CONFIGURATOR_PRIVATE_KEY,
    );

    if (!process.env.DIRECT_POOL_MINTER_PRIVATE_KEY) {
      throw new Error(
        "Env variable DIRECT_POOL_MINTER_PRIVATE_KEY does not exist",
      );
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.DIRECT_POOL_MINTER,
      process.env.DIRECT_POOL_MINTER_PRIVATE_KEY,
    );

    if (!process.env.GHO_GUARDIAN_PRIVATE_KEY) {
      throw new Error("Env variable GHO_GUARDIAN_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.GHO_GUARDIAN,
      process.env.GHO_GUARDIAN_PRIVATE_KEY,
    );

    if (!process.env.SWAP_FREEZER_PRIVATE_KEY) {
      throw new Error("Env variable SWAP_FREEZER_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.SWAP_FREEZER,
      process.env.SWAP_FREEZER_PRIVATE_KEY,
    );

    if (!process.env.BURN_MINT_TOKEN_POOL_OWNER_PRIVATE_KEY) {
      throw new Error(
        "Env variable BURN_MINT_TOKEN_POOL_OWNER_PRIVATE_KEY does not exist",
      );
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.BURN_MINT_TOKEN_POOL_OWNER,
      process.env.BURN_MINT_TOKEN_POOL_OWNER_PRIVATE_KEY,
    );

    // Test accounts
    if (!process.env.TEST_ACCOUNT_0_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_0_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_0,
      process.env.TEST_ACCOUNT_0_PRIVATE_KEY,
    );

    if (!process.env.TEST_ACCOUNT_1_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_1_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_1,
      process.env.TEST_ACCOUNT_1_PRIVATE_KEY,
    );

    if (!process.env.TEST_ACCOUNT_2_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_2_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_2,
      process.env.TEST_ACCOUNT_2_PRIVATE_KEY,
    );

    if (!process.env.TEST_ACCOUNT_3_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_3_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_3,
      process.env.TEST_ACCOUNT_3_PRIVATE_KEY,
    );

    if (!process.env.TEST_ACCOUNT_4_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_4_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_4,
      process.env.TEST_ACCOUNT_4_PRIVATE_KEY,
    );

    if (!process.env.TEST_ACCOUNT_5_PRIVATE_KEY) {
      throw new Error("Env variable TEST_ACCOUNT_5_PRIVATE_KEY does not exist");
    }
    addProfilePkey(
      ghoProvider,
      GHO_PROFILES.TEST_ACCOUNT_5,
      process.env.TEST_ACCOUNT_5_PRIVATE_KEY,
    );

    const aptosConfig = new AptosConfig({
      network: ghoProvider.getNetwork(),
      clientConfig: {
        ...(process.env.APTOS_API_KEY && {
          API_KEY: process.env.APTOS_API_KEY,
        }),
      },
    });
    ghoProvider.setAptos(aptosConfig);
    return ghoProvider;
  }

  /**
   * Creates an instance of `GhoProvider` from a YAML string.
   *
   * This method parses the provided YAML string to extract profile configurations,
   * sets the network for the `GhoProvider` based on the profile's network configuration,
   * and adds profile accounts and addresses to the provider.
   *
   * @param aptosYaml - The YAML string containing the Aptos profile configurations.
   * @returns An instance of `GhoProvider` configured based on the provided YAML.
   * @throws Will throw an error if an unknown network is specified in the profile configuration.
   */
  public static fromAptosYaml(aptosYaml: string): GhoProvider {
    let ghoProvider = new GhoProvider();
    const parsedYaml = YAML.parse(aptosYaml);
    for (const profile of Object.keys(parsedYaml.profiles)) {
      const profileConfig = parsedYaml.profiles[profile] as AptosAccountConfig;

      // extract network
      switch (profileConfig.network.toLowerCase()) {
        case "testnet": {
          ghoProvider.setNetwork(Network.TESTNET);
          break;
        }
        case "devnet": {
          ghoProvider.setNetwork(Network.DEVNET);
          break;
        }
        case "mainnet": {
          ghoProvider.setNetwork(Network.MAINNET);
          break;
        }
        case "local": {
          ghoProvider.setNetwork(Network.LOCAL);
          break;
        }
        default:
          throw new Error(
            `Unknown network ${profileConfig.network ? profileConfig.network : "undefined"}`,
          );
      }

      const aptosPrivateKey = new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(
          profileConfig.private_key,
          PrivateKeyVariants.Ed25519,
        ),
      );
      ghoProvider.addProfileAccount(profile, aptosPrivateKey);
      const profileAccount = Account.fromPrivateKey({
        privateKey: aptosPrivateKey,
      });
      ghoProvider.addProfileAddress(profile, profileAccount.accountAddress);
    }
    const aptosConfig = new AptosConfig({
      network: ghoProvider.getNetwork(),
    });
    ghoProvider.setAptos(aptosConfig);
    return ghoProvider;
  }

  /**
   * Retrieves the Aptos instance.
   *
   * @returns {Aptos} The Aptos instance.
   */
  public getAptos(): Aptos {
    return this.aptos;
  }

  /**
   * Retrieves the private key associated with a given profile name.
   *
   * @param profileName - The name of the profile whose private key is to be retrieved.
   * @returns The Ed25519 private key associated with the specified profile name.
   * @throws Will throw an error if the profile name is not found in the profiles map.
   */
  public getProfileAccountPrivateKeyByName(
    profileName: string,
  ): Ed25519PrivateKey {
    if (!this.profileAccountMap.has(profileName)) {
      throw new Error(
        `Account "${profileName}" was not found in the profiles map`,
      );
    }
    return this.profileAccountMap.get(profileName);
  }

  /**
   * Retrieves the profile account associated with the given profile name.
   *
   * @param profileName - The name of the profile whose account is to be retrieved.
   * @returns An instance of `Ed25519Account` if the profile account exists, otherwise `undefined`.
   */
  public getProfileAccountByName(profileName: string): Ed25519Account {
    const profileAccount = this.getProfileAccountPrivateKeyByName(profileName);
    if (profileAccount) {
      return Account.fromPrivateKey({
        privateKey: this.getProfileAccountPrivateKeyByName(profileName),
      });
    }
    return undefined;
  }

  /**
   * Retrieves the account address associated with the given profile name.
   *
   * @param profileName - The name of the profile whose account address is to be retrieved.
   * @returns The account address associated with the given profile name.
   * @throws Will throw an error if the profile name does not exist in the profile address map.
   */
  public getProfileAddressByName(profileName: string): AccountAddress {
    if (!this.profileAddressMap.has(profileName)) {
      throw new Error(
        `Address of account "${profileName}" was not found in the profile addresses map`,
      );
    }
    return this.profileAddressMap.get(profileName);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // GHO-specific Profile Getters
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Retrieves the GHO token profile account.
   *
   * @returns {Ed25519Account} The GHO profile account.
   */
  public getGhoProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.GHO);
  }

  /**
   * Retrieves the GHO ACL profile account.
   *
   * @returns {Ed25519Account} The GHO ACL profile account.
   */
  public getGhoAclProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.GHO_ACL);
  }

  /**
   * Retrieves the GHO Config profile account.
   *
   * @returns {Ed25519Account} The GHO Config profile account.
   */
  public getGhoConfigProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.GHO_CONFIG);
  }

  /**
   * Retrieves the Facilitator Manager profile account.
   *
   * @returns {Ed25519Account} The Facilitator Manager profile account.
   */
  public getFacilitatorManagerProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.FACILITATOR_MANAGER);
  }

  /**
   * Retrieves the Bucket Manager profile account.
   *
   * @returns {Ed25519Account} The Bucket Manager profile account.
   */
  public getBucketManagerProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.BUCKET_MANAGER);
  }

  /**
   * Retrieves the Token Rescuer profile account.
   *
   * @returns {Ed25519Account} The Token Rescuer profile account.
   */
  public getTokenRescuerProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.TOKEN_RESCUER);
  }

  /**
   * Retrieves the Liquidator profile account.
   *
   * @returns {Ed25519Account} The Liquidator profile account.
   */
  public getLiquidatorProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.LIQUIDATOR);
  }

  /**
   * Retrieves the Risk Council profile account.
   *
   * @returns {Ed25519Account} The Risk Council profile account.
   */
  public getRiskCouncilProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.RISK_COUNCIL);
  }

  /**
   * Retrieves the Configurator profile account.
   *
   * @returns {Ed25519Account} The Configurator profile account.
   */
  public getConfiguratorProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.CONFIGURATOR);
  }

  /**
   * Retrieves the Direct Pool Minter profile account.
   *
   * @returns {Ed25519Account} The Direct Pool Minter profile account.
   */
  public getDirectPoolMinterProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.DIRECT_POOL_MINTER);
  }

  /**
   * Retrieves the GHO Guardian profile account.
   *
   * @returns {Ed25519Account} The GHO Guardian profile account.
   */
  public getGhoGuardianProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.GHO_GUARDIAN);
  }

  /**
   * Retrieves the Swap Freezer profile account.
   *
   * @returns {Ed25519Account} The Swap Freezer profile account.
   */
  public getSwapFreezerProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.SWAP_FREEZER);
  }

  /**
   * Retrieves the Burn Mint Token Pool Owner profile account.
   *
   * @returns {Ed25519Account} The Burn Mint Token Pool Owner profile account.
   */
  public getBurnMintTokenPoolOwnerProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(
      GHO_PROFILES.BURN_MINT_TOKEN_POOL_OWNER,
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // AAVE-inherited Profile Getters
  // ──────────────────────────────────────────────────────────────────────────────

  /**
   * Retrieves the Oracle profile account.
   *
   * @returns {Ed25519Account} The Oracle profile account.
   */
  public getOracleProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.AAVE_ORACLE);
  }

  /**
   * Retrieves the Pool profile account.
   *
   * @returns {Ed25519Account} The Pool profile account.
   */
  public getPoolProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.AAVE_POOL);
  }

  /**
   * Retrieves the Underlying Tokens profile account.
   *
   * @returns {Ed25519Account} The Underlying Tokens profile account.
   */
  public getUnderlyingTokensProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.AAVE_MOCK_UNDERLYINGS);
  }

  /**
   * Retrieves the AAVE ACL profile account.
   *
   * @returns {Ed25519Account} The AAVE ACL profile account.
   */
  public getAaveAclProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.AAVE_ACL);
  }

  /**
   * Retrieves the Data profile account.
   *
   * @returns {Ed25519Account} The Data profile account.
   */
  public getDataProfileAccount(): Ed25519Account {
    return this.getProfileAccountByName(GHO_PROFILES.AAVE_DATA);
  }

  /**
   * Retrieves the current network configuration.
   *
   * @returns {Network} The network configuration.
   */
  public getNetwork(): Network {
    return this.network;
  }
}

/**
 * Adds a profile private key to the GHO provider and associates it with a profile account.
 *
 * @param ghoProvider - The instance of the GhoProvider to which the profile and private key will be added.
 * @param profile - The name of the profile to be associated with the private key.
 * @param privateKey - The private key to be added and associated with the profile.
 */
const addProfilePkey = (
  ghoProvider: GhoProvider,
  profile: string,
  privateKey: string,
) => {
  const aptosPrivateKey = new Ed25519PrivateKey(
    PrivateKey.formatPrivateKey(privateKey, PrivateKeyVariants.Ed25519),
  );
  ghoProvider.addProfileAccount(profile, aptosPrivateKey);
  const profileAccount = Account.fromPrivateKey({
    privateKey: aptosPrivateKey,
  });
  ghoProvider.addProfileAddress(profile, profileAccount.accountAddress);
};
