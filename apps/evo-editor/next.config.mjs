import { execSync } from "child_process";

/**
 * Executes a command synchronously and returns the trimmed output.
 *
 * @param {string} command - The command to be executed.
 * @return {string} The trimmed output of the executed command.
 */
function tryExecSync(command) {
  try {
    return execSync(command).toString().trim();
  } catch (error) {
    return "";
  }
}

/**
 * Retrieves the Git information including commit hash, last author name, last author email, and repository URL.
 *
 * @return {Object} Object containing commitHash, lastAuthorName, lastAuthorEmail, and repositoryUrl
 */
function getGitInfo() {
  const gitInfo = tryExecSync('git log -1 --pretty=format:"%h|%an|%ae"').split(
    "|",
  );
  if (gitInfo.length === 3) {
    const [commitHash, lastAuthorName, lastAuthorEmail] = gitInfo;
    const repositoryUrl = tryExecSync("git config --get remote.origin.url");
    return { commitHash, lastAuthorName, lastAuthorEmail, repositoryUrl };
  } else {
    console.log(":: Git tool is not installed, please consider installing Git");
    return {
      commitHash: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "",
      lastAuthorName: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || "",
      lastAuthorEmail: process.env.VERCEL_GIT_REPO_SLUG || "",
      repositoryUrl: process.env.VERCEL_URL || "",
    };
  }
}

const { commitHash, lastAuthorName, lastAuthorEmail, repositoryUrl } =
  getGitInfo();

const effectiveEmail = lastAuthorEmail.includes("noreply.github.com")
  ? "pm"
  : lastAuthorEmail;
const lastAuthor = lastAuthorName ? `${lastAuthorName}<${effectiveEmail}>` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  distDir: "../go-backend/dist",
  env: {
    GIT_HASH: commitHash,
    LAST_GIT_AUTHOR: lastAuthor,
    REPOSITORY_URL: repositoryUrl,
  },
};

export default nextConfig;
