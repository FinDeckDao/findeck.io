import { GetPositionCards } from "./Card"
import { DisplayContext } from "../../Contexts/Display"
import { useContext } from "react"
import { PositionsTable } from "./Table"

// Container for rows and columns of positions
export const Positions = () => {
  const { display } = useContext(DisplayContext)

  switch (display) {
    case "cards":
      return <GetPositionCards />
    case "table":
      return <PositionsTable />
    default:
      return <GetPositionCards />
  }
}

