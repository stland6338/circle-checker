import { useMemo, useRef, useState, useCallback } from "react";
import type { Circle } from "../types";
import overlayData from "../data/floormap_overlay.json";

interface FloorMapProps {
  circles: Circle[];
  bookmarks: Set<number>;
  onToggleBookmark: (id: number) => void;
}

const MAP_W = overlayData.imageWidth;
const MAP_H = overlayData.imageHeight;
const spaces = overlayData.spaces as Record<
  string,
  { x: number; y: number; w: number; h: number }
>;

const UNIT_COLORS: Record<string, string> = {
  "イルミネーションスターズ": "bg-yellow-100 text-yellow-800",
  "アンティーカ": "bg-purple-100 text-purple-800",
  "放課後クライマックスガールズ": "bg-orange-100 text-orange-800",
  "アルストロメリア": "bg-pink-100 text-pink-800",
  "ノクチル": "bg-blue-100 text-blue-800",
  "シーズ": "bg-emerald-100 text-emerald-800",
  "ストレイライト": "bg-red-100 text-red-800",
  "コメティック": "bg-amber-100 text-amber-900",
};

export function FloorMap({ circles, bookmarks, onToggleBookmark }: FloorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [selected, setSelected] = useState<string | null>(null);

  const { bookmarkedSpaces, circleBySpace } = useMemo(() => {
    const bSet = new Set<string>();
    const cMap = new Map<string, Circle>();
    for (const c of circles) {
      if (c.space) {
        cMap.set(c.space, c);
        if (bookmarks.has(c.id)) {
          bSet.add(c.space);
        }
      }
    }
    return { bookmarkedSpaces: bSet, circleBySpace: cMap };
  }, [circles, bookmarks]);

  const bookmarkCount = bookmarkedSpaces.size;
  const selectedCircle = selected ? circleBySpace.get(selected) : null;
  const selectedRect = selected ? spaces[selected] : null;

  const handleCellClick = useCallback(
    (spaceId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelected((prev) => (prev === spaceId ? null : spaceId));
    },
    []
  );

  const handleBackgroundClick = useCallback(() => {
    setSelected(null);
  }, []);

  // ポップアップ位置の計算（セルの下、画面外なら上に出す）
  const popupStyle = useMemo(() => {
    if (!selectedRect) return {};
    const cellCx = (selectedRect.x + selectedRect.w / 2) * scale;
    const cellBottom = (selectedRect.y + selectedRect.h) * scale;
    const cellTop = selectedRect.y * scale;
    const popupW = 220;

    // 左右: セル中心を基準に、画面内に収める
    let left = cellCx - popupW / 2;
    left = Math.max(4, Math.min(left, MAP_W * scale - popupW - 4));

    // 上下: デフォルトはセルの下、コンテナ内での位置で判定
    const top = cellBottom + 8;

    return {
      position: "absolute" as const,
      left,
      top,
      width: popupW,
      zIndex: 50,
    };
  }, [selectedRect, scale]);

  return (
    <div className="pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 z-20 bg-gray-50 px-3 pt-3 pb-2 shadow-sm">
        <h2 className="text-center text-base font-bold text-gray-800">
          会場配置図
        </h2>
        <p className="text-center text-xs text-gray-400 mt-1">
          {bookmarkCount > 0 ? (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded bg-yellow-400 align-middle" />
              ブックマーク済み: {bookmarkCount}件
              <span className="ml-2 text-gray-300">タップで詳細</span>
            </>
          ) : (
            "セルをタップするとサークル情報を確認できます"
          )}
        </p>
        {/* ズーム */}
        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => setScale((s) => Math.max(0.25, s - 0.1))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-bold text-gray-600 active:bg-gray-100"
          >
            −
          </button>
          <span className="text-xs text-gray-400 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-bold text-gray-600 active:bg-gray-100"
          >
            ＋
          </button>
        </div>
      </div>

      {/* マップ本体 */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={handleBackgroundClick}
      >
        <div
          className="relative"
          style={{ width: MAP_W * scale, height: MAP_H * scale }}
        >
          {/* 配置図画像 */}
          <img
            src="/floormap.webp"
            alt="会場配置図"
            width={MAP_W * scale}
            height={MAP_H * scale}
            className="block"
            draggable={false}
          />

          {/* オーバーレイSVG */}
          <svg
            className="absolute inset-0"
            width={MAP_W * scale}
            height={MAP_H * scale}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          >
            {Object.entries(spaces).map(([spaceId, rect]) => {
              const isBookmarked = bookmarkedSpaces.has(spaceId);
              const isSelected = selected === spaceId;
              return (
                <rect
                  key={spaceId}
                  x={rect.x - 1}
                  y={rect.y - 1}
                  width={rect.w + 2}
                  height={rect.h + 2}
                  rx={3}
                  fill={
                    isSelected
                      ? "rgba(59, 130, 246, 0.45)"
                      : isBookmarked
                      ? "rgba(250, 204, 21, 0.5)"
                      : "transparent"
                  }
                  stroke={
                    isSelected
                      ? "rgba(37, 99, 235, 0.9)"
                      : isBookmarked
                      ? "rgba(234, 179, 8, 0.9)"
                      : "transparent"
                  }
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer"
                  onClick={(e) => handleCellClick(spaceId, e as unknown as React.MouseEvent)}
                  style={{ pointerEvents: "auto" }}
                />
              );
            })}
          </svg>

          {/* ポップアップ */}
          {selected && selectedCircle && selectedRect && (
            <div
              style={popupStyle}
              className="rounded-xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-2 p-3">
                {/* サークルカット */}
                <img
                  src={`/cuts/${encodeURIComponent(selectedCircle.space)}.webp`}
                  alt=""
                  className="shrink-0 rounded border border-gray-100"
                  width={56}
                  height={56}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="min-w-0 flex-1">
                  {/* スペース番号 + サークル名 */}
                  <div className="flex items-center gap-1">
                    <span className="shrink-0 rounded bg-sky-100 px-1 py-0.5 text-[10px] font-bold text-sky-700">
                      {selectedCircle.space}
                    </span>
                    <span className="truncate text-xs font-bold text-gray-900">
                      {selectedCircle.name}
                    </span>
                  </div>
                  {/* PN */}
                  {selectedCircle.penName &&
                    selectedCircle.penName !== selectedCircle.name && (
                      <p className="mt-0.5 text-[10px] text-gray-400 truncate">
                        / {selectedCircle.penName}
                      </p>
                    )}
                  {/* ユニット */}
                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className={`inline-block rounded px-1 py-0.5 text-[10px] font-medium ${
                        UNIT_COLORS[selectedCircle.unit] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedCircle.produceIdol}
                    </span>
                  </div>
                  {/* Xリンク */}
                  {selectedCircle.links.twitter && (
                    <a
                      href={selectedCircle.links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-white"
                    >
                      𝕏{" "}
                      {selectedCircle.links.twitter.replace(
                        /https?:\/\/(x|twitter)\.com\//,
                        "@"
                      )}
                    </a>
                  )}
                </div>
                {/* ★ ブックマーク + ✕ 閉じる */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggleBookmark(selectedCircle.id)}
                    className={`text-lg leading-none ${
                      bookmarks.has(selectedCircle.id)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    {bookmarks.has(selectedCircle.id) ? "★" : "☆"}
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-gray-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
