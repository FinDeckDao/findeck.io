import { FC } from "react"
import { PositionCards } from "./PositionCards"
import { DisplayContext } from "../../Contexts/Display"
import { useContext } from "react"
import { PositionsTable } from "../../Components/Position/Table"
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { PartialPosition } from "./types"

interface DisplayControlProps {
  partialPositions: PartialPosition[]
  trades: Trade[]
}

// Display control for Position Cards or Position Table
export const DisplayControl: FC<DisplayControlProps> = (props) => {
  const { partialPositions, trades } = props
  const { display } = useContext(DisplayContext)

  switch (display) {
    case "cards":
      return <PositionCards partialPositions={partialPositions} trades={trades} />
    case "table":
      return <PositionsTable />
    default:
      return <PositionCards partialPositions={partialPositions} trades={trades} />
  }
}

