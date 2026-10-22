import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import { mkdir, writeFile } from "node:fs/promises";

const directory = new URL("../public/icons/", import.meta.url);
await mkdir(directory, { recursive: true });
async function render(size, maskable = false) {
  const width = Math.round(size * (maskable ? 0.5 : 0.63));
  const element = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#365d4b",
      },
    },
    h(
      "svg",
      {
        width,
        height: width,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#f7f5e9",
        strokeWidth: 1.35,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      h("path", {
        d: "M12 5.5C8.5 3.5 5 4 3 5v14c3-1.5 6-1 9 1 3-2 6-2.5 9-1V5c-2-1-5.5-1.5-9 .5Z",
      }),
      h("path", { d: "M12 5.5V20M6 8l3 1m-3 3 3 1m6-4 3-1m-3 5 3-1" }),
    ),
  );
  return Buffer.from(
    await new ImageResponse(element, {
      width: size,
      height: size,
    }).arrayBuffer(),
  );
}
for (const size of [192, 512])
  await writeFile(new URL(`icon-${size}.png`, directory), await render(size));
await writeFile(
  new URL("icon-maskable-512.png", directory),
  await render(512, true),
);
await writeFile(new URL("apple-touch-icon.png", directory), await render(180));
const favicon = await render(256);
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(favicon.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile(
  new URL("../src/app/favicon.ico", import.meta.url),
  Buffer.concat([ico, favicon]),
);
console.log("已產生 192、512、遮罩與蘋果主畫面圖示。");
