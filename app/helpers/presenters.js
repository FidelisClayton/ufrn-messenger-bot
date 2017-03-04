const filterArrival = service => service.predictionType === 'ARRIVAL'
const filterDeparture = service => service.predictionType === 'DEPARTURE'
const availableServices = service => service.vehicles.length > 0
const availableVehicles = (previous, service) => previous.concat(service.vehicles)

const transformVehicles = service => {
  service.vehicles = service.vehicles.map(vehicle => {
    vehicle.routeMnemonic = service.routeMnemonic
    vehicle.serviceMnemonic = service.serviceMnemonic

    return vehicle
  })

  return service
}

const sortVehicles = (a, b) => {
  if(a.prediction > b.prediction) return 1
  if(a.prediction < b.prediction) return -1

  return 0
}

export function groupServicesByPredictionType(services) {
  const arrival = services
              .filter(filterArrival)
              .filter(availableServices)
              .map(transformVehicles)
              .reduce(availableVehicles, [])
              .sort(sortVehicles)

  const departure = services
              .filter(filterDeparture)
              .filter(availableServices)
              .map(transformVehicles)
              .reduce(availableVehicles, [])
              .sort(sortVehicles)

  return {
    arrival,
    departure,
  }
}
