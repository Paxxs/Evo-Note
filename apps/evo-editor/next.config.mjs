import { execSync } from "child_process";

const gitInfo = execSync('git log -1 --pretty=format:"%h|%an|%ae"')
  .toString()
  .trim()
  .split("|"); // 将返回结果分割为数组，其中包含哈希、作者名和作者邮箱

const commitHash = gitInfo[0];
const lastAuthorName = gitInfo[1];
const lastAuthorEmail = gitInfo[2];

const effectiveEmail = lastAuthorEmail.includes("noreply.github.com")
  ? "pm"
  : lastAuthorEmail;
const lastAuthor = `${lastAuthorName}<${effectiveEmail}>`;

const repositoryUrl = execSync("git config --get remote.origin.url")
  .toString()
  .trim();

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
