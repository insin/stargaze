var notifier = require('node-notifier')
var request = require('request')

var RATELIMIT_RE = /^x-ratelimit/i

function stargaze(repo, options, callback) {
  if (!repo) {
    throw new Error('stargaze: a GitHub repo must be specified')
  }
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var timeout = options.timeout || 60000
  var lastStars = 0

  var gitHubOptions = {
    url: 'https://api.github.com/repos/' + repo,
    headers: {
      'User-Agent': 'request'
    }
  }
  if (options.auth) {
    gitHubOptions.auth = options.auth
  }

  function log(message) {
    if (!options.quiet) {
      console.log('[' + new Date().toISOString() + '] ' + message)
    }
  }

  function checkStars() {
    log('Requesting stars for ' + repo)
    request(gitHubOptions, handleResponse)
  }

  function handleResponse(err, res, body) {
    if (err) {
      console.error(err)
      notifier.notify({
        title: 'Stargaze Error',
        message: err.message
      })
      process.exit(1)
    }
    else if (res.statusCode !== 200) {
      console.error('HTTP ' + res.statusCode + ': ' + body)
      notifier.notify({
        title: 'Stargaze Error',
        message: 'Got an HTTP ' + res.statusCode + ' response'
      })
      process.exit(1)
    }
    else {
      setTimeout(checkStars, timeout)
    }

    var stars = JSON.parse(body).stargazers_count
    if (stars > lastStars) {
      notifier.notify({
        title: 'Stargaze',
        message: repo + ' has ' + stars + ' stars'
      })
      if (callback && lastStars !== 0) {
        callback(stars)
      }
      lastStars = stars
    }

    log(lastStars)

    if (options.verbose) {
      Object.keys(res.headers)
        .filter(function(h) { return RATELIMIT_RE.test(h) })
        .forEach(function(h) { log(h + ': ' + res.headers[h]) })
    }
  }

  checkStars()
}

module.exports = stargaze
