import fs from "fs";
import path from "path";
import https from "https";
import { currencyToCountry } from "../../frontend/src/Components/Currency/CurrencyToCountry";

const FLAG_BASE_URL =
  "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3";
const OUTPUT_DIR = path.join(process.cwd(), "public", "flags");

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const downloadFlag = (countryCode: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const url = `${FLAG_BASE_URL}/${countryCode.toLowerCase()}.svg`;
    const filePath = path.join(OUTPUT_DIR, `${countryCode.toLowerCase()}.svg`);

    https
      .get(url, (response) => {
        if (response.statusCode === 404) {
          console.warn(`⚠️ Flag not found for country code: ${countryCode}`);
          resolve();
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`✓ Downloaded flag for ${countryCode}`);
          resolve();
        });
      })
      .on("error", (err) => {
        console.error(
          `✗ Error downloading flag for ${countryCode}:`,
          err.message
        );
        reject(err);
      });
  });
};

const downloadAllFlags = async () => {
  console.log("Starting flag downloads...");

  // Get unique country codes
  const countryCodes = [...new Set(Object.values(currencyToCountry))];

  // Download flags in parallel with a concurrency limit of 5
  const concurrencyLimit = 5;
  for (let i = 0; i < countryCodes.length; i += concurrencyLimit) {
    const batch = countryCodes.slice(i, i + concurrencyLimit);
    await Promise.all(batch.map(downloadFlag));
  }

  console.log("\nFlag download complete!");
};

downloadAllFlags().catch(console.error);
