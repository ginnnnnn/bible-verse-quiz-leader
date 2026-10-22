import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const json = (path) => JSON.parse(read(path));
const canonical = json("verification/cuv-passages.json");
const audit = json("verification/scripture-audit.json");
const digest = (value) => createHash("sha256").update(value).digest("hex");
let checked = 0;
let supplements = 0;
const used = new Set();

assert.equal(canonical.sourceCode, "CUV", "不可混用其他和合本版本");
for (const [reference, source] of Object.entries(canonical.passages)) {
  assert.equal(
    digest(source.text),
    source.sha256,
    `${reference}：來源快照的雜湊不符`,
  );
  assert.equal(
    source.verses.map((v) => v.text).join(""),
    source.text,
    `${reference}：逐節內容與全文不符`,
  );
  const [, , chapter, first, last] =
    reference.match(/^(.+?) (\d+):(\d+)(?:-(\d+))?$/) ?? [];
  assert.ok(chapter && first, `${reference}：出處格式無效`);
  assert.deepEqual(
    source.verses.map((v) => v.number),
    Array.from(
      { length: Number(last ?? first) - Number(first) + 1 },
      (_, i) => Number(first) + i,
    ),
    `${reference}：章節不完整或順序錯誤`,
  );
}

for (const [collection, file] of [
  ["student", "studentScriptures"],
  ["leader", "scriptures"],
]) {
  const cards = json(`src/data/${file}.json`);
  const expected = audit.filter((entry) => entry.collection === collection);
  assert.deepEqual(
    cards.map((card) => card.id),
    expected.map((entry) => entry.id),
    `${collection}：卡片 ID 或順序改變，請更新校對紀錄`,
  );
  assert.equal(
    new Set(cards.map((card) => card.id)).size,
    cards.length,
    `${collection}：有重複的卡片 ID`,
  );
  for (const card of cards) {
    const label = `${collection}/${card.id} ${card.reference}`;
    assert.equal(
      typeof card.reference,
      "string",
      `${label}：出處應為純中文欄位`,
    );
    assert.equal(typeof card.verse, "string", `${label}：內文應為純中文欄位`);
    assert.ok(
      !/[A-Za-z]/.test(card.reference + card.verse),
      `${label}：仍有英文內容`,
    );
    assert.ok(!Object.hasOwn(card, "en"), `${label}：仍有英文欄位`);
    assert.ok(
      ["scripture", "supplement"].includes(card.kind),
      `${label}：缺少內容類型`,
    );
    const record = expected.find((entry) => entry.id === card.id);
    assert.equal(
      card.kind,
      record.kind,
      `${label}：不可將經文改標為補充文字以跳過校對`,
    );
    if (card.kind === "supplement") {
      assert.equal(card.reference, record.reference, `${label}：課程標題變動`);
      assert.equal(
        card.verse,
        record.originalText,
        `${label}：未經核對不得改寫課程補充原文`,
      );
      assert.ok(!card.source, `${label}：課程補充不能標示為和合本來源`);
      supplements++;
      continue;
    }
    const source = canonical.passages[card.reference];
    assert.ok(source, `${label}：沒有經文來源快照`);
    assert.equal(
      card.verse,
      source.text,
      `${label}：與和合本來源逐字不符（包含標點）`,
    );
    assert.equal(card.source, source.url, `${label}：來源連結錯誤`);
    used.add(card.reference);
    checked++;
  }
}
assert.equal(
  used.size,
  Object.keys(canonical.passages).length,
  "有來源經文未納入校對",
);
const featured = json("src/data/featuredScripture.json");
const psalm = canonical.passages["詩篇 119:9-11"];
assert.equal(featured.reference, "詩篇 119:11");
assert.equal(
  featured.verse,
  psalm.verses.find((verse) => verse.number === 11).text,
  "首頁經文逐字不符",
);
assert.equal(featured.source, psalm.url);

// Check rendered text nodes as well as the data: English identifiers and URLs
// are implementation details, while visible copy must be Chinese-only.
for (const file of [
  "Library",
  "CardReader",
  "ReadingDialog",
  "SiteHeader",
  "WebAppProvider",
  "ThemeToggle",
]) {
  const path = `src/components/${file}.tsx`;
  const ast = ts.createSourceFile(
    path,
    read(path),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node) {
    if (ts.isJsxText(node))
      assert.ok(
        !/[A-Za-z]/.test(node.text),
        `${path}：介面仍有英文 ${node.text.trim()}`,
      );
    if (
      ts.isJsxAttribute(node) &&
      ["aria-label", "title", "placeholder"].includes(node.name.getText(ast)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      assert.ok(
        !/[A-Za-z]/.test(node.initializer.text),
        `${path}：無障礙標籤仍有英文`,
      );
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
console.log(
  `校對通過：${checked} 張聖經卡、${used.size} 段來源、${supplements} 張課程補充、首頁經文；中文字與標點完全一致。`,
);
console.log("中文介面檢查通過。");
