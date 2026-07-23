const COLORS = [
    'bg-blue-500 dark:bg-blue-600',
    'bg-green-500 dark:bg-green-600',
    'bg-purple-500 dark:bg-purple-600',
    'bg-orange-500 dark:bg-orange-600',
    'bg-teal-500 dark:bg-teal-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-cyan-500 dark:bg-cyan-600',
    'bg-rose-500 dark:bg-rose-600',
    'bg-amber-500 dark:bg-amber-600',
]

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0
    }
    return Math.abs(hash)
}

export function getAvatarColor(name: string | null | undefined): string {
    if (!name) return COLORS[0]
    return COLORS[hashString(name) % COLORS.length]
}

export default function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
