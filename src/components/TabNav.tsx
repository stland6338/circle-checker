export type Tab = "all" | "bookmarks" | "map";

interface TabNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  bookmarkCount: number;
}

export function TabNav({ active, onChange, bookmarkCount }: TabNavProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "全サークル" },
    { id: "bookmarks", label: `★ ブクマ${bookmarkCount > 0 ? ` (${bookmarkCount})` : ""}` },
    { id: "map", label: "📍 配置図" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              active === t.id
                ? "text-blue-600 border-t-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
