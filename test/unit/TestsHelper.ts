import { Prayers } from '../../src'

export const expectedMarbleGenerator = (prayerTimeEngine: Prayers, now: Date, testUntil: Date): string => {
  let expectedMarble = ''
  let index = 0
  if (testUntil.getTime() - now.getTime() <= 0) {
    throw new Error('Time range is negative or zero')
  }
  const prayerTimes = prayerTimeEngine.getAllPrayerTimes()
  Object.keys(prayerTimes).forEach((prayer, index) => {
    console.log(index, prayer, prayerTimes[prayer].toTimeString(), prayerTimes[prayer].toDateString())
  })
  const iqamaTimes = prayerTimeEngine.getCalculationOptions().iqama!
  Object.keys(prayerTimes).forEach((prayer) => {
    // calculate the prayer and iqama delay for each prayer
    let prayerDelay = prayerTimes[prayer].getTime() - now.getTime()
    if (prayerDelay > 0) {
      // move the time forward to prayer time
      now.setTime(now.getTime() + prayerDelay)
      // if this is not the first time
      // we reduce 1ms as the event before it consumes 1ms in time
      if (index !== 0) {
        prayerDelay--
      }
      expectedMarble = expectedMarble + `${prayerDelay}ms ${index} `
      index++
    }
    let iqamaDelay = 0
    if (prayer !== 'sunrise') {
      iqamaDelay = prayerTimes[prayer].getTime() + iqamaTimes[prayer] * 60000 - now.getTime()
      if (iqamaDelay > 0) {
        // move the time forward to iqama time
        now.setTime(now.getTime() + iqamaDelay)
        // reduce iqama delay by 1ms as the event itself will consume 1ms
        iqamaDelay--
        expectedMarble = expectedMarble + `${iqamaDelay}ms ${index} `
        index++
      }
    }
  })

  return expectedMarble + '|'
}
