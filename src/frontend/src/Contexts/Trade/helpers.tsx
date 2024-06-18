import { Dispatch, SetStateAction } from 'react'
import { Trade } from './'

interface DeleteTradeProps {
  trades: Trade[],
  trade: Trade,
  setter: Dispatch<SetStateAction<Trade[]>> | null
}
// Handles the details related to the removal of a trade.
export const deleteTrade = (props: DeleteTradeProps) => {
  const { trades, trade, setter } = props
  // Filter out the trade to delete.
  const updatedTrades = trades.filter((t) => {
    return t !== trade
  })

  // Update the trades context.
  if (setter && updatedTrades) {
    setter([...updatedTrades])
  }

  // Update the local storage.
  localStorage.setItem('trades', JSON.stringify(updatedTrades))

  // TODO: For paid customers, add an additional layer to store this data on the ICP network.
}