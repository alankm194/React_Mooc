import React, { useState, useEffect } from 'react'
import axios from 'axios'
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const url = `https://restcountries.com/v3.1/name/${name}?fullText=true`
  
  useEffect(() => {
    const fetchCountry = async () => {
      const resp = await axios.get(url)
      const countryData = {
        found: true,
        data: {
          name: resp.data[0].name.common,
          capital: resp.data[0].capital[0],
          population: resp.data[0].population,
          flag: resp.data[0].flags.png
        }
      }
      setCountry(countryData)
    }
    if (!name) {
      setCountry(null)
      return 
    }
    fetchCountry().catch(e => {
      if (e.message.includes('404')) {
        setCountry({ found: false })
      } else {
        return setCountry(null)
      }
    })
  }, [url, name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
