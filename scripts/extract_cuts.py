#!/usr/bin/env python3
"""PDFのサークルカットページから個別画像を切り出す"""

from PIL import Image
import os

# ページサイズ: 2386x1701
# 各ハーフに 2列×4行 = 8カット（標準グリッド）
# 左ハーフ: x=70〜1105, 右ハーフ: x=1280〜2315
# 上: y=55, 下: y=1645

# 標準グリッド座標（padding 8px で枠線を除去）
P = 8  # padding

def left_grid(nums):
    """左半分の2x4グリッド。numsは上から左→右の順で8要素"""
    positions = []
    for row in range(4):
        for col in range(2):
            idx = row * 2 + col
            if idx < len(nums) and nums[idx]:
                x1 = 70 + col * 518 + P
                y1 = 55 + row * 398 + P
                x2 = 70 + (col + 1) * 518 - P
                y2 = 55 + (row + 1) * 398 - P
                positions.append((nums[idx], (x1, y1, x2, y2)))
    return positions

def right_grid(nums):
    """右半分の2x4グリッド"""
    positions = []
    for row in range(4):
        for col in range(2):
            idx = row * 2 + col
            if idx < len(nums) and nums[idx]:
                x1 = 1280 + col * 518 + P
                y1 = 55 + row * 398 + P
                x2 = 1280 + (col + 1) * 518 - P
                y2 = 55 + (row + 1) * 398 - P
                positions.append((nums[idx], (x1, y1, x2, y2)))
    return positions

def splash_bottom_right(nums):
    """右半分：上にスプラッシュ、下半分に2x2グリッド（4カット）"""
    positions = []
    for row in range(2):
        for col in range(2):
            idx = row * 2 + col
            if idx < len(nums) and nums[idx]:
                x1 = 1280 + col * 518 + P
                y1 = 850 + row * 398 + P
                x2 = 1280 + (col + 1) * 518 - P
                y2 = 850 + (row + 1) * 398 - P
                positions.append((nums[idx], (x1, y1, x2, y2)))
    return positions

def splash_bottom_left(nums):
    """左半分：上にスプラッシュ、下半分に2x2グリッド"""
    positions = []
    for row in range(2):
        for col in range(2):
            idx = row * 2 + col
            if idx < len(nums) and nums[idx]:
                x1 = 70 + col * 518 + P
                y1 = 850 + row * 398 + P
                x2 = 70 + (col + 1) * 518 - P
                y2 = 850 + (row + 1) * 398 - P
                positions.append((nums[idx], (x1, y1, x2, y2)))
    return positions

def double_top_left(num):
    """左上に2セル結合（横長）"""
    return [(num, (70 + P, 55 + P, 1106 - P, 55 + 398 - P))]

def double_top_right(num):
    """右上に2セル結合（横長）"""
    return [(num, (1280 + P, 55 + P, 2316 - P, 55 + 398 - P))]

def double_second_left(num):
    """左2行目に2セル結合"""
    return [(num, (70 + P, 55 + 398 + P, 1106 - P, 55 + 798 - P))]

def double_bottom_left(num):
    """左下に2x2セル結合"""
    return [(num, (70 + P, 55 + 398*2 + P, 1106 - P, 1645 - P))]

def wide_third_left(num):
    """左3行目に2セル結合"""
    return [(num, (70 + P, 55 + 398*2 + P, 1106 - P, 55 + 398*3 - P))]

# ========== 全ページのカットマッピング ==========
# "アリーナ名-番号" の形式

PAGE_MAP = {}

# --- ARENA [ア] ---
# Page 1: left=cover, right=splash+ア01-04
PAGE_MAP[1] = splash_bottom_right(["ア-01", "ア-02", "ア-03", "ア-04"])

# Page 2: left=ア05-12, right=ア13-20
PAGE_MAP[2] = (
    left_grid(["ア-05", "ア-06", "ア-07", "ア-08", "ア-09", "ア-10", "ア-11", "ア-12"]) +
    right_grid(["ア-13", "ア-14", "ア-15", "ア-16", "ア-17", "ア-18", "ア-19", "ア-20"])
)

# Page 3: left=ア21-28, right=ア29(combo30)+31-36
PAGE_MAP[3] = (
    left_grid(["ア-21", "ア-22", "ア-23", "ア-24", "ア-25", "ア-26", "ア-27", "ア-28"]) +
    double_top_right("ア-29") +  # 29/30 combined
    right_grid([None, None, "ア-31", "ア-32", "ア-33", "ア-34", "ア-35", "ア-36"])
)

# Page 4: left=ア37-44, right=ア45-52
PAGE_MAP[4] = (
    left_grid(["ア-37", "ア-38", "ア-39", "ア-40", "ア-41", "ア-42", "ア-43", "ア-44"]) +
    right_grid(["ア-45", "ア-46", "ア-47", "ア-48", "ア-49", "ア-50", "ア-51", "ア-52"])
)

