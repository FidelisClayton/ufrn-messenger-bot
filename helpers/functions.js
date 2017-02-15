export function selectBusStopById(id, busStops) {
  return busStops.filter(stop => stop.stopId === id)[0]
}
