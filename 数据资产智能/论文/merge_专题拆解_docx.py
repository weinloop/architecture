#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将专题拆解-1 … 专题拆解-12 合并为一个 docx（专题间分页）。"""

import re
import subprocess
import sys
from pathlib import Path

from md_to_docx_compact import postprocess_docx

ROOT = Path(__file__).resolve().parent
OUT_DOCX = ROOT / "专题拆解-合并.docx"
MERGED_MD = ROOT / ".专题拆解-合并.tmp.md"


# pandoc docx：OpenXML raw 分页
PAGE_BREAK_RAW = """

```{=openxml}
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:br w:type="page"/></w:r></w:p>
```

"""


def list_zhuanti_files() -> list[Path]:
    files = list(ROOT.glob("专题拆解-*.md"))
    files = [p for p in files if not p.name.startswith(".专题拆解")]

    def sort_key(p: Path) -> int:
        m = re.match(r"专题拆解-(\d+)-", p.name)
        return int(m.group(1)) if m else 999

    return sorted(files, key=sort_key)


def merge_markdown(paths: list[Path]) -> str:
    parts: list[str] = [
        "---\n",
        "title: 论文专题拆解（合并）\n",
        "lang: zh-CN\n",
        "---\n\n",
    ]
    for i, p in enumerate(paths):
        if i > 0:
            parts.append(PAGE_BREAK_RAW)
        text = p.read_text(encoding="utf-8").strip()
        parts.append(text)
        parts.append("\n")
    return "".join(parts).rstrip() + "\n"


def main() -> int:
    paths = list_zhuanti_files()
    if len(paths) != 12:
        print(f"预期 12 个专题 md，实际 {len(paths)}", file=sys.stderr)
        print(paths, file=sys.stderr)
        return 1

    MERGED_MD.write_text(merge_markdown(paths), encoding="utf-8")
    subprocess.run(
        [
            "pandoc",
            "-f",
            "markdown-yaml_metadata_block+pipe_tables+grid_tables+fenced_divs",
            "-t",
            "docx",
            "--standalone",
            "--wrap=none",
            "-o",
            str(OUT_DOCX),
            str(MERGED_MD),
        ],
        check=True,
    )
    postprocess_docx(OUT_DOCX)
    MERGED_MD.unlink(missing_ok=True)
    print(OUT_DOCX)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
