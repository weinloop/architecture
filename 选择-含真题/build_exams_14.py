#!/usr/bin/env python3
"""《法律法规与标准化》PDF：前 3 小节直映射；第 4 小节按关键词分派。"""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CH = ROOT / "14-法律法规"

Q_HEAD = re.compile(r"\((\d{4})年(\d{1,2})月系统架构真题-第(\d+)题\)")
ANS_LINE = re.compile(r"^（正确答案）\s*(.+)\s*$", re.M)
SEC_LINE = re.compile(r"^第1章第(\d+)小节——(.+)$", re.M)
NOISE_LINE = re.compile(
    r"^("
    r"===== PAGE \d+ ====="
    r"|版权来源芝士架构.*"
    r"|第\s*\d+\s*页\s*"
    r"|系统架构设计师-法律法规与标准化-选择题"
    r"|第1章——法律法规与标准化"
    r"|目录\s*$"
    r")\s*$"
)

EXAM_HEADING = "## 系统架构设计师 · 真题汇编"

SEC_TO_FILE = {
    1: "02-保护期限与权利.md",
    2: "01-保护对象与范围.md",
    3: "03-职务作品与权属.md",
}


def clean_block(raw: str) -> str:
    lines_out: list[str] = []
    prev_empty = False
    for line in raw.splitlines():
        s = line.rstrip()
        if NOISE_LINE.match(s.strip()):
            continue
        empty = not s.strip()
        if empty:
            if not prev_empty:
                lines_out.append("")
            prev_empty = True
        else:
            lines_out.append(s)
            prev_empty = False
    return "\n".join(lines_out).strip()


def route_sec4(block: str) -> str:
    """第 4 小节——知识产权（专利、著作权、商业秘密、总论等）。"""
    c = clean_block(block)
    if re.search(
        r"专利许可|独占许可|排他实施许可|普通实施许可|权利要求书|"
        r"专利申请文件|专利法范畴|发明创造|实用新型|外观设计|"
        r"关于专利的说法",
        c,
    ):
        return "05-专利法要点.md"
    if re.search(
        r"合理使用|学习和研究.*软件|为了学习|条例第十七条|"
        r"告知著作人|不需要告知著作人",
        c,
    ):
        return "04-侵权判定与合理使用.md"
    if re.search(
        r"申请软著|源代码.*文档|鉴别材料|发表权|发行权|"
        r"软件著作权中",
        c,
    ):
        return "02-保护期限与权利.md"
    if re.search(
        r"商业秘密|知识产权.*客体|知识产权的地位|属于民法的范畴|"
        r"行政法的范畴|刑法的范畴|经济法的范畴",
        c,
    ):
        return "01-保护对象与范围.md"
    return "05-专利法要点.md"


def format_one_question(year: str, month: str, qn: str, raw_block: str) -> str:
    cleaned = clean_block(raw_block)
    m_ans = ANS_LINE.search(cleaned)
    if not m_ans:
        return f"### （{year}年{int(month)}月·第{qn}题）\n\n{cleaned}\n\n"

    answer = m_ans.group(1).strip()
    stem_and_options = cleaned[: m_ans.start()].strip()
    tail = cleaned[m_ans.end() :].lstrip()
    idx = tail.find("（解析）")
    parse_text = tail[idx + len("（解析）") :].lstrip() if idx != -1 else ""

    parts = [
        f"### （{year}年{int(month)}月·第{qn}题）",
        "",
        stem_and_options,
        "",
        f"**正确答案：** {answer}",
        "",
        "**解析**",
        "",
    ]
    if parse_text:
        parts.append(parse_text)
    parts.append("")
    return "\n".join(parts)


def section_starts(text: str):
    return [(m.start(), int(m.group(1)), m.group(2).strip()) for m in SEC_LINE.finditer(text)]


def section_for(pos: int, starts: list):
    cur = None
    for start, num, name in starts:
        if start <= pos:
            cur = (num, name)
        else:
            break
    return cur


def clear_generated(out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for p in out_dir.glob("*.exam.md"):
        p.unlink()


def merge_exam_into_cards() -> None:
    gen = CH / "_generated_exam"
    for exam_path in sorted(gen.glob("*.exam.md")):
        stem = exam_path.name.replace(".exam.md", ".md")
        card = CH / stem
        if not card.exists():
            print("skip missing", stem)
            continue
        fragment = exam_path.read_text(encoding="utf-8")
        main = card.read_text(encoding="utf-8")
        if EXAM_HEADING in main:
            pre, _ = main.split(EXAM_HEADING, 1)
            new_body = pre.rstrip() + "\n\n" + fragment.strip() + "\n"
        else:
            new_body = main.rstrip() + "\n\n" + fragment.strip() + "\n"
        card.write_text(new_body, encoding="utf-8")


def main():
    pdf_txt = CH / "_pdf_extract_法律法规与标准化.txt"
    if not pdf_txt.exists():
        print("missing", pdf_txt.name)
        return
    text = pdf_txt.read_text(encoding="utf-8")
    starts = section_starts(text)
    matches = list(Q_HEAD.finditer(text))
    by: dict[str, list[str]] = defaultdict(list)

    for i, m in enumerate(matches):
        pos = m.start()
        sec = section_for(pos, starts)
        if not sec:
            continue
        sec_num = sec[0]
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        raw = text[m.end() : end]
        y, mo, qn = m.group(1), m.group(2), m.group(3)
        mo_i = str(int(mo)) if mo.isdigit() else mo

        if sec_num == 4:
            fn = route_sec4(raw)
        else:
            fn = SEC_TO_FILE.get(sec_num)
        if not fn:
            continue
        by[fn].append(format_one_question(y, mo_i, qn, raw))

    header = (
        "## 系统架构设计师 · 真题汇编\n\n"
        "> 来源：[法律法规与标准化.pdf](../../选择真题-分类/法律法规与标准化.pdf)。**完整题干、选项、正确答案与解析**。\n\n"
    )
    clear_generated(CH / "_generated_exam")
    for fn, chunks in sorted(by.items()):
        (CH / "_generated_exam" / fn.replace(".md", ".exam.md")).write_text(
            header + "\n".join(chunks), encoding="utf-8"
        )
    n = sum(len(v) for v in by.values())
    print("法律法规与标准化", n, "题,", len(by), "个卡片")
    merge_exam_into_cards()


if __name__ == "__main__":
    main()
