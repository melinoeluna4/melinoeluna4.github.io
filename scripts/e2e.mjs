import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const baseURL = "http://127.0.0.1:4321";
const previewStopArgs = ["exec", "astro", "preview", "stop"];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function stopPreview() {
  spawnSync("pnpm", previewStopArgs, { stdio: "ignore" });
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseURL);

      if (response.ok) {
        return;
      }
    } catch {
      // The server is still starting; retry below.
    }

    await sleep(500);
  }

  throw new Error(`Preview server did not answer at ${baseURL}`);
}

stopPreview();

const build = run("pnpm", ["run", "build"]);

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

let exitCode = 0;

try {
  const preview = run("pnpm", ["exec", "astro", "preview", "--background", "--host", "127.0.0.1"]);

  if (preview.status !== 0) {
    exitCode = preview.status ?? 1;
  } else {
    await waitForPreview();
    const tests = run("pnpm", ["exec", "playwright", "test"]);
    exitCode = tests.status ?? 1;
  }
} finally {
  stopPreview();
}

process.exitCode = exitCode;
