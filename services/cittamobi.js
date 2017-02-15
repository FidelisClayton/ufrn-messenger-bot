import axios from 'axios'

import busStops from '../data/bus-stops'

export const CITTAMOBI_ENDPOINT = "http://api.plataforma.cittati.com.br"

export function selectBusStopById(stopId) {
  return busStops.filter(busStop => busStop.stopId === Number(stopId))[0]
}

const filterArrival = service => service.predictionType === "ARRIVAL"
const filterDeparture = service => service.predictionType === "DEPARTURE"
const availableServices = service => service.vehicles.length > 0
const availableVehicles = (previous, service) => previous.concat(service.vehicles)

const transformVehicles = (service) => {
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

export function reduceServicesByPredictionType(services) {
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

export function getStopPrediction(stopId) {
  return axios.get(`${CITTAMOBI_ENDPOINT}/m3p/js/prediction/stop/${stopId}`)
    .then(res => res.data)
    .then(res => ({
      busStop: selectBusStopById(stopId),
      ...reduceServicesByPredictionType(res.services)
    }))
}
