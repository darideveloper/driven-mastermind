export async function getTransports() {

  const transports = [
    {
      "key": "Arriving,Departing",
      "name": "Round Trip - Transfer",
      "price": 100,
      "por_defecto": true
    }
  ]

  // Format data
  const data = []
  for (const transport of transports) {
    data.push({
      id: transport.key, 
      text: transport.name, 
      price: transport.price, 
      initialActive: transport.por_defecto
    })
  }

  return data
}