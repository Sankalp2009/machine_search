import { useState, useEffect } from 'react'
import SearchInput from '../Component/SearchInput'
function Dashboard() {
  // query state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const trimmed = query.trim()
    const controller = new AbortController()
    
    // Handle empty query case
    if (!trimmed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      setIsLoading(false)
      setIsError(false)
      setError(null)
      return
    }

    const fetchSearch = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        let Res = await fetch(
          `https://dummyjson.com/products/search?q=${trimmed}`,
          {
            signal: controller.signal,
          }
        )
        if (!Res.ok) throw new Error('Data not fetched successfully')
        let data = await Res.json()
        let product = data?.products || []
        setResults(product)
      } catch (error) {
        // stuck here | Need attention to detail buddy
        if (error.name === 'AbortError') return
        setIsError(true)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    const timerID = setTimeout(fetchSearch, 500)
    return () => {
      clearTimeout(timerID)
      controller.abort()
    }
  }, [query])

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />
      <div>
        {isLoading && <h2>Searching</h2>}
        {!isLoading && query && isError && <h2>{error}</h2>}
        {results?.map((el) => (
          <div key={el.id}>{el.title}</div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard