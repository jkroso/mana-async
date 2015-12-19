# mana-async

It provides branching on promise state and automatically transitions between states. The 3 possible states are:

  - `done`
  - `fail`
  - `pending`

## Installation

`npm install mana-async`

then in your app:

```js
import Async from 'mana-async'

<Async promise={http`/api/dump`}
       pending={self => self.previousNode}
       fail={error => <span class="error-message">{error.message}</span>}
       done={value => <pre>{JSON.stringify(value)}</pre>}/>
```

The functions used in this example for the "fail" and "pending" states are identical to the defaults so if you are happy with their output you can leave those parameters undefined.
