interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="サークル名・キャラ名で検索..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
}
