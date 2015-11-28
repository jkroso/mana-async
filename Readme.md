# mana-result

It provides branching on result state and automatically transitions between states. The 3 possible states are:

  - `done`
  - `fail`
  - `pending`

## Installation

`npm install mana-result`

then in your app:

```js
import Result from 'mana-result'

<Result promise={http`/api/dump`}
        pending={() => new Spinner}
        done={({params}) => <pre>{JSON.stringify(params.promise.value)}</pre>}
        fail={() => <span>error</span>}/>
```