# Page 5: left=ア53-54+DJ, right=splash+イ01-04
PAGE_MAP[5] = (
    left_grid(["ア-53", "ア-54", None, None, None, None, None, None]) +
    splash_bottom_right(["イ-01", "イ-02", "イ-03", "イ-04"])
)

# --- ARENA [イ] ---
# Page 6: left=イ05-12, right=イ13-20
PAGE_MAP[6] = (
    left_grid(["イ-05", "イ-06", "イ-07", "イ-08", "イ-09", "イ-10", "イ-11", "イ-12"]) +
    right_grid(["イ-13", "イ-14", "イ-15", "イ-16", "イ-17", "イ-18", "イ-19", "イ-20"])
)

# Page 7: left=イ21-28, right=イ29-36
PAGE_MAP[7] = (
    left_grid(["イ-21", "イ-22", "イ-23", "イ-24", "イ-25", "イ-26", "イ-27", "イ-28"]) +
    right_grid(["イ-29", "イ-30", "イ-31", "イ-32", "イ-33", "イ-34", "イ-35", "イ-36"])
)

# --- ARENA [ウ] ---
# Page 8: left=splash+ウ01-04, right=ウ05-12
PAGE_MAP[8] = (
    splash_bottom_left(["ウ-01", "ウ-02", "ウ-03", "ウ-04"]) +
    right_grid(["ウ-05", "ウ-06", "ウ-07", "ウ-08", "ウ-09", "ウ-10", "ウ-11", "ウ-12"])
)

# Page 9: left=ウ13-20, right=ウ21-28
PAGE_MAP[9] = (
    left_grid(["ウ-13", "ウ-14", "ウ-15", "ウ-16", "ウ-17", "ウ-18", "ウ-19", "ウ-20"]) +
    right_grid(["ウ-21", "ウ-22", "ウ-23", "ウ-24", "ウ-25", "ウ-26", "ウ-27", "ウ-28"])
)

# Page 10: left=ウ29-36, right=splash+エ01-04
PAGE_MAP[10] = (
    left_grid(["ウ-29", "ウ-30", "ウ-31", "ウ-32", "ウ-33", "ウ-34", "ウ-35", "ウ-36"]) +
    splash_bottom_right(["エ-01", "エ-02", "エ-03", "エ-04"])
)

# --- ARENA [エ] ---
# Page 11: left=エ05-12, right=エ13-20
PAGE_MAP[11] = (
    left_grid(["エ-05", "エ-06", "エ-07", "エ-08", "エ-09", "エ-10", "エ-11", "エ-12"]) +
    right_grid(["エ-13", "エ-14", "エ-15", "エ-16", "エ-17", "エ-18", "エ-19", "エ-20"])
)

# Page 12: left=エ21-28, right=エ29-34 + 35/36 combined
PAGE_MAP[12] = (
    left_grid(["エ-21", "エ-22", "エ-23", "エ-24", "エ-25", "エ-26", "エ-27", "エ-28"]) +
    right_grid(["エ-29", "エ-30", "エ-31", "エ-32", "エ-33", "エ-34", None, None]) +
    [("エ-35", (1280 + P, 55 + 398*3 + P, 2316 - P, 1645 - P))]  # 35/36 combined
)

# --- ARENA [オ] ---
# Page 13: left=splash+オ01-04, right=オ05-12
PAGE_MAP[13] = (
    splash_bottom_left(["オ-01", "オ-02", "オ-03", "オ-04"]) +
    right_grid(["オ-05", "オ-06", "オ-07", "オ-08", "オ-09", "オ-10", "オ-11", "オ-12"])
)

# Page 14: left=オ13-20, right=オ21-28
PAGE_MAP[14] = (
    left_grid(["オ-13", "オ-14", "オ-15", "オ-16", "オ-17", "オ-18", "オ-19", "オ-20"]) +
    right_grid(["オ-21", "オ-22", "オ-23", "オ-24", "オ-25", "オ-26", "オ-27", "オ-28"])
)

# Page 15: left=オ29-32+logo, right=splash+カ01-04
PAGE_MAP[15] = (
    left_grid(["オ-29", "オ-30", "オ-31", "オ-32", None, None, None, None]) +
    splash_bottom_right(["カ-01", "カ-02", "カ-03", "カ-04"])
)

# --- ARENA [カ] ---
# Page 16: left=カ05-12, right=カ13-20
PAGE_MAP[16] = (
    left_grid(["カ-05", "カ-06", "カ-07", "カ-08", "カ-09", "カ-10", "カ-11", "カ-12"]) +
    right_grid(["カ-13", "カ-14", "カ-15", "カ-16", "カ-17", "カ-18", "カ-19", "カ-20"])
)

