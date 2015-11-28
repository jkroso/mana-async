import {Component,STATE} from 'mana'
import assert from 'assert'

export default class State extends Component {
  constructor(params, children) {
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
    const fn = params[this.state]
    assert(typeof fn == 'function')
    return fn(this.state != 'pending' ? params.promise.value : this)
  }
}
