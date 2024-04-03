import path from 'path'

export function argvSimple (args) {
  const argv = expand(args || process.argv.slice(2))
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
      case '-a':
        cmd.a = true
        break
      case '-b':
        cmd.b = true
        break
      case '-t':
      case '--todo':
        cmd.todo = nextArg(argv)
        break
      default:
        cmd.files.push(path.resolve(process.cwd(), arg))
    }
  }
  return cmd
}

export function argv (args, opts) {

}

function expand (argv) {
  const nArgv = []
  for (const arg of argv) {
    if (/^-[a-z]+$/.test(arg)) {
      const shortArgs = arg.slice(1).split('')
      for (const short of shortArgs) {
        nArgv.push(`-${short}`)
      }
    } else {
      nArgv.push(arg)
    }
  }
  return nArgv
}

function nextArg (argv, required = false) {
  const next = argv[0]
  if (typeof next !== 'string' || next.indexOf('-') === 0) {
    return required ? undefined : true
  }
  return argv.shift()
}
