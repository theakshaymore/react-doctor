import path from "node:path";
import { Command } from "commander";
import { handleError } from "./utils/handle-error.js";
import { highlighter } from "./utils/highlighter.js";
import { logger } from "./utils/logger.js";
import { scan } from "./scan.js";

const VERSION = process.env.VERSION ?? "0.0.0";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command()
  .name("react-doctor")
  .description("Diagnose React codebase health")
  .version(VERSION, "-v, --version", "display the version number")
  .argument("[directory]", "project directory to scan", ".")
  .action((directory: string) => {
    try {
      const resolvedDirectory = path.resolve(directory);
      logger.log(`react-doctor v${VERSION}`);
      logger.break();
      logger.dim(`Scanning ${resolvedDirectory}...`);
      logger.break();
      scan(resolvedDirectory);
    } catch (error) {
      handleError(error);
    }
  })
  .addHelpText(
    "after",
    `
${highlighter.dim("Learn more:")}
  ${highlighter.info("https://github.com/aidenybai/react-doctor")}
`,
  );

const main = async () => {
  await program.parseAsync();
};

main();
