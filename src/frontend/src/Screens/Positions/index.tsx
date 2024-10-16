import { PropsWithChildren, useContext } from 'react'
import { Positions } from '../../Components/Position'
import { DisplayContext } from '../../Contexts/Display'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface PositionsScreenWrapperProps extends PropsWithChildren { }

const PositionsScreenWrapper: React.FC<PositionsScreenWrapperProps> = (props) => {
  const { children } = props
  const { display, setDisplay } = useContext(DisplayContext)

  const handleTabChange = (value: string) => {
    if (setDisplay) {
      setDisplay(value as 'cards' | 'table')
      localStorage.setItem('display', JSON.stringify(value))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1 className="text-4xl font-bold text-center mb-6">Positions</h1>
        {Positions.length < 1 ? (
          <Tabs value={display} onValueChange={handleTabChange} className="w-full">
            <TabsList className="justify-center mb-4">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <div className="rounded-lg">
              <TabsContent value="cards">{display === 'cards' && children}</TabsContent>
              <TabsContent value="table">{display === 'table' && children}</TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="p-4">{children}</div>
        )}
      </div>
    </div>
  )
}

export const PositionsScreen: React.FC = () => {
  return (
    <PositionsScreenWrapper>
      <Positions />
    </PositionsScreenWrapper>
  )
}