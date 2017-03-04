export const selectBusStopByName = (name, busStops) =>
  busStops.filter(busStop => busStop.title.toLowerCase() === name.toLowerCase())

export const selectBusStopById = (stopId, busStops) => {
  return busStops.filter(busStop => busStop.stopId === Number(stopId))[0]
}
