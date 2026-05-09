#!/usr/bin/env python3
"""从 *考点速记.md 合并 案例汇总.md：去案例块、引用块、口诀、考纲脚注、真题例题向内容。"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent


def strip_case_blocks(text: str) -> str:
    # colon form
    p1 = re.compile(
        r"(?:^|\n)\*\*案例（[^）]*）\*\*(?:（[^）]*）)*[：:].*?(?=\n#{1,6}\s|\n-{3,}\s*$|\Z)",
        re.DOTALL,
    )
    # no colon — title then table or bullets
    p2 = re.compile(
        r"(?:^|\n)\*\*案例(?:（[^）]*）)+\*\*[ \t]*\n(?:.*?\n)+?(?=\n#{1,6}\s|\n-{3,}\s*$|\Z)",
        re.DOTALL,
    )
    prev = None
    while prev != text:
        prev = text
        text = p1.sub("", text)
        text = p2.sub("", text)
    return text


def strip_koujue(text: str) -> str:
    text = re.sub(r"——口诀：\*?\*?[^\*）]+\*?\*?", "", text)
    text = re.sub(r"\*\*口诀\*\*[^\n]*\n?", "", text)
    text = re.sub(r"\*\*记忆口诀\*\*[^\n]*\n?", "", text)
    text = re.sub(r"\*\*范式口诀\*\*[^\n]*\n?", "", text)
    lines = []
    for line in text.split("\n"):
        if re.match(r"^[-*]\s*\*\*口诀\*\*", line.strip()):
            continue
        lines.append(line)
    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def strip_footnotes_kaogan(text: str) -> str:
    return re.sub(
        r"^\*案例表述依据《考纲/航空运营智能管理平台项目素材-核心\.md》[^\n]*\* *\n",
        "",
        text,
        flags=re.MULTILINE,
    )


def merge_sources() -> str:
    files = sorted(ROOT.glob("*-考点速记.md"))
    parts = [
        "# 案例汇总\n\n",
        "本文合并《案例》目录下各章节 **考点速记** 的知识点，已剔除项目案例叙事、谐音助记口诀、Markdown 引用块、考纲案例脚注及部分真题例题向表述。\n\n",
    ]
    for i, p in enumerate(files):
        if i:
            parts.append("---\n\n")
        raw = p.read_text(encoding="utf-8")
        raw = re.sub(r"\n\*文档由[^*]+\*[ \t]*$", "", raw, flags=re.MULTILINE)
        raw = "\n".join(ln for ln in raw.split("\n") if not ln.startswith(">"))
        raw = strip_case_blocks(raw)
        raw = strip_koujue(raw)
        lines = raw.split("\n")
        if lines and lines[0].startswith("#"):
            m = re.match(r"^#\s+(.+?)\s*·\s*考点速记.*$", lines[0].strip())
            lines[0] = "## " + (m.group(1).strip() if m else lines[0][2:].strip())
        parts.append("\n".join(lines).strip())
        parts.append("\n")
    text = "".join(parts)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return strip_footnotes_kaogan(text).strip() + "\n"


def heading_level(line: str):
    if line.startswith("#"):
        return len(line) - len(line.lstrip("#"))
    return None


def strip_exam_oriented(text: str) -> str:
    lines = text.splitlines()
    out = []
    i, n = 0, len(lines)

    def drop_section_predicate(title: str) -> bool:
        t = title.strip()
        keys = (
            "典型题思路（选词填空）",
            "典型例题思路（图书馆管理系统）",
            "典型例题要点",
            "异构数据库架构填空（工厂",
            "架构图填空（例题：基于 ESB",
            "典型例题：公钥体系 vs 口令认证",
        )
        return any(k in t for k in keys)

    while i < n:
        line = lines[i]
        hl = heading_level(line)

        if hl is not None and hl >= 2:
            title_part = line.lstrip("#").strip()
            if drop_section_predicate(title_part):
                start_level = hl
                i += 1
                while i < n:
                    h2 = heading_level(lines[i])
                    if h2 is not None and h2 <= start_level:
                        break
                    i += 1
                continue

        s = line.strip()

        if s.startswith("**填空答案"):
            i += 1
            while i < n:
                ln = lines[i]
                ts = ln.strip()
                if ts == "":
                    break
                if ln.startswith("#") or ts.startswith("---"):
                    break
                i += 1
            continue

        drops = (
            "**典型题**：",
            "**例题思路**：",
            "**填空技巧**：",
            "**注意**：官方答案",
            "**候选项**：",
            "**题1**：",
            "**题2**：",
        )
        if any(s.startswith(p) for p in drops):
            i += 1
            continue
        if re.match(r"^\*\*例题\*\*：", s):
            i += 1
            continue
        if "答案示例（" in s or "答案示例(" in s:
            i += 1
            continue
        if "- 例题答案示例：" in s:
            i += 1
            continue
        # SOA drill: lines like | （1） | **（c）业务层**
        if s.startswith("| （") and "**（" in s and "|" in s[4:]:
            # heuristic: diagram fill table rows in dropped section leftover
            pass
        if re.match(r"^\(\d+\)[a-z]?-", s):
            i += 1
            continue
        if re.match(r"^即：\(1\)", s):
            i += 1
            continue

        out.append(line)
        i += 1

    text = "\n".join(out)

    text = text.replace(
        "### 2.3 概念简答（真题要求 200 字内）",
        "### 2.3 边界类 · 实体类 · 控制类（概念要点）",
    )
    text = text.replace(
        "### 2.3 典型例题：解释器 vs 面向对象",
        "### 2.3 解释器架构 vs 面向对象架构（选型比较）",
    )
    text = text.replace(
        "### 3.2 效用树填空思路（例题）",
        "### 3.2 效用树与质量属性归类",
    )
    text = text.replace(
        "### 3.3 开闭原则简答（标准答法，约 150 字）",
        "### 3.3 开闭原则（要点）",
    )

    text = re.sub(r"^\*\*题目\*\*：[^\n]+\n+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\*\*题干\*\*：[^\n]+\n+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\*\*问\*\*：[^\n]+\n+", "", text, flags=re.MULTILINE)

    text = text.replace(
        "**可用性 vs 可靠性**：真题常把“故障后 N 秒内发现并启用备用”“主站断电后 N 秒内重定向”归为**可用性**；二者辨析少见，按题目默认可用性即可。",
        "**可用性 vs 可靠性**：若场景强调短时**切换备用 / 故障转移 / 重定向仍可访问**，多归为**可用性**；若强调**平均失效间隔**等度量，则更贴近**可靠性**语境。实务中两项常并列出现。",
    )

    text = text.replace(
        "- 看题干（a）～（k）等描述：**响应时间/吞吐**→性能；**故障恢复/重定向/备用**→可用性；**审计/日志/攻击检测/访问控制**→安全性；**规则可配置/界面可调/扩展人天**→可修改性。  ",
        "- 判别线索：**响应时间/吞吐**→性能；**故障恢复/重定向/备用**→可用性；**审计/日志/攻击检测/访问控制**→安全性；**规则可配置/界面可调/扩展人天**→可修改性。  ",
    )

    text = text.replace(
        "**可用性简答模板**（24 年案例）：",
        "**可用性六要素示例**（模板）：",
    )

    text = text.replace(
        "- **架构图填空**（如 23 年 11 月案例）：常涉及**持久化对象/实体**、**Session / SessionFactory**、**持久化层/数据访问层**等，按题干图填空即可。",
        "- Hibernate 结构中常见**持久化对象/实体**、**Session / SessionFactory**、**持久化层/数据访问层**等。",
    )

    chunks = text.split("\n")
    rebuilt = []
    j, m = 0, len(chunks)
    while j < m:
        ln = chunks[j]
        if ln.startswith("### 5.4 异构数据库架构填空"):
            level = heading_level(ln)
            j += 1
            while j < m:
                h = heading_level(chunks[j])
                if h is not None and h <= level:
                    break
                j += 1
            continue
        rebuilt.append(ln)
        j += 1
    text = "\n".join(rebuilt)

    text = re.sub(
        r"题干给出层次图，从（a）～（j）选填（1）～（6）。\*\*典型对应\*\*：\n\n(?:\|.+\|\n)+\*\*答案\*\*[^\n]+\n",
        "",
        text,
        flags=re.MULTILINE,
    )

    subs = [
        (
            "| **题型** | 根据文字说明补全：状态图、顺序图、活动图等；选词填空、写错误理由 |",
            "| **题型** | 根据题干补全图示或说明，并辨析错误原因 |",
        ),
        ("| **提醒** | 数据存储被外部实体使用**必须经过加工**（案例曾考） |", "| **提醒** | 数据存储被外部实体使用**必须经过加工** |"),
        (
            "| **主要考法** | 需求建模**填空**为主 + 数据流图、状态转换图、数据字典、UML 图概念 |",
            "| **主要考法** | 需求建模与 DFD、状态转换、UML、数据字典等结合 |",
        ),
        (
            "| **考法** | 概念辨析、选词填空、场景归属质量属性、六要素描述、效用树填空、解释器 vs 面向对象比较 |",
            "| **考法** | 概念辨析、场景归属质量属性、六要素描述、效用树与解释器/面向对象对比 |",
        ),
        ("| **考法** | 概念简答、对比表填空、架构图填空（1）～（6） |", "| **考法** | 概念简答及各层协议、组件归属 |"),
        ("| **考法** | 概念对比、场景归类原则、架构图选词填空（技术→层次） |", "| **考法** | 概念对比、场景归类、技术栈与分层对应 |"),
        (
            "| **核心** | 架构设计原则、**批处理 vs 流处理**、**Lambda/Kappa/IOTA**、典型架构中各技术归属与填空 |",
            "| **核心** | 架构设计原则、**批处理 vs 流处理**、**Lambda/Kappa/IOTA**、典型架构与技术分层归属 |",
        ),
        (
            "| **考法** | 概念题、填空题；表现层 MVC/MVP/MVVM、中间层 DomainModel-Service-Control、数据访问层/DAO/ORM、物联网三层 |",
            "| **考法** | 概念题；表现层 MVC/MVP/MVVM、中间层 DomainModel-Service-Control、数据访问层/DAO/ORM、物联网三层 |",
        ),
        (
            "| **考法** | 概念简述、对比（弹性 vs 韧性、容器 vs 虚拟机、容器 vs 编排）；场景判断架构模式；填空/简答 |",
            "| **考法** | 概念简述、对比（弹性 vs 韧性、容器 vs 虚拟机、容器 vs 编排）；场景判断架构模式 |",
        ),
        ("| **考法** | 概念填空、子域分类、限界上下文划分、实体/聚合/领域服务/防腐层等辨析 |", "| **考法** | 概念辨析：子域、限界上下文、实体/聚合/领域服务/防腐层等 |"),
        ("| **考点二** | **面向对象设计原则**：概念题形态，需背诵（架构案例尚未考，系分常考） |", "| **考点二** | **面向对象设计原则**：概念理解与记忆 |"),
        ("| **考点一** | **类识别**：给定场景判断边界类、控制类、实体类（架构考得少，系分考得多） |", "| **考点一** | **类识别**：场景中判断边界类、控制类、实体类 |"),
    ]
    for old, new in subs:
        text = text.replace(old, new)

    text = text.replace(
        "6. **架构图填空**：业务层、UDDI、publish、ESB、安全验证与质量管理、组件层。\n",
        "",
    )
    text = re.sub(r"^\d+\.\s+\*\*奥运填空\*\*：[^\n]+\n", "", text, flags=re.MULTILINE)

    text = text.replace(
        "**考法**：给出某种架构，要求分析脆弱性或安全风险，可从表中对应条目展开。",
        "**说明**：给定架构并要求分析脆弱性或安全风险时，可从表中对应条目展开。",
    )

    # 「题干常给出」「典型答案」列表（ Hibernate 填空段已删小节后的残留）
    text = re.sub(
        r"题干常给出：表示层 → 业务逻辑层 → 数据访问层（多数据库）。[^\n]+\n+\*\*典型答案\*\*\n(?:- \*\*[（（]\d+[）)]\*\*[^\n]+\n)+(?:\*\*易错[^\n]+\n[^\n]+\n)?",
        "",
        text,
        flags=re.MULTILINE,
    )

    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.rstrip() + "\n"


def main():
    body = merge_sources()
    body = strip_exam_oriented(body)
    out = ROOT / "案例汇总.md"
    out.write_text(body, encoding="utf-8")
    print(f"Wrote {out} ({len(body.splitlines())} lines)")


if __name__ == "__main__":
    main()
