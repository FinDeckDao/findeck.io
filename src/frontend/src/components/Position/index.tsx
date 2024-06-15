import { GetCards } from "./Card"
import { DisplayContext } from "../../Contexts/Display"
import { useContext } from "react"

// Container for rows and columns of positions
export const Positions = () => {
  const { display } = useContext(DisplayContext)

  console.log("Positions display:", display)

  switch (display) {
    case "cards":
      return <GetCards />
    case "table":
      return <>Map of Table rows</>
    default:
      return <GetCards />
  }
}

