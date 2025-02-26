#!/usr/bin/env python3
import os
import re
from pathlib import Path


def fix_imports(file_path):
    """Convert relative imports back to @/ pattern"""
    with open(file_path, "r") as f:
        content = f.read()

    # Find all relative imports (../ or ./)
    pattern = r'from\s+[\'"](\.\./)+([^\'"]+)[\'"]|from\s+[\'"]\./([^\'"]+)[\'"]|import\s+[\'"](\.\./)+([^\'"]+)[\'"]|import\s+[\'"]\./([^\'"]+)[\'"]'

    def replace_import(match):
        # Determine which group matched
        if match.group(2):  # from "../path"
            return f'from "@/{match.group(2)}"'
        elif match.group(3):  # from "./path"
            return f'from "@/{match.group(3)}"'
        elif match.group(5):  # import "../path"
            return f'import "@/{match.group(5)}"'
        elif match.group(6):  # import "./path"
            return f'import "@/{match.group(6)}"'
        return match.group(0)  # No change if no match

    # Replace all relative imports with @/ pattern
    new_content = re.sub(pattern, replace_import, content)

    # Write the modified content back to the file
    with open(file_path, "w") as f:
        f.write(new_content)

    return content != new_content  # Return True if changes were made


def main():
    # Find all TypeScript and TypeScript React files
    root_dir = "app"
    files_changed = 0

    for ext in [".ts", ".tsx"]:
        for file_path in Path(root_dir).rglob(f"*{ext}"):
            file_path_str = str(file_path)
            with open(file_path_str, "r") as f:
                content = f.read()

            # Check if the file contains relative imports
            if re.search(r'from\s+[\'"]\.\.?/|import\s+[\'"]\.\.?/', content):
                print(f"Converting imports in {file_path_str}")
                if fix_imports(file_path_str):
                    files_changed += 1

    print(f"Converted imports in {files_changed} files.")


if __name__ == "__main__":
    main()
