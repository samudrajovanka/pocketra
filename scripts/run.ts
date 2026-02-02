import { spawn } from "bun"
import { existsSync } from "fs"
import { join } from "path"

const [, , pkg, script, ...args] = process.argv

if (!pkg || !script) {
  console.error("Usage: bun run run <package> <script>")
  process.exit(1)
}

const pkgDir = join(process.cwd(), "packages", pkg)
const pkgJson = join(pkgDir, "package.json")

if (!existsSync(pkgJson)) {
  console.error(`Package "${pkg}" not found`)
  process.exit(1)
}

const proc = spawn(
  ["bun", "run", script, "--", ...args],
  {
    cwd: pkgDir,
    stdio: ["inherit", "inherit", "inherit"]
  }
)

process.exit(await proc.exited)
