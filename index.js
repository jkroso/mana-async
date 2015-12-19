import {Component,STATE,JSX} from 'mana'
import {coerce} from 'result'
import assert from 'assert'

export default class Async extends Component {
  constructor(params, children) {
    params.promise = coerce(params.promise)
    super(params, children)
    this.previousNode = undefined
    this[STATE] = params.promise.state
    if (this.state == 'pending')
      params.promise.listen(() => this.state = 'done',
                            () => this.state = 'fail')
  }
  update(next, dom) {
    next.previousNode = this.node
    delete next.previousNode.events.mount
    return super.update(next, dom)
  }
  render(params) {
    const fn = params[this.state] || defaults[this.state]
    assert(typeof fn == 'function')
    return fn(this.state != 'pending' ? params.promise.value : this)
  }
}

const defaults = {
  fail(error) {
    return error instanceof Error
      ? <span class="error-message">{error.message}</span>
      : <span class="error-symbol">∅</span>
  },
  pending(self) {
    return self.previousNode
  }
}
