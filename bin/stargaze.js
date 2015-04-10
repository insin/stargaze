#!/usr/bin/env node

var parseArgs  = require('minimist')

var stargaze = require('../index')

var args = parseArgs(process.argv.slice(2), {
  alias: {
    d: 'delay',
    h: 'help',
    p: 'pass',
    q: 'quiet',
    u: 'user',
    v: 'verbose'
  },
  boolean: ['help', 'verbose'],
  default: {
    delay: 60
  }
})

if (args.help || args._.length === 0) {
  console.log('Usage: stargaze [options] github_repo')
  console.log('')
  console.log('Options:')
  console.log('  -d, --delay   Delay between requests (s < 1000 or ms >= 1000) [default: 60]')
  console.log('  -u, --user    GitHub username')
  console.log('  -p, --pass    GitHub password')
  console.log('  -q, --quiet   Suppress all non-error output')
  console.log('  -v, --verbose Verbose output (shows rate limit info)')
  console.log('  -h, --help    Show this help')
  console.log('')
  console.log('Unauthenticated requests have a very low rate limit')
  process.exit(0)
}
if (String(args._[0]).split('/').length !== 2) {
  console.error('GitHub repo name must be specified in <owner>/<repo> format.')
  process.exit(1)
}
if (typeof args.delay !== 'number') {
  console.error('Delay must be specified as a number.')
  process.exit(1)
}
if (!!args.user !== !!args.pass) {
  console.error('GitHub username and password must both be provided to authenticate requests.')
  process.exit(1)
}

var options = {
  timeout: args.delay < 1000 ? args.delay * 1000 : args.delay,
  quiet: args.quiet,
  verbose: args.verbose
}
if (args.user && args.pass) {
  options.auth = {
    user: args.user,
    pass: args.pass
  }
}

stargaze(args._[0], options)
