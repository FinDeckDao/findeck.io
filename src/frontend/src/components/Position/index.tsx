import { GetCards } from "./Card"

interface PositionsProps {
  view?: "cards" | "table" | "list"
}

// Container for rows and columns of positions
export const Positions = (props: PositionsProps) => {
  const { view } = props

  switch (view) {
    case "cards":
      return <GetCards />
    case "table":
      return <>Map of Table rows</>
    case "list":
      return <>List</>
    default:
      return <GetCards />
  }
}

