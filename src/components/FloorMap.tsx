import { useMemo, useRef, useState } from "react";
import type { Circle } from "../types";
import overlayData from "../data/floormap_overlay.json";

interface FloorMapProps {
  circles: Circle[];
  bookmarks: Set<number>;
}

const MAP_W = overlayData.imageWidth;
const MAP_H = overlayData.imageHeight;
const spaces = overlayData.spaces as Record<
  string,
  { x: number; y: number; w: number; h: number }
>;

export function FloorMap({ circles, bookmarks }: FloorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45); // 初期スケール（スマホ向け）

  const bookmarkedSpaces = useMemo(() => {
    const set = new Set<string>();
    for (const c of circles) {
      if (c.space && bookmarks.has(c.id)) {
        set.add(c.space);
      }
    }
    return set;
  }, [circles, bookmarks]);

  const bookmarkCount = bookmarkedSpaces.size;

  return (
    <div className="pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-gray-50 px-3 pt-3 pb-2 shadow-sm">
        <h2 className="text-center text-base font-bold text-gray-800">
          会場配置図
        </h2>
        <p className="text-center text-xs text-gray-400 mt-1">
          {bookmarkCount > 0 ? (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded bg-yellow-400 align-middle" />
              ブックマーク済み: {bookmarkCount}件
            </>
          ) : (
            "★をタップしてブックマークすると配置図上で光ります"
          )}
        </p>
        {/* ズームコントロール */}
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

      {/* マップ本体（スクロール可能） */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="relative"
          style={{
            width: MAP_W * scale,
            height: MAP_H * scale,
          }}
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

          {/* ブックマーク済みスペースのオーバーレイ */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={MAP_W * scale}
            height={MAP_H * scale}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          >
            {Object.entries(spaces).map(([spaceId, rect]) => {
              if (!bookmarkedSpaces.has(spaceId)) return null;
              return (
                <rect
                  key={spaceId}
                  x={rect.x - 1}
                  y={rect.y - 1}
                  width={rect.w + 2}
                  height={rect.h + 2}
                  rx={3}
                  fill="rgba(250, 204, 21, 0.5)"
                  stroke="rgba(234, 179, 8, 0.9)"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
