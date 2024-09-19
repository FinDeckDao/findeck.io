import { FC } from 'react'
import { SearchableCurrencyList } from './Search'

// As a user I need to be able to select from a list of known assets so I don't have to guess about detail.
// As a user I need to be able to add an asset to my watch list so I can track multiple items.
// As a user I need to be able to add unknown assets to my watch list so I can track multiple items.
// As a user I need to be able to save my watch list so I can return to it later.

// The purpose of this component is to present the user's watch list.
export const WatchList: FC = () => {
  return (
    <div className="container mx-auto min-h-96">
      <h1 className="text-4xl font-bold text-center mt-10">Watch List</h1>
      <SearchableCurrencyList />
    </div>
  )
}


