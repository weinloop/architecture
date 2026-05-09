#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Align ### / #### numbering with parent ## 一、## 二、… within each file."""

import re
from pathlib import Path
from typing import Optional

H2 = re.compile(r"^## ([一二三四五六七八九十百千]+)、(.*)$")
H3 = re.compile(r"^### (\d+)\.(\d+)\s+(.*)$")
H4 = re.compile(r"^#### (\d+)\.(\d+)\.(\d+)\s+(.*)$")

ROOT = Path(__file__).resolve().parent
TARGETS = [ROOT / "101综合知识汇总.md", ROOT / "101案例汇总.md"]


def cn_ord_to_int(ord_cn: str) -> int:
    d = "一二三四五六七八九"
    if ord_cn == "十":
        return 10
    if len(ord_cn) == 1:
        return d.index(ord_cn) + 1
    if ord_cn.startswith("十"):
        return 10 + d.index(ord_cn[1]) + 1
    if "十" in ord_cn:
        left, _, right = ord_cn.partition("十")
        tens = d.index(left) + 1 if left else 1
        if not right:
            return tens * 10
        return tens * 10 + d.index(right) + 1
    if "百" in ord_cn:
        head, _, tail = ord_cn.partition("百")
        hundreds = d.index(head) + 1 if head else 1
        if not tail:
            return hundreds * 100
        return hundreds * 100 + cn_ord_to_int(tail)
    raise ValueError(f"unsupported ordinal: {ord_cn!r}")


def renumber(text: str) -> str:
    lines = text.split("\n")
    out: list[str] = []
    h2: Optional[int] = None
    h3_i = 0
    h4_i = 0

    for line in lines:
        m2 = H2.match(line)
        if m2:
            h2 = cn_ord_to_int(m2.group(1))
            h3_i = 0
            h4_i = 0
            out.append(line)
            continue

        m3 = H3.match(line)
        if m3:
            if h2 is None:
                out.append(line)
                continue
            h3_i += 1
            h4_i = 0
            out.append(f"### {h2}.{h3_i} {m3.group(3)}")
            continue

        m4 = H4.match(line)
        if m4:
            if h2 is None or h3_i == 0:
                out.append(line)
                continue
            h4_i += 1
            out.append(f"#### {h2}.{h3_i}.{h4_i} {m4.group(4)}")
            continue

        if line.startswith("#### ") and h2 is not None and h3_i > 0 and not H4.match(line):
            h4_i += 1
            title = line[5:].strip()
            out.append(f"#### {h2}.{h3_i}.{h4_i} {title}")
            continue

        if line.startswith("### ") and h2 is not None and not H3.match(line):
            h3_i += 1
            h4_i = 0
            title = line[4:].strip()
            out.append(f"### {h2}.{h3_i} {title}")
            continue

        out.append(line)

    return "\n".join(out)


def main() -> None:
    for path in TARGETS:
        raw = path.read_text(encoding="utf-8")
        path.write_text(renumber(raw).rstrip() + "\n", encoding="utf-8")
        print(path.name, "OK")


if __name__ == "__main__":
    main()
