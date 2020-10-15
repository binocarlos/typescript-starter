import tape from 'tape'

const asyncTest = (name, handler) => {
  tape(name, async (t) => {
    try {
      await handler(t)
    } catch(err) {
      t.fail(err)
      console.log(err.stack)
    }
    t.end()
  })
}

export default asyncTest