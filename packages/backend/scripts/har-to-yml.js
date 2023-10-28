const fs = require("fs").promises;
const path = require("path");
const { generateSpec } = require("har-to-openapi");

async function convertHarToOpenApi() {
  try {
    const harPath = path.join(__dirname, "../docs/Insomnia_2023-10-27.har");
    const outputPath = path.join(__dirname, "../docs/spec.yaml");

    const harContent = await fs.readFile(harPath, "utf8");
    const har = JSON.parse(harContent);

    const { spec, yamlSpec } = await generateSpec(har, {
      relaxedMethods: true,
    });

    await fs.writeFile(outputPath, yamlSpec, "utf8");

    console.log("Conversion completed successfully!");

    const orange = "\x1b[38;5;208m";
    const reset = "\x1b[0m";

    console.log(
      `${orange}Gen HAR file from Postman JSON file: https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-from-insomnia/#export-a-har-file-from-insomnia${reset}`
    );
  } catch (error) {
    console.error("Error during conversion:", error);
    console.log(
      `${orange}Gen HAR file from Postman JSON file: https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-from-insomnia/#export-a-har-file-from-insomnia${reset}`
    );
  }
}

convertHarToOpenApi();
