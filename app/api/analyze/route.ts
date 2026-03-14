import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { repoUrl } = await req.json();

        // Parse URL: handle both "https://github.com/owner/repo" and "owner/repo"
        const match = repoUrl?.match(/(?:github\.com\/)?([^\/\s]+)\/([^\/\s?#]+)/);
        if (!match) {
            return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
        }

        const owner = match[1];
        const repo = match[2].replace(/\.git$/, '');

        const headers: Record<string, string> = {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'CodeDNA-App',
        };

        // Use token if available
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (token && token !== 'optional_for_higher_rate_limits') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch in parallel for speed
        const [metaRes, treeRes, readmeRes, langsRes] = await Promise.allSettled([
            fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
        ]);

        // Handle meta
        const meta = metaRes.status === 'fulfilled' ? await metaRes.value.json() : {};

        if (meta.message === 'Not Found') {
            return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
        }

        if (meta.message?.includes('rate limit')) {
            return NextResponse.json({ error: 'GitHub API rate limit reached. Wait 60 seconds.' }, { status: 429 });
        }

        // Decode README from base64
        let readme = '';
        if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
            const readmeData = await readmeRes.value.json();
            if (readmeData.content) {
                try {
                    readme = atob(readmeData.content.replace(/\n/g, ''));
                    readme = readme.substring(0, 4000); // limit tokens
                } catch {
                    readme = '';
                }
            }
        }

        // Get file tree (limit to 150 files)
        let fileTree: string[] = [];
        if (treeRes.status === 'fulfilled' && treeRes.value.ok) {
            const treeData = await treeRes.value.json();
            fileTree = (treeData.tree || [])
                .filter((f: { type: string }) => f.type === 'blob')
                .slice(0, 150)
                .map((f: { path: string }) => f.path);
        }

        const langs = langsRes.status === 'fulfilled' && langsRes.value.ok
            ? await langsRes.value.json()
            : {};

        // Try to fetch package.json for richer analysis
        let packageJson = '';
        try {
            const pkgRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
                { headers }
            );
            if (pkgRes.ok) {
                const pkgData = await pkgRes.json();
                if (pkgData.content) {
                    packageJson = atob(pkgData.content.replace(/\n/g, '')).substring(0, 2000);
                }
            }
        } catch {
            // Not a JS project, ignore
        }

        return NextResponse.json({
            owner,
            repo,
            meta,
            readme,
            fileTree,
            langs,
            packageJson,
            cached: false,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Analyze error:', error);
        return NextResponse.json({ error: 'Failed to analyze repository' }, { status: 500 });
    }
}
