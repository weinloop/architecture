#!/usr/bin/env python3
"""Strip 真题/例题-oriented blocks from 案例汇总.md."""
from pathlib import Path
import re

path = Path(__file__).resolve().parent / "案例汇总.md"
lines = path.read_text(encoding="utf-8").splitlines()
out = []
i, n = 0, len(lines)


def heading_level(line: str):
    if line.startswith("#"):
        return len(line) - len(line.lstrip("#"))
    return None


def should_drop_section(title_text: str) -> bool:
    t = title_text.strip()
    patterns = (
        "典型题思路（选词填空）",
        "典型例题思路（图书馆管理系统）",
        "典型例题要点",
        "异构数据库架构填空（工厂",
        "架构图填空（例题：基于 ESB",
        "典型例题：公钥体系 vs 口令认证",
    )
    return any(p in t for p in patterns)


while i < n:
    line = lines[i]
    hl = heading_level(line)

    # Drop whole markdown sections starting at certain headings
    if hl is not None and hl >= 2:
        title_part = line.lstrip("#").strip()
        if should_drop_section(title_part):
            start_level = hl
            i += 1
            while i < n:
                h2 = heading_level(lines[i])
                if h2 is not None and h2 <= start_level:
                    break
                i += 1
            continue

    s = line.strip()

    # Remove 填空 answers block header + following answer lines until blank or ---
    if s.startswith("**填空答案"):
        i += 1
        while i < n:
            ln = lines[i]
            if ln.strip() == "" or ln.strip().startswith("---"):
                break
            if ln.startswith("#"):
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
    if s.startswith("(1)") and "Spark" in s and "真题" not in path.name:
        # olympic mnemonic line (1)d-Spark ...
        i += 1
        continue
    if re.match(r"^即：\(1\)d ", s):
        i += 1
        continue
    if "- 例题答案示例：" in s:
        i += 1
        continue
    if line.strip() == "**答**":
        # skip lone **答** before multi-line answers in removed sections — may break 开闭
        next_line = lines[i + 1] if i + 1 < n else ""
        if next_line.startswith("- **") or next_line.startswith("|"):
            pass
        elif next_line.startswith("面向对象"):  # 开闭 OCP answer starts with **
            pass
        else:
            pass
    # **答** marker before OCP paragraph - keep

    out.append(line)
    i += 1

text = "\n".join(out)

# Renames / inline edits
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

text = re.sub(r"^\*\*题目\*\*：[^\n]+\n\n?", "", text, flags=re.MULTILINE)
text = re.sub(r"^\*\*题干\*\*：[^\n]+\n\n?", "", text, flags=re.MULTILINE)
text = re.sub(r"^\*\*问\*\*：[^\n]+\n\n?", "", text, flags=re.MULTILINE)

text = text.replace(
    "**可用性 vs 可靠性**：真题常把“故障后 N 秒内发现并启用备用”“主站断电后 N 秒内重定向”归为**可用性**；二者辨析少见，按题目默认可用性即可。",
    "**可用性 vs 可靠性**：若场景强调短时**切换备用 / 故障转移 / 重定向仍可访问**，多归为**可用性**；若强调**平均失效间隔、持续运行时长**等，则更贴近**可靠性**表述。实务中两项常并列出现。",
)

# 效用树 bullet: neutral wording
text = text.replace(
    "- 看题干（a）～（k）等描述：**响应时间/吞吐**→性能；**故障恢复/重定向/备用**→可用性；**审计/日志/攻击检测/访问控制**→安全性；**规则可配置/界面可调/扩展人天**→可修改性。  \n",
    "- 判别线索：**响应时间/吞吐**→性能；**故障恢复/重定向/备用**→可用性；**审计/日志/攻击检测/访问控制**→安全性；**规则可配置/界面可调/扩展人天**→可修改性。  \n",
)

text = text.replace(
    "**可用性简答模板**（24 年案例）：",
    "**可用性六要素示例**（模板）：",
)

# Hibernate bullet: drop exam filler
text = text.replace(
    "- **架构图填空**（如 23 年 11 月案例）：常涉及**持久化对象/实体**、**Session / SessionFactory**、**持久化层/数据访问层**等，按题干图填空即可。\n",
    "- Hibernate 结构中常出现**持久化对象/实体**、**Session / SessionFactory**、**持久化层/数据访问层**等。\n",
)

