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

export const formatDateToRU = (date) => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  return `${year}${month}${day}`
}
