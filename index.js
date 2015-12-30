import {Component,Thunk,STATE,JSX} from 'mana'
import spinner from 'mana-spinner'
import {style} from 'easy-style'
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
    return super.update(next, dom)
  }
  render(params) {
    const fn = params[this.state] || defaults[this.state]
    assert(typeof fn == 'function')
    return fn(this.state != 'pending' ? params.promise.value : this)
  }
}

const errorClass = style({
  color: 'red'
})

/**
 * Default rendering functions
 */

const defaults = {
  fail(error) {
    return error instanceof Error
      ? <span class={errorClass}>{error.message}</span>
      : <span class={errorClass}>{error}</span>
  },
  pending(self) {
    return self.previousNode && self.previousNode != spinner
      ? new Overlay(self.previousNode)
      : spinner
  }
}

const overlayClass = style({
  background: 'rgba(255,255,255,0.8)',
  position: 'absolute',
  zIndex: 999
})

/**
 * Overlays a semi-transparent cover over a node with a spinner in
 * the center
 */

class Overlay extends Thunk {
  onMount(dom) {
    const box = dom.getBoundingClientRect()
    const style = {
      height: box.height + 'px',
      width: box.width + 'px',
      left: box.left + 'px',
      top: box.top + 'px'
    }
    dom.overlay = <div class={overlayClass} style>{spinner}</div>
    dom.overlayDOM = dom.overlay.mountIn(document.body)
  }
  onUnMount(dom) {
    dom.overlay.remove(dom.overlayDOM)
  }
  render(previousNode) { return previousNode }
}
