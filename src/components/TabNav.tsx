export type Tab = "all" | "bookmarks";

interface TabNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  bookmarkCount: number;
}

export function TabNav({ active, onChange, bookmarkCount }: TabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        <button
          onClick={() => onChange("all")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            active === "all"
              ? "text-blue-600 border-t-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          全サークル
        </button>
        <button
          onClick={() => onChange("bookmarks")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            active === "bookmarks"
              ? "text-blue-600 border-t-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          ★ ブクマ{bookmarkCount > 0 && ` (${bookmarkCount})`}
        </button>
      </div>
    </nav>
  );
}
