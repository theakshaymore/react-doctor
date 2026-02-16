import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { SOURCE_FILE_PATTERN } from "../constants.js";
import type { Framework, ProjectInfo } from "../types.js";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const FRAMEWORK_PACKAGES: Record<string, Framework> = {
  next: "nextjs",
  vite: "vite",
  "react-scripts": "cra",
  "@remix-run/react": "remix",
  gatsby: "gatsby",
};

const FRAMEWORK_DISPLAY_NAMES: Record<Framework, string> = {
  nextjs: "Next.js",
  vite: "Vite",
  cra: "Create React App",
  remix: "Remix",
  gatsby: "Gatsby",
  unknown: "React",
};

export const formatFrameworkName = (framework: Framework): string =>
  FRAMEWORK_DISPLAY_NAMES[framework];

const countSourceFiles = (rootDirectory: string): number => {
  const result = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: rootDirectory,
    encoding: "utf-8",
  });

  if (result.error || result.status !== 0) {
    return 0;
  }

  return result.stdout
    .split("\n")
    .filter((filePath) => filePath.length > 0 && SOURCE_FILE_PATTERN.test(filePath)).length;
};

export const discoverProject = (directory: string): ProjectInfo => {
  const packageJsonPath = path.join(directory, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`No package.json found in ${directory}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageJson;
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const reactVersion = allDependencies.react ?? null;

  let framework: Framework = "unknown";
  for (const [packageName, frameworkName] of Object.entries(FRAMEWORK_PACKAGES)) {
    if (allDependencies[packageName]) {
      framework = frameworkName;
      break;
    }
  }

  const hasTypeScript = fs.existsSync(path.join(directory, "tsconfig.json"));
  const sourceFileCount = countSourceFiles(directory);

  return {
    rootDirectory: directory,
    reactVersion,
    framework,
    hasTypeScript,
    sourceFileCount,
  };
};
