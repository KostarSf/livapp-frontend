import { useEffect, useRef, useState } from 'react'
import './App.css'

type StatusData = {
  id: number
  systemId: number
  value: string
  createdAt: string
  updatedAt: string
}

type SystemData = {
  id: number
  last_online: string
  name: string
  address: string
  description: string
  status: StatusData
  createdAt: string
  updatedAt: string
}

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("livapp-apikey") || "")
  const [errorMessage, setMessage] = useState<string>("")
  const [systems, setSystems] = useState<SystemData[]>([])
  const [autoUpdateIntervalId, setIntervalId] = useState<number | undefined>(undefined)

  const apiKeyFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (apiKeyFieldRef.current) {
      apiKeyFieldRef.current.value = apiKey
    }
    fetchSystemsData(apiKey, false)
  }, [])

  useEffect(() => {
    const newTimeInterval = setInterval(() => fetchSystemsData(apiKey), 5000)
    setIntervalId(newTimeInterval)
    return () => clearInterval(newTimeInterval)
  }, [apiKey])

  const useApiKeyHandle = () => {
    const newKey = String(apiKeyFieldRef.current?.value)
    setApiKey(newKey)
    localStorage.setItem("livapp-apikey", newKey)
    fetchSystemsData(newKey, true)
  }

  function fetchSystemsData(apiKey: string, removeOldSystems: boolean = false) {
    // setMessage("Обновление...")
    if (removeOldSystems) {
      setSystems([])
    }
    fetch(`http://stormdrains.vega-project.ru/api/embeded/system?api_key=${apiKey}`)
      .then(r => r.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message)
        } else if (!data.systems) {
          setMessage("Ошибка при получении данных")
        } else {
          setMessage("")
          const systems: SystemData[] = data.systems
          setSystems(systems.sort((a, b) => a.id - b.id))
        }
      })
      .catch(setMessage)
  }

  return (
    <div className="App">
      <div>
        <input type="text" id="api_key_field" placeholder="API ключ" ref={apiKeyFieldRef}/>
        <input type="button" value="Применить API ключ" id="api_key_apply_btn" onClick={useApiKeyHandle}/>
        <span> {errorMessage}</span>
      </div>
      <div>
        {systems.map(system => {
          const updateDate = new Date(system.last_online)

          const secondsPast = (Date.now() - updateDate.getTime()) / 1000
          const minutesPast = secondsPast / 60
          const hoursPast = minutesPast / 60
          const daysPast = hoursPast / 24

          const online = system.id === 4 ? secondsPast < 100 : secondsPast < 25

          const timeText = secondsPast < 60 ? Math.ceil(secondsPast) + " секунд"
            : minutesPast < 120 ? Math.ceil(minutesPast) + " минут"
            : hoursPast < 24 ? Math.ceil(hoursPast) + " часов"
            : Math.ceil(daysPast) + " дней"

          const onlineSpan = online ? <span style={{color: "#46b230"}}>ОНЛАЙН</span> 
            : <span style={{color: "#acb0b3"}}>Был в сети {timeText} назад</span>

          return (
            <div key={system.id}>
              <p>{system.name} - {system.address} {onlineSpan}</p>
              <p>Обновлено: {updateDate.toLocaleString()}</p>
              <p>Показания: {system.status?.value || "отсутствуют"}</p>
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
