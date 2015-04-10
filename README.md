## Stargaze

Watch a GitHub repo's star count, with change notifications on your desktop via
 [node-notifier](https://github.com/mikaelbr/node-notifier).

![Example Stargaze notification using a Windows taskbar balloon](https://github.com/insin/stargaze/raw/master/example.png)

### Command-Line Usage

Install globally for command-line usage:

```
npm install -g stargaze
```
```
$ stargaze -h
Usage: stargaze [options] github_repo

Options:
  -d, --delay   Delay between requests (s < 1000 or ms >= 1000) [default: 60]
  -u, --user    GitHub username
  -p, --pass    GitHub password
  -q, --quiet   Suppress all non-error output
  -v, --verbose Verbose output (shows rate limit info)
  -h, --help    Show this help

Unauthenticated requests have a very low rate limit
```
```
$ stargaze -v facebook/react
[2015-04-10T10:29:37.249Z] Requesting stars for facebook/react
[2015-04-10T10:29:37.736Z] 20019
[2015-04-10T10:29:37.738Z] x-ratelimit-limit: 60
[2015-04-10T10:29:37.741Z] x-ratelimit-remaining: 54
[2015-04-10T10:29:37.744Z] x-ratelimit-reset: 1428664607
```

### API Usage

Using the stargaze API allows you to pass a callback which gets called every
time the number of stars changes.

```
npm install stargaze
```
```javascript
var stargaze = require('stargaze')

stargaze('facebook/react', {verbose: true}, function(stars) {
  console.log('starz ' + stars)
  if (stars % 1000 === 0) {
    tweet('OMG Base 10! ' + stars)
  }
})
```

#### stargaze(repo[, options][, callback])

`repo` - a GitHub repo in `<owner>/<repo>` format.

`options` - an optional Object specifying additional options (see below)

`callback` - an optional callback function which will be called with the current
number of stars every time it changes.

The callback will **not** be called for the initial request.

##### Options

`auth` - an Object with `user` and `pass` properties, specifying GitHub
credentials to authenticate requests.

`timeout` - delay between requests to GitHub, in milliseconds; default: 60000.

`quiet` - if truthy, suppresses non-error console output.

`verbose` - if truthy, displays rate limit data in console output.

## MIT Licensed
