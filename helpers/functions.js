export function selectBusStopById(id, busStops) {
  return busStops.filter(stop => stop.stopId === id)[0]
}

export function selectBusStopByName(name, busStops) {
  return busStops.filter(busStop => busStop.title === name)
}
