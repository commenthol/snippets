const request = require('supertest')
const { start: dockerStart } = require('./docker.js')

describe('node/testing/docker', function () {
  let docker
  before(async function () {
    this.timeout(20000)
    docker = await dockerStart({
      image: 'nginx:alpine',
      containerName: 'nginx_test',
      match: /ready for start up/,
      args: ['-p', '8080:80']
    })
  })
  after(async function () {
    this.timeout(20000)
    await docker.stop()
  })

  it('image shall run', function () {
    return request('http://localhost:8080')
      .get('/')
      .expect(200)
      .expect(/Welcome to nginx!/)
  })
})
