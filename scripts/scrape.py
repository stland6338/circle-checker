#!/usr/bin/env python3
"""SSF10 サークルリストをスクレイピングしてJSONに変換する"""

import json
import re
import sys
from html.parser import HTMLParser

# キャラクター画像ファイル名 → キャラ名マッピング
IMG_TO_CHARACTER = {
    "amana": "大崎甘奈",
    "asahi": "芹沢あさひ",
    "chiyuki": "桑山千雪",
    "choco": "園田智代子",
    "fuyuko": "黛冬優子",
    "hana": "鈴木羽那",
    "haruki": "郁田はるき",
    "hinana": "市川雛菜",
    "hiori": "風野灯織",
    "jyuri": "西城樹里",
    "kaho": "小宮果穂",
    "kiriko": "三峰結華",
    "kogane": "櫻木真乃",
    "koito": "福丸小糸",
    "madoka": "樋口円香",
    "mamimi": "田中摩美々",
    "mano": "八宮めぐる",
    "meguru": "有栖川夏葉",
    "mei": "斑鳩ルカ",
    "mikoto": "緋田美琴",
    "natuha": "有栖川夏葉",
    "nichika": "七草にちか",
    "rinze": "杜野凛世",
    "ruka": "七草はづき",
    "sakuya": "白瀬咲耶",
    "tenka": "大崎甜花",
    "tohru": "浅倉透",
    "yuika": "月岡恋鐘",
}

# プロデュースアイドル背景色 → ユニット名
IDOL_COLOR_TO_UNIT = {
    "#ff699e": "アルストロメリア",
    "#853998": "アンティーカ",
    "#fa8333": "放課後クライマックスガールズ",
    "#fff68d": "イルミネーションスターズ",
    "#384d98": "ノクチル",
    "#008e74": "シーズ",
    "#af011c": "ストレイライト",
    "#23120c": "コメティック",
    "#95caff": "シーズ",
}

# リンク種別の判定（devi.png = HOME/Pixiv系）
EXCLUDED_IMGS = {"contact", "x_aco", "x_acco", "online", "circle", "public", "home", "devi", "ssf_bn"}


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_tr = False
        self.in_td = False
        self.current_row = []
        self.current_cell = {"text": "", "bgcolor": "", "imgs": [], "links": []}
        self.rows = []
        self.td_count = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "table" and 'border' in attrs_dict:
            self.in_table = True
        elif self.in_table and tag == "tr":
            self.in_tr = True
            self.current_row = []
        elif self.in_tr and tag == "td":
            self.in_td = True
            self.current_cell = {
                "text": "",
                "bgcolor": attrs_dict.get("bgcolor", ""),
                "imgs": [],
                "links": [],
            }
        elif self.in_td and tag == "img":
            src = attrs_dict.get("src", "")
            m = re.search(r"img/(\w+)\.png", src)
            if m:
                self.current_cell["imgs"].append(m.group(1))
        elif self.in_td and tag == "a":
            href = attrs_dict.get("href", "")
            if href and href.startswith("http"):
                self.current_cell["links"].append(href)

    def handle_endtag(self, tag):
        if self.in_td and tag == "td":
            self.in_td = False
            self.current_row.append(self.current_cell)
        elif self.in_tr and tag == "tr":
            self.in_tr = False
            if self.current_row:
                self.rows.append(self.current_row)

    def handle_data(self, data):
        if self.in_td:
            self.current_cell["text"] += data.strip()


def parse_circles(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    parser = TableParser()
    parser.feed(html)

    circles = []
    circle_id = 0

    for row in parser.rows:
        if len(row) < 10:
            continue

        # ヘッダー行やセクション区切り行をスキップ
        first_bg = row[0].get("bgcolor", "")
        if first_bg == "#80a2fd":
            continue

        circle_name = row[0]["text"].strip()
        pen_name = row[1]["text"].strip()
        produce_idol = row[2]["text"].strip()
        produce_bg = row[2].get("bgcolor", "")

        if not circle_name and not pen_name:
            continue

        circle_id += 1

        # サポートキャラクター（col 3-6）+ ゲスト（col 7）
        support_chars = []
        for i in range(3, 8):
            if i < len(row):
                for img_name in row[i]["imgs"]:
                    if img_name not in EXCLUDED_IMGS and img_name in IMG_TO_CHARACTER:
                        support_chars.append(IMG_TO_CHARACTER[img_name])

        # 全キャラリスト: プロデュースアイドル + サポートキャラ
        characters = []
        if produce_idol:
            characters.append(produce_idol)
        for ch in support_chars:
            if ch not in characters:
                characters.append(ch)

        # ユニット
        unit = IDOL_COLOR_TO_UNIT.get(produce_bg, "")

        # リンク抽出
        links = {}
        # HOME列 (col 8)
        if len(row) > 8:
            for link in row[8]["links"]:
                if "pixiv" in link.lower():
                    links["pixiv"] = link
                else:
                    links["other"] = link
        # X列 (col 9)
        if len(row) > 9:
            for link in row[9]["links"]:
                if "x.com" in link or "twitter.com" in link:
                    links["twitter"] = link

        circle = {
            "id": circle_id,
            "name": circle_name,
            "penName": pen_name,
            "produceIdol": produce_idol,
            "unit": unit,
            "characters": characters,
            "links": links,
        }
        circles.append(circle)

    return circles


if __name__ == "__main__":
    html_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/ssf10.html"
    circles = parse_circles(html_path)
    print(json.dumps(circles, ensure_ascii=False, indent=2))
    print(f"\n// Total: {len(circles)} circles", file=sys.stderr)
