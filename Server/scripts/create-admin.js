/**
 * Create Admin Password Script
 * Run: npm run create-admin
 * 
 * This will prompt for a password, hash it with bcrypt,
 * and update the .env file automatically.
 */

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const envPath = path.join(__dirname, "..", ".env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n🔐  GAIN LIVE Admin — Set Admin Password\n");

  const password = await ask("Enter new admin password: ");

  if (password.length < 6) {
    console.error("❌  Password must be at least 6 characters.");
    process.exit(1);
  }

  const confirm = await ask("Confirm password: ");

  if (password !== confirm) {
    console.error("❌  Passwords do not match.");
    process.exit(1);
  }

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  // Update .env file
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  if (envContent.includes("ADMIN_PASSWORD_HASH=")) {
    envContent = envContent.replace(
      /ADMIN_PASSWORD_HASH=.*/,
      `ADMIN_PASSWORD_HASH=${hash}`
    );
  } else {
    envContent += `\nADMIN_PASSWORD_HASH=${hash}\n`;
  }

  fs.writeFileSync(envPath, envContent, "utf-8");

  console.log("\n✅  Password hashed and saved to .env");
  console.log(`   Hash: ${hash.substring(0, 20)}...`);
  console.log("   You can now start the server with: npm start\n");

  rl.close();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
