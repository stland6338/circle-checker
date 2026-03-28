interface UnitFilterProps {
  units: string[];
  selected: string | null;
  onSelect: (unit: string | null) => void;
}

const UNIT_STYLES: Record<string, { active: string; inactive: string }> = {
  "イルミネーションスターズ": {
    active: "bg-yellow-400 text-yellow-900 shadow-md shadow-yellow-200 ring-2 ring-yellow-300",
    inactive: "bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50",
  },
  "アンティーカ": {
    active: "bg-purple-500 text-white shadow-md shadow-purple-200 ring-2 ring-purple-300",
    inactive: "bg-white text-purple-600 border border-purple-200 hover:bg-purple-50",
  },
  "放課後クライマックスガールズ": {
    active: "bg-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-300",
    inactive: "bg-white text-orange-600 border border-orange-200 hover:bg-orange-50",
  },
  "アルストロメリア": {
    active: "bg-pink-400 text-white shadow-md shadow-pink-200 ring-2 ring-pink-300",
    inactive: "bg-white text-pink-600 border border-pink-200 hover:bg-pink-50",
  },
  "ストレイライト": {
    active: "bg-red-600 text-white shadow-md shadow-red-200 ring-2 ring-red-300",
    inactive: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  },
  "ノクチル": {
    active: "bg-blue-500 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300",
    inactive: "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50",
  },
  "シーズ": {
    active: "bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-300",
    inactive: "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50",
  },
  "コメティック": {
    active: "bg-amber-800 text-white shadow-md shadow-amber-200 ring-2 ring-amber-400",
    inactive: "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50",
  },
};

const UNIT_SHORT: Record<string, string> = {
  "イルミネーションスターズ": "イルミネ",
  "アンティーカ": "アンティーカ",
  "放課後クライマックスガールズ": "放クラ",
  "アルストロメリア": "アルスト",
  "ストレイライト": "ストレイ",
  "ノクチル": "ノクチル",
  "シーズ": "シーズ",
  "コメティック": "コメティック",
};

export function UnitFilter({
  units,
  selected,
  onSelect,
}: UnitFilterProps) {
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <span className="shrink-0 text-xs font-medium text-gray-400 mr-0.5">
        ユニット
      </span>
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
          selected === null
            ? "bg-gray-700 text-white shadow-md shadow-gray-300 ring-2 ring-gray-400"
            : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        ALL
      </button>
      {units.map((unit) => {
        const style = UNIT_STYLES[unit] ?? {
          active: "bg-gray-500 text-white shadow-md shadow-gray-200 ring-2 ring-gray-300",
          inactive: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50",
        };
        const isActive = selected === unit;
        return (
          <button
            key={unit}
            onClick={() => onSelect(isActive ? null : unit)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              isActive ? style.active : style.inactive
            }`}
          >
            {UNIT_SHORT[unit] ?? unit}
          </button>
        );
      })}
    </div>
  );
}
