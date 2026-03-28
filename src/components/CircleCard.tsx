import { useState } from "react";
import type { Circle } from "../types";

interface CircleCardProps {
  circle: Circle;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

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

export function CircleCard({
  circle,
  isBookmarked,
  onToggleBookmark,
}: CircleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const unitColor = UNIT_COLORS[circle.unit] ?? "bg-gray-100 text-gray-800";

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isBookmarked
          ? "border-yellow-400 bg-yellow-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggleBookmark(circle.id)}
          className={`mt-0.5 shrink-0 text-xl leading-none transition-colors ${
            isBookmarked ? "text-yellow-500" : "text-gray-300"
          }`}
          aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク追加"}
        >
          {isBookmarked ? "★" : "☆"}
        </button>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* スペース番号 + サークル名 + ペンネーム */}
          <div className="flex items-baseline gap-1.5">
            {circle.space && (
              <span className="shrink-0 rounded bg-sky-100 px-1.5 py-0.5 text-xs font-bold text-sky-700">
                {circle.space}
              </span>
            )}
            <span className="font-bold text-gray-900 text-sm leading-tight">
              {circle.name}
            </span>
            {circle.penName && circle.penName !== circle.name && (
              <span className="shrink-0 text-xs text-gray-400">
                / {circle.penName}
              </span>
            )}
          </div>

          {/* プロデュースアイドル + ユニットバッジ */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${unitColor}`}
            >
              {circle.produceIdol}
            </span>
            <span className="text-xs text-gray-400">
              {circle.unit}
            </span>
          </div>

          {/* Xリンク（常時表示） */}
          <div className="mt-1.5 flex items-center gap-2">
            {circle.links.twitter && (
              <a
                href={circle.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white hover:bg-gray-700"
              >
                𝕏 {circle.links.twitter.replace(/https?:\/\/(x|twitter)\.com\//, "@")}
              </a>
            )}
            {circle.links.pixiv && (
              <a
                href={circle.links.pixiv}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded bg-blue-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-600"
              >
                Pixiv
              </a>
            )}
            {circle.links.other && (
              <a
                href={circle.links.other}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded bg-gray-400 px-2 py-0.5 text-xs font-medium text-white hover:bg-gray-500"
              >
                HP
              </a>
            )}
          </div>

          {/* 展開時: サポートキャラ */}
          {expanded && circle.characters.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {circle.characters.slice(1).map((ch) => (
                <span
                  key={ch}
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                >
                  {ch}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
