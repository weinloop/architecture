#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Merge 101综合知识汇总.md + 101案例汇总.md → 知识点汇总.md with line-level dedupe."""

import re
from collections import OrderedDict
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent
FILES = ROOT / "101综合知识汇总.md", ROOT / "101案例汇总.md"
OUT = ROOT / "知识点汇总.md"

# 形如「## 二、」视为篇内小节；其余「## xxx」为大章起始
MAJOR = re.compile(r"^## (?![一二三四五六七八九十百千]+、)")
MIN_LINE_LEN = 22  # 仅对达到此长度的 stripped 行做去重键


def split_chapters(path: Path) -> OrderedDict[str, str]:
    lines = path.read_text(encoding="utf-8").split("\n")
    idx = [i for i, ln in enumerate(lines) if MAJOR.match(ln)]
    chapters: OrderedDict[str, str] = OrderedDict()
    for j, i in enumerate(idx):
        end = idx[j + 1] if j + 1 < len(idx) else len(lines)
        block = "\n".join(lines[i:end]).strip()
        title_ln = lines[i].strip("# ").strip()
        chapters[title_ln] = block
    return chapters


def norm_line(s: str) -> str:
    return " ".join(s.split())


def line_fingerprint_set(primary: str) -> set[str]:
    out = set()
    for ln in primary.split("\n"):
        stripped = ln.strip()
        k = norm_line(stripped)
        if len(k) >= MIN_LINE_LEN:
            out.add(k)
        # Markdown 表里短行也去重精确匹配
        if stripped.startswith("|") and len(stripped) > 12:
            out.add(norm_line(stripped))
    return out


def strip_leading_heading(block: str) -> str:
    ls = block.split("\n")
    if ls and ls[0].startswith("##"):
        return "\n".join(ls[1:]).strip()
    return block


def merge_blocks(
    primary: str,
    secondary: str,
    *,
    appendix_title: Optional[str] = "案例侧合并补充",
) -> str:
    """保留 primary 全文，将 secondary（去掉首部大章标题）中与 primary 中长行重复的句子剔除后再拼接。"""
    primary = primary.strip()
    secondary = secondary.strip()
    if not secondary:
        return primary
    if not primary:
        return secondary

    fingerprints = line_fingerprint_set(primary)
    sec_core = strip_leading_heading(secondary)
    kept: list[str] = []
    for ln in sec_core.split("\n"):
        stripped = ln.strip()
        k = norm_line(stripped)
        if stripped.startswith("|") and len(stripped) > 12:
            key = norm_line(stripped)
            if key in fingerprints:
                continue
            kept.append(ln)
            fingerprints.add(key)
            continue
        if len(k) >= MIN_LINE_LEN and k in fingerprints:
            continue
        kept.append(ln)
        if len(k) >= MIN_LINE_LEN:
            fingerprints.add(k)

    appendix = "\n".join(kept).strip()
    if not appendix:
        return primary

    if appendix_title:
        divider = f"\n\n---\n\n### （{appendix_title}）\n\n"
    else:
        divider = "\n\n---\n\n"
    return primary + divider + appendix


def main() -> None:
    comp, case = FILES
    chapters_c = split_chapters(comp)
    chapters_k = split_chapters(case)

    preamble = """# 知识点汇总

> 由原《101 综合知识汇总》与《101 案例汇总》按主题重组合并；已对较长相同表述做行级去重，两篇互补内容并排保留。\n"""

    parts: list[str] = [preamble]

    def pc(key: str) -> str:
        return chapters_c.get(key, "").strip()

    def pk(key: str) -> str:
        return chapters_k.get(key, "").strip()

    # 顺序：理论基础 → 需求/设计 → 层次与云/SOA → 架构与安全 → 工程保障 → 基础课 → 数据与中间件 → 前沿
    parts.append(pc("软件工程概述"))

    parts.append(
        merge_blocks(
            pc("需求工程"),
            pk("需求分析"),
            appendix_title="案例分析向补充",
        )
    )

    parts.append(
        merge_blocks(
            pc("系统设计"),
            pk("系统设计 / 面向对象设计"),
        )
    )

    parts.append(pk("层次结构"))

    parts.append(pk("云原生架构设计"))
    parts.append(pk("面向服务架构（SOA）"))

    parts.append(
        merge_blocks(pc("系统架构设计"), pk("系统架构设计"))
    )

    parts.append(
        merge_blocks(
            pc("信息安全"),
            pk("安全架构设计理论与实践"),
            appendix_title="案例分析向补充",
        )
    )

    for title in (
        "软件测试",
        "系统运行与维护",
        "系统可靠性",
        "项目管理",
        "计算机组成原理",
        "计算机网络",
        "操作系统",
    ):
        parts.append(pc(title))

    parts.append(
        merge_blocks(pc("数据库系统"), pk("数据库系统"))
    )

    for title in (
        "Redis",
        "Elasticsearch",
        "MongoDB",
    ):
        blk = pk(title)
        if blk:
            parts.append(blk)

    for title in (
        "大数据架构",
        "领域驱动设计（DDD）",
        "分布式系统",
    ):
        blk = pk(title)
        if blk:
            parts.append(blk)

    parts.append(pk("大模型应用"))
    parts.append(pc("法律法规"))

    body = "\n\n".join(p for p in parts if p.strip())
    OUT.write_text(body.strip() + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({body.count(chr(10)) + 1} lines)")


if __name__ == "__main__":
    main()
