#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path


def calculate_relative_path(from_file, to_path):
    """Calculate the relative path from from_file to to_path."""
    # Get the absolute path of the file
    from_file_abs = os.path.abspath(from_file)
    from_dir = os.path.dirname(from_file_abs)

    # Get the workspace root (current directory)
    workspace_root = os.getcwd()

    # The target path is relative to the workspace root
    target_path = os.path.join(workspace_root, to_path)

    # Calculate the relative path from the file's directory to the target path
    rel_path = os.path.relpath(target_path, from_dir)

    # Ensure the path starts with ./ or ../
    if not rel_path.startswith("./") and not rel_path.startswith("../"):
        rel_path = "./" + rel_path

    return rel_path


def fix_imports(file_path):
    """Fix @/ imports in the given file."""
    with open(file_path, "r") as f:
        content = f.read()

    # Find all @/ imports
    pattern = r'from\s+[\'"]@/([^\'"]+)[\'"]|import\s+[\'"]@/([^\'"]+)[\'"]'

    def replace_import(match):
        import_path = match.group(1) or match.group(2)
        rel_path = calculate_relative_path(file_path, import_path)

        if match.group(1):  # from "@/..." case
            return f'from "{rel_path}"'
        else:  # import "@/..." case
            return f'import "{rel_path}"'

    # Replace all @/ imports with relative paths
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

            # Check if the file contains @/ imports
            if re.search(r'from\s+[\'"]@/|import\s+[\'"]@/', content):
                print(f"Fixing imports in {file_path_str}")
                if fix_imports(file_path_str):
                    files_changed += 1

    print(f"Fixed imports in {files_changed} files.")


if __name__ == "__main__":
    main()
