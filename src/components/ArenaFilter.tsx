interface ArenaFilterProps {
  arenas: string[];
  selected: string | null;
  onSelect: (arena: string | null) => void;
}

export function ArenaFilter({ arenas, selected, onSelect }: ArenaFilterProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="shrink-0 text-xs font-medium text-gray-400 mr-0.5">
        配置
      </span>
      <button
        onClick={() => onSelect(null)}
        className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
          selected === null
            ? "bg-sky-500 text-white shadow-md shadow-sky-200 ring-2 ring-sky-300"
            : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        ALL
      </button>
      {arenas.map((arena) => {
        const isActive = selected === arena;
        return (
          <button
            key={arena}
            onClick={() => onSelect(isActive ? null : arena)}
            className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
              isActive
                ? "bg-sky-500 text-white shadow-md shadow-sky-200 ring-2 ring-sky-300 scale-110"
                : "bg-white text-sky-600 border border-sky-200 hover:bg-sky-50"
            }`}
          >
            {arena}
          </button>
        );
      })}
    </div>
  );
}