# Page 17: left=カ21-28, right=カ29-36
PAGE_MAP[17] = (
    left_grid(["カ-21", "カ-22", "カ-23", "カ-24", "カ-25", "カ-26", "カ-27", "カ-28"]) +
    right_grid(["カ-29", "カ-30", "カ-31", "カ-32", "カ-33", "カ-34", "カ-35", "カ-36"])
)

# --- ARENA [キ] ---
# Page 18: left=splash+キ01-04, right=キ05-12
PAGE_MAP[18] = (
    splash_bottom_left(["キ-01", "キ-02", "キ-03", "キ-04"]) +
    right_grid(["キ-05", "キ-06", "キ-07", "キ-08", "キ-09", "キ-10", "キ-11", "キ-12"])
)

# Page 19: left=キ13-20, right=キ21-28
PAGE_MAP[19] = (
    left_grid(["キ-13", "キ-14", "キ-15", "キ-16", "キ-17", "キ-18", "キ-19", "キ-20"]) +
    right_grid(["キ-21", "キ-22", "キ-23", "キ-24", "キ-25", "キ-26", "キ-27", "キ-28"])
)

# --- ARENA [ク] ---
# Page 20: left=splash + ク01/02(combined)+03-04, right=ク05-12
PAGE_MAP[20] = (
    splash_bottom_left(["ク-01", None, "ク-03", "ク-04"]) +  # 01/02 combined
    right_grid(["ク-05", "ク-06", "ク-07", "ク-08", "ク-09", "ク-10", "ク-11", "ク-12"])
)

# Page 21: left=ク13-20 (15/16 combined), right=ク21-28
PAGE_MAP[21] = (
    left_grid(["ク-13", "ク-14", None, None, "ク-17", "ク-18", "ク-19", "ク-20"]) +
    double_second_left("ク-15") +  # 15/16 combined
    right_grid(["ク-21", "ク-22", "ク-23", "ク-24", "ク-25", "ク-26", "ク-27", "ク-28"])
)

# --- ARENA [ケ] ---
# Page 22: left=splash+ケ01-04, right=ケ05-12
PAGE_MAP[22] = (
    splash_bottom_left(["ケ-01", "ケ-02", "ケ-03", "ケ-04"]) +
    right_grid(["ケ-05", "ケ-06", "ケ-07", "ケ-08", "ケ-09", "ケ-10", "ケ-11", "ケ-12"])
)

# Page 23: left=ケ13-20 (17/18 combined), right=ケ21-28
PAGE_MAP[23] = (
    left_grid(["ケ-13", "ケ-14", "ケ-15", "ケ-16", None, None, "ケ-19", "ケ-20"]) +
    wide_third_left("ケ-17") +  # 17/18 combined
    right_grid(["ケ-21", "ケ-22", "ケ-23", "ケ-24", "ケ-25", "ケ-26", "ケ-27", "ケ-28"])
)

# Page 24: left=ケ29/30(combined)+31-36, right=ケ37-40+企業
PAGE_MAP[24] = (
    double_top_left("ケ-29") +  # 29/30 combined
    left_grid([None, None, "ケ-31", "ケ-32", "ケ-33", "ケ-34", "ケ-35", "ケ-36"]) +
    right_grid(["ケ-37", "ケ-38", "ケ-39", "ケ-40", None, None, None, None])
)


def extract_all(pages_dir, output_dir, thumb_size=120):
    """全ページからサークルカットを切り出してサムネイル保存"""
    os.makedirs(output_dir, exist_ok=True)

    count = 0
    for page_num, cuts in PAGE_MAP.items():
        img_path = os.path.join(pages_dir, f"page_{page_num:02d}.png")
        if not os.path.exists(img_path):
            print(f"  SKIP: {img_path} not found")
            continue

        img = Image.open(img_path)

        for space_id, crop_box in cuts:
            # クロップ
            x1, y1, x2, y2 = crop_box
            # 境界チェック
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(img.width, x2)
            y2 = min(img.height, y2)

            cut = img.crop((x1, y1, x2, y2))

            # 正方形にリサイズ（最大辺に合わせてパディング）
            w, h = cut.size
            max_side = max(w, h)
            square = Image.new("RGB", (max_side, max_side), (255, 255, 255))
            square.paste(cut, ((max_side - w) // 2, (max_side - h) // 2))

            # サムネイルサイズにリサイズ
            thumb = square.resize((thumb_size, thumb_size), Image.LANCZOS)

            # ファイル名: ア-01.webp
            filename = f"{space_id}.webp"
            thumb.save(os.path.join(output_dir, filename), "WEBP", quality=75)
            count += 1

    print(f"Extracted {count} circle cut thumbnails")


if __name__ == "__main__":
    extract_all(
        pages_dir="/tmp/pdf_pages",
        output_dir="public/cuts",
        thumb_size=120,
    )
