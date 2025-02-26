#!/bin/bash
find app -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "@/" > files_to_fix.txt
