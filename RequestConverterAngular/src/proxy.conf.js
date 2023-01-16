const PROXY_CONFIG = [
  {
    context: ['/api', '/upload'],
    target: "https://localhost:7182",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
