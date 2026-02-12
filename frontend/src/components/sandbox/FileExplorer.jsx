import { useState, useMemo, useCallback } from 'react'
import {
  Folder,
  FolderOpen,
  File,
  Search,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  ArrowUp,
  FolderInput,
} from 'lucide-react'
import CopyButton from '../common/CopyButton'
import { useSandbox } from '../../context/SandboxContext'

export default function FileExplorer({ onFileSelect, onHide }) {
  const { agentConnected, fileTree, fileTreeLoading, requestFilesystemList, navigateToParent, navigateToPath, navigateToPathFromExplorer, requestFileContent, browsePath, sandboxPath } = useSandbox()
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)

  // Flatten file tree for search (fullPath = path from root)
  const flattenTree = useCallback((items, path = '') => {
    const result = []
    items.forEach((item) => {
      const fullPath = path ? `${path}/${item.name}` : item.name
      result.push({ ...item, fullPath })
      if (item.children && item.children.length > 0) {
        result.push(...flattenTree(item.children, fullPath))
      }
    })
    return result
  }, [])

  // Request folder contents when expanding - always fetch fresh from agent
  // When expanding (not collapsing), also cd terminal into that folder
  // Note: Do NOT call setState of parent (SandboxProvider) inside setExpandedFolders - causes React warning
  const handleExpandFolder = useCallback((pathKey, pathForRequest, isExpanding) => {
    const wasExpanded = expandedFolders.has(pathKey)
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pathKey)) {
        newSet.delete(pathKey)
        return newSet
      }
      newSet.add(pathKey)
      return newSet
    })
    if (agentConnected && !wasExpanded) {
      requestFilesystemList?.(pathForRequest)
      if (isExpanding && navigateToPathFromExplorer) {
        navigateToPathFromExplorer(pathForRequest)
      }
    }
  }, [agentConnected, requestFilesystemList, navigateToPathFromExplorer, expandedFolders])

  // Filter tree based on search - matches name and full path
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) {
      return fileTree || []
    }

    const q = searchQuery.toLowerCase().trim()
    const matches = (item, fullPath) =>
      item.name.toLowerCase().includes(q) ||
      (fullPath && fullPath.toLowerCase().includes(q))

    const buildFilteredTree = (items, parentPath = '') => {
      return items
        .map((item) => {
          const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name
          if (item.type === 'file') {
            return matches(item, fullPath) ? { ...item, fullPath } : null
          }
          const filteredChildren = item.children
            ? buildFilteredTree(item.children, fullPath).filter(Boolean)
            : []
          const matchesSearch = matches(item, fullPath)
          if (matchesSearch || filteredChildren.length > 0) {
            return {
              ...item,
              fullPath,
              children: filteredChildren,
            }
          }
          return null
        })
        .filter(Boolean)
    }

    return buildFilteredTree(fileTree || [])
  }, [fileTree, searchQuery])

  const toggleFolder = useCallback((folderPath) => {
    const base = browsePath === '..' ? '..' : '.'
    // When at home (browsePath === '..'), always prepend ../ so paths resolve to ~/...
    const pathForRequest = folderPath
      ? (browsePath === '..' ? `../${folderPath}`.replace(/\/+/g, '/') : (folderPath.includes('/') ? folderPath : `${base}/${folderPath}`.replace(/\/+/g, '/')))
      : base
    const isExpanding = !expandedFolders.has(folderPath)
    handleExpandFolder(folderPath, pathForRequest, isExpanding)
  }, [handleExpandFolder, browsePath, expandedFolders])

  const handleItemClick = useCallback((item, path) => {
    setSelectedItem(path)
    if (item.type === 'folder') {
      toggleFolder(path)
    } else {
      // Click file: run cat (read content and display in terminal)
      const pathForRead = browsePath === '..' ? `../${path}`.replace(/\/+/g, '/') : path
      requestFileContent?.(pathForRead)
      onFileSelect?.(item, path)
    }
  }, [toggleFolder, onFileSelect, browsePath, requestFileContent])

  const renderTreeItem = (item, level = 0, path = '') => {
    const fullPath = path ? `${path}/${item.name}` : item.name
    const isExpanded = expandedFolders.has(fullPath)
    const isSelected = selectedItem === fullPath
    const isFolder = item.type === 'folder'
    const hasChildren = item.children && item.children.length > 0
    const isLoading = isFolder && isExpanded && !hasChildren && fileTreeLoading

    return (
      <div key={fullPath}>
        <div
          onClick={() => handleItemClick(item, fullPath)}
          className={`
            flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded transition-colors
            ${isSelected ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'text-gray-300 hover:bg-[#1f2937]'}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Chevron for folders - always show so user knows they're expandable */}
          {isFolder && (
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </div>
          )}
          {!isFolder && <div className="w-4 h-4" />}

          {/* Icon */}
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0" />
            )
          ) : (
            <File className="w-4 h-4 flex-shrink-0" />
          )}

          {/* Name */}
          <span className="text-sm truncate flex-1">{item.name}</span>
        </div>

        {/* Render children if folder is expanded */}
        {isFolder && isExpanded && (
          <div className="transition-all duration-200">
            {isLoading ? (
              <div className="py-1 px-2 text-xs text-gray-500" style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}>
                Loading...
              </div>
            ) : hasChildren ? (
              item.children.map((child) => renderTreeItem(child, level + 1, fullPath))
            ) : null}
          </div>
        )}
      </div>
    )
  }

  const handleHide = () => {
    if (onHide) {
      onHide()
    } else {
      setIsMinimized(true)
    }
  }

  if (isMinimized && !onHide) {
    return (
      <div className="w-12 bg-[#111827] border-r border-[#1f2937] flex flex-col items-center py-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-[#1f2937] rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Expand Explorer"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-full lg:w-[250px] bg-[#111827] border-r border-[#1f2937] flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#1f2937]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            EXPLORER
          </h2>
          <button
            onClick={handleHide}
            className="p-1.5 hover:bg-[#1f2937] rounded transition-colors"
            title="Hide Explorer"
          >
            <PanelLeftClose className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          {browsePath === '..' ? (
            <button
              onClick={() => navigateToPath('.')}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-[#00ff88] hover:bg-[#1f2937] rounded transition-colors"
              title="Back to sandbox"
            >
              <FolderInput className="w-3 h-3" />
              Sandbox
            </button>
          ) : browsePath && browsePath !== '.' ? (
            <button
              onClick={() => {
                const parts = browsePath.replace(/\/+$/, '').split('/').filter(Boolean)
                parts.pop()
                navigateToPath(parts.length ? parts.join('/') : '.')
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-[#00ff88] hover:bg-[#1f2937] rounded transition-colors"
              title="Go up"
            >
              <ArrowUp className="w-3 h-3" />
              Up
            </button>
          ) : null}
          {browsePath === '.' && (
            <button
              onClick={navigateToParent}
              disabled={!agentConnected}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-[#00ff88] hover:bg-[#1f2937] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Go to home directory"
            >
              <ArrowUp className="w-3 h-3" />
              Home
            </button>
          )}
        </div>
        {sandboxPath && (
          <div className="flex items-center gap-1 mb-2">
            <p className="text-xs text-gray-500 truncate flex-1" title={sandboxPath}>
              {sandboxPath}
            </p>
            <CopyButton text={sandboxPath} title="Copy sandbox path" />
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded px-8 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {!agentConnected ? (
          <div className="text-center text-gray-500 text-sm py-8 px-4">
            <p className="mb-2">Connect your agent to browse files</p>
            <p className="text-xs text-gray-600">
              Run: <code className="bg-[#0a0f1a] px-1 rounded">trymint connect</code>
            </p>
          </div>
        ) : fileTreeLoading && filteredTree.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Loading...
          </div>
        ) : filteredTree.length > 0 ? (
          filteredTree.map((item) => renderTreeItem(item))
        ) : (
          <div className="text-center text-gray-500 text-sm py-8">
            No files found
          </div>
        )}
      </div>
    </div>
  )
}
