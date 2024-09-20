import { FC, useState } from 'react'
import { SearchableCurrencyList } from './Search'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const CreateWatchList: FC = () => {
  const [activeTab, setActiveTab] = useState('base')

  return (
    <div className="container mx-auto min-h-96 px-4">
      <h1 className="text-4xl font-bold text-center mt-10 mb-6">Create Watch List</h1>

      {/* Mobile view */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="base">Base Asset</TabsTrigger>
            <TabsTrigger value="quote">Quote Asset</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'base' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Asset You're Buying (Base)</h2>
            <SearchableCurrencyList />
          </div>
        )}

        {activeTab === 'quote' && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Asset Used To Pay (Quote)</h2>
            <SearchableCurrencyList />
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex lg:space-x-4">
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Base Asset</h2>
          <SearchableCurrencyList />
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Quote Asset</h2>
          <SearchableCurrencyList />
        </div>
      </div>
    </div>
  )
}