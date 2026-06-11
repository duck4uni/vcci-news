import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const endpointsDir = path.join(cwd, "src", "api", "endpoints");
const modelsDir = path.join(cwd, "src", "api", "models");

function hasGeneratedApi() {
  if (!fs.existsSync(endpointsDir) || !fs.existsSync(modelsDir)) {
    return false;
  }

  const endpointFiles = fs.readdirSync(endpointsDir).filter((file) => file.endsWith(".ts"));
  const modelFiles = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".ts"));

  return endpointFiles.length > 0 && modelFiles.length > 0;
}

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["orval", "-c", "orval.config.ts"],
  {
    cwd,
    stdio: "inherit",
    shell: false,
    env: process.env,
  },
);

if (result.status === 0) {
  process.exit(0);
}

if (hasGeneratedApi()) {
  console.warn(
    "Skipping API regeneration because Swagger is unavailable and generated client files already exist.",
  );
  process.exit(0);
}

process.exit(result.status ?? 1);