# === whole ### 5.4 异构 ... section — use second pass strip
parts = []
remain = text.split("\n")
j, m = 0, len(remain)
while j < m:
    ln = remain[j]
    if ln.startswith("### 5.4 异构数据库架构填空"):
        level = heading_level(ln)
        j += 1
        while j < m:
            h = heading_level(remain[j])
            if h is not None and h <= level:
                break
            j += 1
        continue
    parts.append(ln)
    j += 1
text = "\n".join(parts)

# Table / cell cleanups (考法 rows)
subs = [
    "| **题型** | 根据文字说明补全：状态图、顺序图、活动图等；选词填空、写错误理由 |",
    "| **题型** | 根据文字说明补全图示与描述；要求写错误或理由时请结合平衡原则作答 |",
    "| **提醒** | 数据存储被外部实体使用**必须经过加工**（案例曾考） |",
    "| **提醒** | 数据存储被外部实体使用**必须经过加工** |",
    "| **主要考法** | 需求建模**填空**为主 + 数据流图、状态转换图、数据字典、UML 图概念 |",
    "| **主要考法** | 需求建模与图示（DFD、状态转换、UML 等）结合数据字典等概念 |",
    "| **考法** | 概念辨析、选词填空、场景归属质量属性、六要素描述、效用树填空、解释器 vs 面向对象比较 |",
    "| **考法** | 概念辨析、场景归属质量属性、六要素描述、效用树与解释器/面向对象比较 |",
    "| **考法** | 概念简答、对比表填空、架构图填空（1）～（6） |",
    "| **考法** | 概念简答；SOA 参考架构各部分与协议对比 |",
    "| **章节** | 上篇 - 大数据架构（次重点 ★★★☆☆） |\n|| **核心** | 架构设计原则、**批处理 vs 流处理**、**Lambda/Kappa/IOTA**、典型架构中各技术归属与填空 |",
    "| **章节** | 上篇 - 大数据架构（次重点 ★★★☆☆） |\n|| **核心** | 架构设计原则、**批处理 vs 流处理**、**Lambda/Kappa/IOTA**、典型架构与各技术分层归属 |",
    "| **考法** | 概念对比、场景归类原则、架构图选词填空（技术→层次） |",
    "| **考法** | 概念对比、场景归类原则、技术栈与分层对应 |",
    "| **考法** | 概念题、填空题；表现层 MVC/MVP/MVVM、中间层 DomainModel-Service-Control、数据访问层/DAO/ORM、物联网三层 |",
    "| **考法** | 概念题；表现层 MVC/MVP/MVVM、中间层 DomainModel-Service-Control、数据访问层/DAO/ORM、物联网三层 |",
    "| **考法** | 概念简述、对比（弹性 vs 韧性、容器 vs 虚拟机、容器 vs 编排）；场景判断架构模式；填空/简答 |",
    "| **考法** | 概念简述、对比（弹性 vs 韧性、容器 vs 虚拟机、容器 vs 编排）；场景判断架构模式 |",
    "| **考法** | 概念填空、子域分类、限界上下文划分、实体/聚合/领域服务/防腐层等辨析 |",
    "| **考法** | 概念辨析、子域分类、限界上下文划分、实体/聚合/领域服务/防腐层等 |",
    "| **考点二** | **面向对象设计原则**：概念题形态，需背诵（架构案例尚未考，系分常考） |",
    "| **考点二** | **面向对象设计原则**：概念理解与背诵 |",
    "| **考点一** | **类识别**：给定场景判断边界类、控制类、实体类（架构考得少，系分考得多） |",
    "| **考点一** | **类识别**：场景中判断边界类、控制类、实体类 |",
]
for old, new in subs:
    text = text.replace(old, new)

# Speed-dictionary lines with exam cram
text = text.replace(
    "6. **架构图填空**：业务层、UDDI、publish、ESB、安全验证与质量管理、组件层。\n",
    "",
)
text = re.sub(r"^\d+\.\s+\*\*奥运填空\*\*：[^\n]+\n", "", text, flags=re.MULTILINE)

# 「考法**：给出某种架构—— keep or neutral
text = text.replace(
    "**考法**：给出某种架构，要求分析脆弱性或安全风险，可从表中对应条目展开。",
    "**说明**：给出某种架构场景时分析脆弱性或安全风险，可从表中对应条目展开。",
)

# Remove **答案** standalone lines blocks for SOA/EAB that point to （1）c — already removed section 4.4

# Compress multiple blank lines
text = re.sub(r"\n{3,}", "\n\n", text)

path.write_text(text.strip() + "\n", encoding="utf-8")
print("Done:", path)
