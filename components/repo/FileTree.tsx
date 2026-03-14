'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { getFileIcon } from '@/lib/github-colors';

interface FileTreeProps {
    files: string[];
    onFileClick?: (path: string) => void;
    selectedFile?: string | null;
}

interface TreeNode {
    name: string;
    path: string;
    isDir: boolean;
    children: TreeNode[];
}

function buildTree(paths: string[]): TreeNode[] {
    const root: TreeNode[] = [];

    for (const filePath of paths) {
        const parts = filePath.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const name = parts[i];
            const isLast = i === parts.length - 1;
            const currentPath = parts.slice(0, i + 1).join('/');

            let existing = current.find((n) => n.name === name);
            if (!existing) {
                existing = {
                    name,
                    path: currentPath,
                    isDir: !isLast,
                    children: [],
                };
                current.push(existing);
            }
            current = existing.children;
        }
    }

    function sortTree(nodes: TreeNode[]): TreeNode[] {
        return nodes.sort((a, b) => {
            if (a.isDir === b.isDir) return a.name.localeCompare(b.name);
            return a.isDir ? -1 : 1;
        }).map((n) => ({ ...n, children: sortTree(n.children) }));
    }

    return sortTree(root);
}

function FileTreeItem({
    node,
    depth,
    onFileClick,
    selectedFile,
    defaultOpen,
}: {
    node: TreeNode;
    depth: number;
    onFileClick?: (path: string) => void;
    selectedFile?: string | null;
    defaultOpen: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const fileInfo = !node.isDir ? getFileIcon(node.name) : null;
    const isSelected = selectedFile === node.path;

    return (
        <div>
            <button
                onClick={() => {
                    if (node.isDir) {
                        setIsOpen(!isOpen);
                    } else {
                        onFileClick?.(node.path);
                    }
                }}
                className={`
          flex items-center w-full text-left px-3 py-[5px] text-sm
          border-b border-[var(--color-gh-border)] transition-colors duration-100
          ${isSelected
                        ? 'bg-[rgba(56,139,253,0.1)]'
                        : 'hover:bg-[var(--color-gh-surface-hover)]'
                    }
        `}
                style={{ paddingLeft: `${12 + depth * 20}px` }}
            >
                {/* Indentation lines */}
                {depth > 0 && (
                    <div className="absolute left-0 top-0 bottom-0" style={{ width: `${depth * 20 + 12}px` }}>
                        {Array.from({ length: depth }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-[var(--color-gh-border-muted)]"
                                style={{ left: `${24 + i * 20}px` }}
                            />
                        ))}
                    </div>
                )}

                {node.isDir ? (
                    <>
                        <ChevronRight
                            className={`h-3.5 w-3.5 text-[var(--color-gh-text-muted)] mr-1.5 flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''
                                }`}
                        />
                        {isOpen ? (
                            <FolderOpen className="h-4 w-4 text-[var(--color-gh-blue)] mr-2 flex-shrink-0" />
                        ) : (
                            <Folder className="h-4 w-4 text-[var(--color-gh-blue)] mr-2 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-[var(--color-gh-text)] truncate">{node.name}</span>
                    </>
                ) : (
                    <>
                        <span className="w-3.5 mr-1.5 flex-shrink-0" />
                        <span
                            className="inline-flex items-center justify-center h-4 w-5 mr-2 text-[9px] font-bold flex-shrink-0 rounded-sm"
                            style={{ color: fileInfo?.color, opacity: 0.8 }}
                        >
                            {fileInfo?.icon}
                        </span>
                        <span className="text-[var(--color-gh-text)] truncate">{node.name}</span>
                    </>
                )}
            </button>

            <AnimatePresence initial={false}>
                {node.isDir && isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child) => (
                            <FileTreeItem
                                key={child.path}
                                node={child}
                                depth={depth + 1}
                                onFileClick={onFileClick}
                                selectedFile={selectedFile}
                                defaultOpen={depth < 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FileTree({ files, onFileClick, selectedFile }: FileTreeProps) {
    const tree = useMemo(() => buildTree(files), [files]);

    return (
        <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] overflow-hidden">
            <div className="bg-[var(--color-gh-surface)] border-b border-[var(--color-gh-border)] px-4 py-2">
                <span className="text-xs font-semibold text-[var(--color-gh-text)]">
                    {files.length} files
                </span>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
                {tree.map((node) => (
                    <FileTreeItem
                        key={node.path}
                        node={node}
                        depth={0}
                        onFileClick={onFileClick}
                        selectedFile={selectedFile}
                        defaultOpen={true}
                    />
                ))}
            </div>
        </div>
    );
}
