<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) Rules for AI Agent

## Mandatory Directive: Always Use RTK for Command Execution
Whenever executing shell commands (via terminal, `run_command`, etc.), ALWAYS prefix the command with `rtk` (or `C:\Users\Akimkhan\rtk\rtk.exe` if not on PATH in subshell).

### Examples:
- **Git**: `rtk git status`, `rtk git diff`, `rtk git log`, `rtk git commit`
- **Build / Lint**: `rtk npx vite build`, `rtk tsc`, `rtk npm run lint`
- **Package Manager**: `rtk npm install`, `rtk pnpm install`
- **File & Search Filtering**: `rtk ls`, `rtk read <file>`, `rtk grep <pattern>`
- **Errors / Diagnostics**: `rtk err <cmd>`, `rtk summary <cmd>`

RTK compresses noise and optimizes output tokens by 60–90%.
If a command is not explicitly filtered by RTK, RTK safely passes output through.
