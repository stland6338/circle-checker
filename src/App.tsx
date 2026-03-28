import { useState, useMemo } from "react";
import circlesData from "./data/circles.json";
import type { Circle } from "./types";
import { useBookmarks } from "./hooks/useBookmarks";
import { CircleCard } from "./components/CircleCard";
import { SearchBar } from "./components/SearchBar";
import { UnitFilter } from "./components/CharacterFilter";
import { ArenaFilter } from "./components/ArenaFilter";
import { FloorMap } from "./components/FloorMap";
import { TabNav, type Tab } from "./components/TabNav";

// スペース番号でソート（ア-01, ア-02, ... イ-01, ...）
const ARENA_ORDER = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ"];

function spaceSort(a: Circle, b: Circle): number {
  if (!a.space && !b.space) return 0;
  if (!a.space) return 1;
  if (!b.space) return -1;

  const [arenaA, numA] = a.space.split("-");
  const [arenaB, numB] = b.space.split("-");

  const ai = ARENA_ORDER.indexOf(arenaA);
  const bi = ARENA_ORDER.indexOf(arenaB);
  if (ai !== bi) return ai - bi;
  return parseInt(numA, 10) - parseInt(numB, 10);
}

const circles: Circle[] = [...circlesData].sort(spaceSort);

// ユニット一覧（表示順を固定）
const UNIT_ORDER = [
  "イルミネーションスターズ",
  "アンティーカ",
  "放課後クライマックスガールズ",
  "アルストロメリア",
  "ストレイライト",
  "ノクチル",
  "シーズ",
  "コメティック",
];

const allUnits = UNIT_ORDER.filter((u) =>
  circles.some((c) => c.unit === u)
);

export default function App() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedArena, setSelectedArena] = useState<string | null>(null);
  const { bookmarks, toggle, isBookmarked } = useBookmarks();

  const filtered = useMemo(() => {
    let list = circles;

    if (tab === "bookmarks") {
      list = list.filter((c) => bookmarks.has(c.id));
    }

    if (selectedUnit) {
      list = list.filter((c) => c.unit === selectedUnit);
    }

    if (selectedArena) {
      list = list.filter((c) => c.space.startsWith(selectedArena + "-"));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.penName.toLowerCase().includes(q) ||
          c.characters.some((ch) => ch.toLowerCase().includes(q)) ||
          c.produceIdol.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q) ||
          c.space.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tab, search, selectedUnit, selectedArena, bookmarks]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {tab === "map" ? (
        <FloorMap circles={circles} bookmarks={bookmarks} onToggleBookmark={toggle} />
      ) : (
        <>
          <header className="sticky top-0 z-10 space-y-2 bg-gray-50 px-3 pt-3 pb-2 shadow-sm">
            <h1 className="text-center text-base font-bold text-gray-800">
              SSF10 サークルチェッカー
            </h1>
            <SearchBar value={search} onChange={setSearch} />
            <ArenaFilter
              arenas={ARENA_ORDER}
              selected={selectedArena}
              onSelect={setSelectedArena}
            />
            <UnitFilter
              units={allUnits}
              selected={selectedUnit}
              onSelect={setSelectedUnit}
            />
            <p className="text-center text-xs text-gray-400">
              {filtered.length} / {circles.length} サークル
            </p>
          </header>

          <main className="space-y-2 px-3 pt-2">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">
                {tab === "bookmarks"
                  ? "ブックマークがありません"
                  : "該当するサークルがありません"}
              </p>
            ) : (
              filtered.map((c) => (
                <CircleCard
                  key={c.id}
                  circle={c}
                  isBookmarked={isBookmarked(c.id)}
                  onToggleBookmark={toggle}
                />
              ))
            )}
          </main>
        </>
      )}

      <TabNav
        active={tab}
        onChange={setTab}
        bookmarkCount={bookmarks.size}
      />
    </div>
  );
}
