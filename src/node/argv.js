import path from 'path'

export function argv (args) {
  const argv = args || process.argv.slice(2)
  const cmd = { files: [] }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '-h':
      case '--help':
        cmd.help = true
        break
      case '-v':
      case '--version':
        cmd.version = true
        break
      case '-t':
      case '--todo':
        cmd.todo = argv.shift()
        break
      default:
        cmd.files.push(path.resolve(process.cwd(), arg))
    }
  }
  return cmd
}
