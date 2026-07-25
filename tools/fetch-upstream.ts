const REPO = 'angular/angular';
const DIR_PATH = 'adev/src/app/features/update';

export interface UpstreamSource {
  repo: string;
  path: string;
  commitSha: string;
}

/**
 * Resolves the latest commit SHA touching the update-guide directory, then
 * fetches both source files pinned to that exact SHA (never `main` directly
 * — a moving branch could drift from the recorded SHA between the two
 * requests).
 */
export async function fetchUpstream(): Promise<{
  source: UpstreamSource;
  recommendationsText: string;
  updateComponentText: string;
}> {
  const commitsUrl = `https://api.github.com/repos/${REPO}/commits?path=${DIR_PATH}&per_page=1`;
  const commitsRes = await fetch(commitsUrl, {
    headers: {Accept: 'application/vnd.github+json'},
  });
  if (!commitsRes.ok) {
    throw new Error(`GitHub API request failed: ${commitsRes.status} ${commitsRes.statusText}`);
  }
  const commits = (await commitsRes.json()) as Array<{sha: string}>;
  const commitSha = commits[0]?.sha;
  if (!commitSha) {
    throw new Error(`no commits found for path ${DIR_PATH}`);
  }

  const rawUrl = (filePath: string) =>
    `https://raw.githubusercontent.com/${REPO}/${commitSha}/${filePath}`;

  const [recommendationsText, updateComponentText] = await Promise.all([
    fetchRawText(rawUrl(`${DIR_PATH}/recommendations.ts`)),
    fetchRawText(rawUrl(`${DIR_PATH}/update.component.ts`)),
  ]);

  return {
    source: {repo: REPO, path: DIR_PATH, commitSha},
    recommendationsText,
    updateComponentText,
  };
}

async function fetchRawText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`raw fetch failed: ${res.status} ${res.statusText} (${url})`);
  }
  return res.text();
}
