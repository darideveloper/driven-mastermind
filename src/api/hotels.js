import { apiBaseUrl } from "./api"

export async function getHotels () {
  const hotels = [
    {
      "name": "UNICO 20° 87° Riviera Maya",
      "extra_price": 0
    },
]

  // Format data
  const data = []
  for (const hotel of hotels) {
    data.push ({
      value: hotel.name,
      label: hotel.name,
      price: hotel.extra_price
    })
  }

  return data
}