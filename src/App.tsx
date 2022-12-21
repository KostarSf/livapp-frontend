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

  const useApiKeyHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      <form className='flex mb-3 bg-white shadow' onSubmit={useApiKeyHandle}>
        <input className='flex-1 w-0 bg-white px-2' name='api_key' type="text" id="api_key_field" placeholder="API ключ" ref={apiKeyFieldRef}/>
        <input className='font-medium bg-slate-300 px-3 py-1 cursor-pointer hover:bg-slate-700 hover:text-white' type="submit" value="Применить ключ" id="api_key_apply_btn"/>
      </form>
      <div>
        <p>{errorMessage}</p>
      </div>
      <div className='flex flex-col gap-3'>
        {systems.map(system => {
          const updateDate = new Date(system.last_online)

          const secondsPast = (Date.now() - updateDate.getTime()) / 1000
          const minutesPast = secondsPast / 60
          const hoursPast = minutesPast / 60
          const daysPast = hoursPast / 24

          const online = system.id == 4 ? secondsPast < 90 : secondsPast < 25

          const timeText = secondsPast < 60 ? Math.ceil(secondsPast) + " секунд"
            : minutesPast < 120 ? Math.ceil(minutesPast) + " минут"
            : hoursPast < 24 ? Math.ceil(hoursPast) + " часов"
            : Math.ceil(daysPast) + " дней"

          const onlineStatusSpan = online ? <span className='text-lime-500'>ОНЛАЙН</span>
            : <span className='text-slate-300'>ОФФЛАЙН</span>

          return (
            <div key={system.id} className='drop-shadow bg-white p-2'>
              <p className='font-bold'>{system.name} - {system.address} {onlineStatusSpan}</p>
              <p className='text-slate-400 font-normal'>Обновлено {timeText} назад <br /> {updateDate.toLocaleString()}</p>
              {system.status?.value && (
                <p>Показания: {system.status?.value}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
