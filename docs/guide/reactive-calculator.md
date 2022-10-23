::: danger
The reactive calculator is a work in progress and the documentation here and the api is just a draft
:::

### init

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init() // initialize reactive calculations by subscribing to some observables
reactiveCalculator.destroy() // clean up subscriptions
```

::: warning
if the `init` function is not invoked the reactive calculator will remain reactive for a day only. invoking the init function will make sure to keep refreshing the calculations when needed.
:::

### destroy

Invoking the `destroy` function will let the calculator unsubscribe from the subscriptions it invoked via the `init` function and avoid memory leaks.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init() // initialize reactive calculations by subscribing to some observables
reactiveCalculator.destroy() // clean up subscriptions
```

### getCurrentPrayerTime

Based on the current time this method returns a [`TimeObject`]() containing the `name` of the current prayer and it's Adhan time as a `time` property. if the current time is passed `isha` time it will return `{ name: "none", time: null }`.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init()

reactiveCalculator.getCurrentPrayerTime() // will return: ""
```

### getNextPrayerTime

Based on the current time this method returns a [`TimeObject`]() of the next prayer. if the current prayer is `"isha"` the output will be `{ name: "none", time: null }`.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init()
reactiveCalculator.getNextPrayerTime() // will return: ""
```

### getAllPrayerTimes

This method returns a array of [`TimeObject`]() containing the prayer name and it's time. the time is a `Date` object.

::: info
Sunrise time object is included in the array
:::

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init()
reactiveCalculator.getAllPrayerTimes()
// will return:
/*
 * [
    {
      name: "fajr",
      time: 2022-01-31T22:07:00.000Z,
    },
    {
      name: "sunrise",
      time: 2022-01-31T23:27:00.000Z,
    },
    {
      name: "dhuhr"
      time: 2022-02-01T05:31:00.000Z,
    },
    {
      name: "asr"
      time: 2022-02-01T08:53:00.000Z,
    },
    {
      name: "maghrib"
      time: 2022-02-01T11:27:00.000Z,
    },
    {
      name: "isha"
      time: 2022-02-01T12:41:00.000Z
    }
  ]
 */
```

### adhanObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer times events (Adhan).

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init()

const subscription = reactiveCalculator.adhanObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} prayer entered`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup if you need to..
reactiveCalculator.destroy()
subscription.unsubscribe()
```

### iqamaObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Iqama times events.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init()

reactiveCalculator.iqamaObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} Iqama`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup if you need to..
reactiveCalculator.destroy()
subscription.unsubscribe()
```

::: tip
You can adjust how much time is given before each iqama in the `UseReactiveCalculator` config object. refer to the [Config](../config.md) section to know more.
:::

### qiyamTimesObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for Qiyam times events (The middle of the night and the last third of the night).

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.qiyamTimesObserver().subscribe({
  next(value: TimeEventObject) {
    if (value.name === TimesNames.MIDDLE_OF_THE_NIGHT) {
      // notify Abu bakr
    }

    if (value.name === TimesNames.LAST_THIRD_OF_THE_NIGHT) {
      // notify Umar
    }
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```
