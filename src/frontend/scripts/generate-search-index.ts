import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Use dynamic import for JSON files
const currencyListPromise = import("../../fixtures/icons/coins.json", {
  assert: { type: "json" },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CurrencyItem = {
  name: string;
  symbol: string;
  slug: string;
  img_url: string;
};

type SearchIndex = {
  items: CurrencyItem[];
  nameIndex: Record<string, number[]>;
  symbolIndex: Record<string, number[]>;
  slugIndex: Record<string, number[]>;
};

const createSearchIndex = (items: CurrencyItem[]): SearchIndex => {
  const nameIndex: Record<string, number[]> = {};
  const symbolIndex: Record<string, number[]> = {};
  const slugIndex: Record<string, number[]> = {};

  const processedItems = items.map((item) => {
    // If the symbol is not already in the name, add it
    if (!item.name.includes(item.symbol)) {
      return { ...item, name: `${item.name} (${item.symbol})` };
    }
    return item;
  });

  processedItems.forEach((item, index) => {
    const nameLower = item.name.toLowerCase();
    const symbolLower = item.symbol.toLowerCase();
    const slugLower = item.slug.toLowerCase();

    if (!nameIndex[nameLower]) nameIndex[nameLower] = [];
    nameIndex[nameLower].push(index);

    if (!symbolIndex[symbolLower]) symbolIndex[symbolLower] = [];
    symbolIndex[symbolLower].push(index);

    if (!slugIndex[slugLower]) slugIndex[slugLower] = [];
    slugIndex[slugLower].push(index);
  });

  return {
    items: processedItems,
    nameIndex,
    symbolIndex,
    slugIndex,
  };
};

async function ensureDirectoryExists(filePath: string) {
  const directory = path.dirname(filePath);
  try {
    await fs.access(directory);
  } catch (error) {
    // Directory doesn't exist, so create it
    await fs.mkdir(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

async function main() {
  try {
    const { default: currencyList } = await currencyListPromise;
    const searchIndex = createSearchIndex(currencyList);

    const outputPath = path.join(
      __dirname,
      "..",
      "../fixtures/icons",
      "searchIndex.json"
    );

    // Ensure the directory exists before writing the file
    await ensureDirectoryExists(outputPath);

    await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));

    console.log(`Search index generated and saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred while generating the search index:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred:");
  console.error(error);
  process.exit(1);
});
