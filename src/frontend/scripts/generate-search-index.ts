import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AssetVariant } from "../../declarations/trade_manager/trade_manager.did";

// Use node-fetch for making HTTP requests
import fetch from "node-fetch";

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
  variant: AssetVariant;
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
    variant: { Cryptocurrency: null },
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

interface EnhancedCurrencyItem extends CurrencyItem {
  variant: AssetVariant;
}

const fetchCurrencyList = async (): Promise<EnhancedCurrencyItem[]> => {
  const response = await fetch(
    "https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/coin_map.json"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Type assertion and enhancement of the data
  if (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        "name" in item &&
        "symbol" in item &&
        "slug" in item &&
        "img_url" in item
    )
  ) {
    // Transform the data to include the variant - all items are Cryptocurrency
    return (data as CurrencyItem[]).map((item) => ({
      ...item,
      variant: { Cryptocurrency: null },
    }));
  } else {
    throw new Error(
      "Fetched data does not match expected CurrencyItem[] structure"
    );
  }
};

const main = async () => {
  try {
    const currencyList = await fetchCurrencyList();
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
};

main().catch((error) => {
  console.error("An unexpected error occurred:");
  console.error(error);
  process.exit(1);
});
