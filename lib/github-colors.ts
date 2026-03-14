export const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Lua: '#000080',
    R: '#198CE7',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Erlang: '#B83998',
    Perl: '#0298c3',
    'Objective-C': '#438eff',
    Assembly: '#6E4C13',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    Jupyter: '#DA5B0B',
    Markdown: '#083fa1',
    JSON: '#292929',
    YAML: '#cb171e',
    TOML: '#9c4221',
    XML: '#0060ac',
};

export function getLanguageColor(lang: string): string {
    return languageColors[lang] || '#8b949e';
}

export const fileIcons: Record<string, { icon: string; color: string }> = {
    ts: { icon: 'TS', color: '#3178c6' },
    tsx: { icon: 'TX', color: '#3178c6' },
    js: { icon: 'JS', color: '#f1e05a' },
    jsx: { icon: 'JX', color: '#f1e05a' },
    py: { icon: 'PY', color: '#3572A5' },
    rb: { icon: 'RB', color: '#701516' },
    go: { icon: 'GO', color: '#00ADD8' },
    rs: { icon: 'RS', color: '#dea584' },
    java: { icon: 'JA', color: '#b07219' },
    json: { icon: '{}', color: '#292929' },
    yaml: { icon: 'YM', color: '#cb171e' },
    yml: { icon: 'YM', color: '#cb171e' },
    md: { icon: 'MD', color: '#083fa1' },
    css: { icon: 'CS', color: '#563d7c' },
    scss: { icon: 'SC', color: '#c6538c' },
    html: { icon: 'HT', color: '#e34c26' },
    svg: { icon: 'SV', color: '#ff9900' },
    png: { icon: 'IM', color: '#a074c4' },
    jpg: { icon: 'IM', color: '#a074c4' },
    gif: { icon: 'IM', color: '#a074c4' },
    lock: { icon: 'LK', color: '#6e7681' },
    toml: { icon: 'TM', color: '#9c4221' },
    xml: { icon: 'XM', color: '#0060ac' },
    sh: { icon: 'SH', color: '#89e051' },
    dockerfile: { icon: 'DK', color: '#384d54' },
};

export function getFileIcon(filename: string): { icon: string; color: string } {
    const lower = filename.toLowerCase();
    if (lower === 'dockerfile') return fileIcons.dockerfile;
    const ext = lower.split('.').pop() || '';
    return fileIcons[ext] || { icon: '📄', color: '#8b949e' };
}
