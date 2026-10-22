import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const loadSource = async (file) => {
  const source = readFileSync(new URL(file, root), "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputText).toString("base64")}`
  );
};
const { default: makeManifest } = await loadSource("src/app/manifest.ts");
const manifest = makeManifest();
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "/");
assert.equal(manifest.scope, "/");
assert.equal(manifest.lang, "zh-Hant");
assert.ok(
  !/[A-Za-z]/.test(manifest.name + manifest.short_name + manifest.description),
);
for (const size of [192, 512])
  assert.ok(
    manifest.icons.some(
      (icon) => icon.sizes === `${size}x${size}` && icon.purpose === "any",
    ),
  );
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
for (const icon of [
  ...manifest.icons,
  { src: "/icons/apple-touch-icon.png", sizes: "180x180" },
]) {
  assert.ok(icon.src.startsWith("/icons/"));
  const png = readFileSync(new URL(`public${icon.src}`, root));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  const [width, height] = icon.sizes.split("x").map(Number);
  assert.equal(png.readUInt32BE(16), width, icon.src);
  assert.equal(png.readUInt32BE(20), height, icon.src);
}
const { getInstallPlatform, isEmbeddedBrowser, requestInstallation } =
  await loadSource("src/lib/web-app.ts");
const iphone = {
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
  platform: "iPhone",
  maxTouchPoints: 5,
};
assert.equal(getInstallPlatform(iphone), "apple");
assert.equal(
  getInstallPlatform({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
    platform: "MacIntel",
    maxTouchPoints: 5,
  }),
  "apple",
  "桌面模式的平板也需顯示蘋果安裝步驟",
);
assert.equal(
  getInstallPlatform({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
    platform: "MacIntel",
    maxTouchPoints: 0,
  }),
  "desktop",
);
assert.equal(
  getInstallPlatform({
    userAgent: "Mozilla/5.0 (Linux; Android 15)",
    platform: "Linux",
    maxTouchPoints: 5,
  }),
  "android",
);
assert.equal(
  isEmbeddedBrowser("Mozilla/5.0 Chrome/120.0 Mobile Safari/537.36"),
  false,
);
assert.equal(
  isEmbeddedBrowser("Mozilla/5.0 (Linux; Android 15; wv) Chrome/120.0 Mobile"),
  true,
);
assert.equal(isEmbeddedBrowser("Mozilla/5.0 iPhone Line/15.0"), true);
assert.equal(
  await requestInstallation({ prompt: async () => ({ outcome: "accepted" }) }),
  "accepted",
);
assert.equal(
  await requestInstallation({
    prompt: async () => {},
    userChoice: Promise.resolve({ outcome: "dismissed" }),
  }),
  "dismissed",
);
await assert.rejects(
  requestInstallation({
    prompt: async () => {
      throw new Error("unsupported");
    },
  }),
);
await assert.rejects(requestInstallation({ prompt: async () => {} }));
console.log(
  "主畫面安裝檢查通過：資訊清單、四種圖示、蘋果平板辨識、內嵌瀏覽器辨識及新版／舊版安裝回應。",
);
