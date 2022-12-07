# Reactive Calculator

The reactive calculator helps you get realtime notifications about prayers times and prayer times related events. It doesn't need a date to be passed on to it when initialized as it will take the current date (now). once initialized you can get prayer times from it just like you would use the static calculator on top of that it provides you with observables that can help you get notified when events happens.

the reactive calculator also takes care of updating it's own internal config (date and calculations) so you always get real time up to date calculations and notifications. for that make sure to use the `init` function.

### init

The `init` function allows the reactive calculator to subscribe to time and be aware of date changes. once these subscribers gets notified of a change (a new day or a new qiyam time) they refresh the internal config and calculations of the calculator making provide realtime calculations.

these refreshers happ

```ts
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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

Invoking the `destroy` function will let the calculator unsubscribe from the subscriptions it invoked via the `init` function.

```ts
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.init() // initialize reactive calculations by subscribing to some observables
reactiveCalculator.destroy() // clean up subscriptions
```

::: danger
If you don't unsubscribe from an Observable, it will continue to run and use up memory, even after you are done with it. This can lead to memory leaks and can potentially cause your application to crash. It is important to unsubscribe from Observables when you are done with them to prevent memory leaks and ensure the smooth running of your application.
:::

### getCurrentPrayerTime

Based on the current time this method returns a [`TimeObject`]() containing the `name` of the current prayer and it's Adhan time as a `time` property. if the current time is passed `isha` time it will return `{ name: "none", time: null }`.

```ts
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
You can adjust how much time is given before each iqama in the `ReactiveCalculator` config object. refer to the [Config](../config.md) section to know more.
:::

### qiyamTimesObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for Qiyam times events (The middle of the night and the last third of the night).

```ts
import { Methods, ReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
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
