// react
import { useState, useEffect } from "react"

// Components
import Subtitle from "../components/subtitle"
import Input from "../components/input"
import Select from "../components/select"
import Fieldset from "../components/fieldset"
import FormText from "../components/form-text"

// Api
import { getHotels } from "../api/hotels"
import { saleEndpoint } from "../api/api"
import { getTransports } from "../api/transports"

// Context
import LoadContext from '../context/load'
import { useContext } from 'react'

// Libraries
import Swal from 'sweetalert2'

export default function Form() {

  // System consts
  const activeTransportType = "Arriving,Departing"

  // Context
  const { setLoading } = useContext(LoadContext)
  
  // Form state
  const [activeTransportPrice, setActiveTransportPrice] = useState(0)
  const [mediaQuery, setMediaQuery] = useState(false)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [hotel, setHotel] = useState('Airbnb')
  const [hotels, setHotels] = useState([])
  const [arrivingDate, setArrivingDate] = useState('2024-10-13')
  const [arrivingTime, setArrivingTime] = useState('')
  const [arrivingAirline, setArrivingAirline] = useState('')
  const [arrivingFlight, setArrivingFlight] = useState('')
  const [departingDate, setDepartingDate] = useState('2024-10-18')
  const [departingTime, setDepartingTime] = useState('')
  const [departingAirline, setDepartingAirline] = useState('')
  const [departingFlight, setDepartingFlight] = useState('')
  const [total, setTotal] = useState(0)
  const [otherHotel, setOtherHotel] = useState('')
  const [email, setEmail] = useState('')

  function handleResize() {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setMediaQuery(mediaQuery.matches)
  }

  useEffect(() => {

    // Detect when resize screen and update media query status
    window.addEventListener('resize', () => {
      handleResize()
    })

    // Handle when loads
    handleResize(handleResize())

    // Load api data when mounts
    getHotels().then(apiHotels => {
      setHotels(apiHotels)
      setHotel(apiHotels[0].value)
    })

    getTransports().then(apiTransports => {
      setActiveTransportPrice(apiTransports[0].price)
      setTotal(apiTransports[0].price)
    })

  }, [])


  function getArraivingDepartingForm() {
    // Generate arraiving and departing forms

    // Identify active transport type
    const activeForms = activeTransportType.split(",")

    const fieldsets = []
    for (let title of activeForms) {

      // Text changes and set functions
      let direction = "in"
      if (title == "Departing") {
        direction = "from"
      }

      fieldsets.push(
        <Fieldset title={title} key={title}>
          <legend className="title text-xl uppercase mb-3"></legend>
          <Input
            label={`${title} date`}
            type='date'
            name={`${title.toLowerCase()}-date`}
            handleUpdate={(e) => {

              const enabledArrivingDates = ['2024-10-13', '2024-10-14']
              const enabledDepartingDates = ['2024-10-18']

              if (title == "Arriving") {
                if (enabledArrivingDates.includes(e.target.value)) {
                  setTotal(activeTransportPrice * passengers)
                  setArrivingDate(e.target.value)
                } else {
                  alert("Only October 13th and 14th are available")
                }
              } else { 
                if (enabledDepartingDates.includes(e.target.value)) {
                  setTotal(activeTransportPrice * passengers)
                  setDepartingDate(e.target.value)
                } else {
                  alert("Only October 18th is available")
                }
              }
            }}
            value={title == "Arriving" ? arrivingDate : departingDate}
          />
          <Input
            label={`${title} time ${direction} Cancun`}
            type='time'
            name={`${title.toLowerCase()}-time`}
            handleUpdate={(e) => title == "Arriving" ? setArrivingTime(e.target.value) : setDepartingTime(e.target.value)}
            value={title == "Arriving" ? arrivingTime : departingTime}
          />
          <Input
            label='Airline'
            type='text'
            name={`${title.toLowerCase()}-airline`}
            placeholder="Enter your airline"
            handleUpdate={(e) => title == "Arriving" ? setArrivingAirline(e.target.value) : setDepartingAirline(e.target.value)}
            value={title == "Arriving" ? arrivingAirline : departingAirline}
          />
          <Input
            label='Flight number'
            type='text'
            name={`${title.toLowerCase()}-flight`}
            placeholder="Enter your flight number"
            handleUpdate={(e) => title == "Arriving" ? setArrivingFlight(e.target.value) : setDepartingFlight(e.target.value)}
            value={title == "Arriving" ? arrivingFlight : departingFlight}
          />
          <FormText
            text={`*In case you have connecting flights, please make sure you provide the info for your actual flight ${title.toLowerCase()} ${direction} Cancun`}
          />
        </Fieldset>
      )
    }

    return fieldsets
  }

  async function handleSubmit(e) {

    function alertError() {
      // Alert error for api call
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: 'Try again later'
      })
    }

    e.preventDefault()

    // Toggle loading status
    setLoading(true)

    // Get data from innputs
    const inputsData = {}
    const inputs = document.querySelectorAll("input:not(.no-collect), select:not(.no-collect)")
    inputs.forEach(input => {
      let inutName = input.name.charAt(0).toUpperCase() + input.name.slice(1)
      inutName = inutName.replace("-", " ")
      const Inputvalue = input.value
      inputsData[inutName] = Inputvalue
    })
    
    // Add price to total
    inputsData["Price"] = total

    try {
      const response = await fetch(saleEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputsData),
        mode: "cors",
      })
      const response_json = await response.json()
  
      // Show error if api call fails
      if (response_json.status == "error") {
        console.log ({response_json})
        alertError()
      } else {        
        Swal.fire({
          icon: 'success',
          title: 'Thank you!',
          text: 'Your transportation has been reserved succesfully',
          footer: 'We will contact you soon'
        }).then (() => {
          // Reload page
          window.location.reload()
        })
      }
      
    } catch (error) {
      console.log ({error})
      alertError()
    }

    // Disable loading status
    setLoading(false)
  }

  // Generate passager options
  const maxPassenger = 4
  const passengersData = []
  for (let passengerNum = 1; passengerNum <= maxPassenger; passengerNum++) {
    let label = `${passengerNum} passengers`
    if (passengerNum == 1) {
      label = `${passengerNum} passenger`
    }
    passengersData.push({ "value": `${passengerNum}`, "label": label })
  }

  return (
    <section className="buy-form container" id="buy">
      
      <Subtitle text="Transportation" />
      
      <p
        className={`
          text-2xl
          text-center
          max-w-7xl
          mx-auto
          my-12
          px-4
        `}
      >
        Shuttles will be running non-stop on October 13th and 14th for arriving flights and October 18th for return flights.
        <br />
        NO OTHER DATES WILL BE SERVICED.
      </p>

      <form action="." method="post" className="mx-auto" onSubmit={handleSubmit}>

        <div className="fields w-5/6 mx-auto grid gap-10" style={{ gridTemplateColumns: mediaQuery ? "repeat(1, 1fr)" : activeTransportType == "Arriving,Departing" ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}>
          <Fieldset title='General'>
            <legend className="title text-xl uppercase mb-3"></legend>
            <Input
              label='Name'
              placeholder='Enter your name'
              type='text'
              name='name'
              handleUpdate={(e) => setName(e.target.value)}
              value={name}
              required={true}
            />
            <Input
              label='Last name'
              placeholder='Enter your last name'
              type='text'
              name='last-name'
              handleUpdate={(e) => setLastName(e.target.value)}
              value={lastName}
              required={true}
            />
            <Input 
              label='Email'
              placeholder='Enter your email'
              type='email'
              name='email'
              handleUpdate={(e) => setEmail(e.target.value)}
              value={email}
              required={true}
            />
            <Select
              label='Number of passengers'
              name='passengers'
              handleUpdate={(e) => setPassengers(e.target.value)}
              options={passengersData}
              activeOption={passengers}
            />
            <FormText
              text="Fill only if you bring a guest"
            />
            <Select
              label='Hotel'
              name='hotel'
              handleUpdate={(e) => {
                // Save hotel value
                const value = e.target.value
                setHotel(value)
              }}
              options={hotels}
              activeOption={hotel}
            />

            {/* Render input for other hotel */}
            {
              (hotel == 'Other hotel in Playa del Carmen area') &&
              <Input
                label='Hotel name'
                placeholder='Enter your other hotel name'
                type='text'
                name='other-othel'
                handleUpdate={(e) => setOtherHotel(e.target.value)}
                value={otherHotel}
                required={true}
              />
            }

          </Fieldset>

          {getArraivingDepartingForm()}

        </div>

        <p className="total text-center text-2xl w-fulll block mt-10">
          Total
          <span className="px-2 font-bold">
            {total}.00 USD
          </span>
        </p>
        <input type="submit" value="Reserve Now" className="no-collect w-48 mx-auto mt-10 block bg-blue border-blue border-2 text-gold py-3 text-2xl font-bold cursor-pointer rounded-xl transition-all duration-300 hover:rounded-3xl hover:bg-white hover:text-blue" />

      </form>
    </section>
  )
}