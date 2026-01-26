import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  AccountAddress,
} from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";
import { parseArgs } from "util";
import {
  GhoBridgeClient,
  SupportedTestnetChain,
  AptosProvider,
  DEFAULT_TESTNET_CONFIG,
} from "../src";

dotenv.config();

// Testnet configuration
const CCIP_ROUTER = "0xc748085bd02022a9696dfa2058774f92a07401208bbd34cfd0c6d0ac0287ee45";
const GHO_TOKEN_ASSET = DEFAULT_TESTNET_CONFIG.assets!.GHO_TOKEN.toString();

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    options: {
      amount: { type: "string", default: "0.001" },
      receiver: { type: "string" },
    },
  });

  if (!values.receiver) {
    console.error("❌ Usage: npx ts-node examples/test-bridge.ts --amount 0.001 --receiver <ARBITRUM_WALLET>");
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY_HEX;
  if (!privateKey) {
    console.error("❌ Set PRIVATE_KEY_HEX in .env file");
    process.exit(1);
  }

  console.log("\n🌉 GHO Bridge Test - Aptos Testnet → Arbitrum Sepolia\n");
  console.log("═".repeat(60));
  console.log("\n🔍 Configuration:");
  console.log(`   CCIP Router: ${CCIP_ROUTER}`);
  console.log(`   GHO Token Asset: ${GHO_TOKEN_ASSET}`);

  // 1. Setup provider and signer
  console.log("\n📡 Setting up provider and signer...");
  const provider = AptosProvider.fromConfig(DEFAULT_TESTNET_CONFIG);
  const signer = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(privateKey),
  });

  console.log(`✅ Signer address: ${signer.accountAddress.toString()}`);

  // 2. Create bridge client
  console.log("\n🔧 Creating bridge client...");
  const bridgeClient = GhoBridgeClient.buildWithDefaults(
    provider,
    signer,
    AccountAddress.fromString(CCIP_ROUTER),
    AccountAddress.fromString(GHO_TOKEN_ASSET),
  );
  console.log("✅ Bridge client initialized");

  // 3. Check balances before
  console.log("\n💰 Checking balances...");
  const ghoBalance = await bridgeClient.getGhoBalance(signer.accountAddress);
  const aptBalance = await bridgeClient.getAptBalance(signer.accountAddress);

  console.log(`   GHO Balance: ${GhoBridgeClient.formatAmount(ghoBalance)} GHO`);
  console.log(`   APT Balance: ${(Number(aptBalance) / 1e8).toFixed(4)} APT`);

  if (ghoBalance === 0n) {
    console.error("\n❌ No GHO balance! Please mint some GHO first.");
    process.exit(1);
  }

  // 4. Parse amount
  const amount = GhoBridgeClient.parseAmount(values.amount!);
  console.log(`\n📦 Bridge amount: ${values.amount} GHO (${amount} units)`);
  console.log(`📍 Destination: Arbitrum Sepolia`);
  console.log(`📬 Receiver: ${values.receiver}`);

  // 5. Estimate bridge fee
  console.log("\n💵 Estimating CCIP bridge fee...");
  try {
    const estimatedFee = await bridgeClient.estimateBridgeFee({
      amount,
      destinationChain: SupportedTestnetChain.ARBITRUM_SEPOLIA,
      receiverAddress: values.receiver,
    });

    const feeInApt = Number(estimatedFee) / 1e8;
    console.log(`✅ Estimated fee: ${estimatedFee} octas (${feeInApt.toFixed(6)} APT)`);
    
    // Check if user has enough APT
    if (aptBalance < estimatedFee) {
      console.error(`\n❌ Insufficient APT for bridge fees!`);
      console.error(`   Required: ${estimatedFee} octas (${feeInApt.toFixed(6)} APT)`);
      console.error(`   Available: ${aptBalance} octas (${(Number(aptBalance) / 1e8).toFixed(6)} APT)`);
      console.error(`   Shortfall: ${estimatedFee - aptBalance} octas (${((Number(estimatedFee - aptBalance)) / 1e8).toFixed(6)} APT)`);
      process.exit(1);
    }
    
    console.log(`✅ APT balance sufficient for fees`);
  } catch (error) {
    console.error(`\n⚠️  Fee estimation failed (will use default): ${error.message}`);
  }

  // 6. Validate bridge parameters
  console.log("\n🔍 Validating bridge parameters...");
  try {
    const validation = await bridgeClient.validateBridge({
      amount,
      destinationChain: SupportedTestnetChain.ARBITRUM_SEPOLIA,
      receiverAddress: values.receiver,
    });

    console.log("✅ Validation passed:");
    console.log(`   Required: ${GhoBridgeClient.formatAmount(validation.requiredAmount)} GHO`);
    console.log(`   Available: ${GhoBridgeClient.formatAmount(validation.ghoBalance)} GHO`);
  } catch (error) {
    console.error(`\n❌ Validation failed: ${error.message}`);
    process.exit(1);
  }

  // 7. Simulate transaction
  console.log("\n🧪 Simulating transaction...");
  try {
    const simulation = await bridgeClient.simulateBridge({
      amount,
      destinationChain: SupportedTestnetChain.ARBITRUM_SEPOLIA,
      receiverAddress: values.receiver,
    });

    if (!simulation.success) {
      console.error(`❌ Simulation failed: ${simulation.vm_status}`);
      process.exit(1);
    }

    console.log(`✅ Simulation successful`);
    console.log(`   Gas used: ${simulation.gas_used}`);
    console.log(`   Status: ${simulation.vm_status}`);
  } catch (error) {
    console.error(`\n❌ Simulation error: ${error.message}`);
    process.exit(1);
  }

  // 8. Confirm before proceeding
  console.log("\n" + "═".repeat(60));
  console.log("⚠️  Ready to bridge! This will submit a real transaction.");
  console.log("═".repeat(60));
  console.log("\nPress Ctrl+C to cancel, or wait 3 seconds to proceed...\n");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 9. Execute bridge
  console.log("🚀 Executing bridge transaction...");
  try {
    const response = await bridgeClient.bridgeGHO({
      amount,
      destinationChain: SupportedTestnetChain.ARBITRUM_SEPOLIA,
      receiverAddress: values.receiver,
    });

    console.log("\n" + "═".repeat(60));
    console.log("✅ BRIDGE TRANSACTION SUCCESSFUL!");
    console.log("═".repeat(60));
    console.log(`\n📋 Transaction Details:`);
    console.log(`   Hash: ${response.response.hash}`);
    console.log(`   Version: ${response.response.version}`);
    console.log(`   Gas Used: ${response.response.gas_used}`);
    
    // Debug: Print all events to find CCIP message ID
    if ('events' in response.response && Array.isArray(response.response.events) && response.response.events.length > 0) {
      console.log(`\n📡 Transaction Events (${response.response.events.length} total):`);
      for (let i = 0; i < response.response.events.length; i++) {
        const event = response.response.events[i];
        console.log(`\n   Event ${i + 1}:`);
        console.log(`      Type: ${event.type}`);
        
        // Always show data for all events to help debug
        try {
          const dataStr = JSON.stringify(event.data, null, 6);
          // Truncate if too long
          if (dataStr.length > 500) {
            console.log(`      Data: ${dataStr.substring(0, 500)}... (truncated)`);
          } else {
            console.log(`      Data: ${dataStr}`);
          }
        } catch (e) {
          console.log(`      Data: [Could not stringify]`, event.data);
        }
      }
    } else {
      console.log(`\n⚠️  No events found in transaction response`);
    }
    
    // Check if we have events with CCIP message ID
    const hasCcipMessageId = response.ccipTrackerUrl.includes('/msg/');
    
    console.log(`\n🔗 Links:`);
    console.log(`   Aptos Explorer: ${response.explorerUrl}`);
    if (hasCcipMessageId) {
      console.log(`   CCIP Tracker: ${response.ccipTrackerUrl} ✅`);
    } else {
      console.log(`   CCIP Tracker: ${response.ccipTrackerUrl} (check events above for message ID)`);
    }
    
    console.log(`\n⏳ CCIP Processing:`);
    console.log(`   The cross-chain transfer will take 5-30 minutes.`);
    if (hasCcipMessageId) {
      console.log(`   Track progress at: ${response.ccipTrackerUrl}`);
    } else {
      console.log(`   View transaction events above to find CCIP message ID`);
      console.log(`   Then track at: https://ccip.chain.link/msg/<message_id>`);
    }
    console.log(`   GHO will arrive at: ${values.receiver} on Arbitrum Sepolia`);

    // 10. Check balances after
    console.log("\n💰 Checking balances after bridge...");
    const ghoBalanceAfter = await bridgeClient.getGhoBalance(signer.accountAddress);
    const aptBalanceAfter = await bridgeClient.getAptBalance(signer.accountAddress);

    console.log(`   GHO Balance: ${GhoBridgeClient.formatAmount(ghoBalanceAfter)} GHO (was ${GhoBridgeClient.formatAmount(ghoBalance)})`);
    console.log(`   APT Balance: ${(Number(aptBalanceAfter) / 1e8).toFixed(4)} APT (was ${(Number(aptBalance) / 1e8).toFixed(4)})`);
    console.log(`   GHO Bridged: ${GhoBridgeClient.formatAmount(ghoBalance - ghoBalanceAfter)} GHO`);
    console.log(`   APT Used: ${((Number(aptBalance) - Number(aptBalanceAfter)) / 1e8).toFixed(6)} APT`);

    console.log("\n✨ Bridge test completed successfully!\n");
  } catch (error) {
    console.error(`\n❌ Bridge transaction failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
