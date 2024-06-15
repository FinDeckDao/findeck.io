import { useState, FC, PropsWithChildren, createContext, Dispatch } from "react"

export type DisplayType = "cards" | "table"

interface DisplayContextType {
  display: DisplayType
  setDisplay: Dispatch<React.SetStateAction<DisplayType>> | null
}

// Get the existing trades from local storage.
const displayFromLocalStorage: DisplayType = JSON.parse(
  localStorage.getItem('display') || JSON.stringify("cards")
)

const defaultContext: DisplayContextType = {
  display: displayFromLocalStorage,
  setDisplay: null
}

export const DisplayContext = createContext<DisplayContextType>(defaultContext)

// This component provides setters and getters for the AssetPair Context.
export const DisplayProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  // Default value is our favorite asset pair.
  const [display, setDisplay] = useState<DisplayType>(displayFromLocalStorage)

  return (
    <DisplayContext.Provider value={{ display, setDisplay }}>
      {children}
    </DisplayContext.Provider>
  )
}