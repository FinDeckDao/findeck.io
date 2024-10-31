import { FC, PropsWithChildren } from 'react'

export const ContentWrapper: FC<PropsWithChildren> = (props) => {
  const { children } = props
  return (
    <div className='pt-4 mx-auto items-center justify-center 
                    rounded-3xl max-w-4xl'
    >
      {children}
    </div>
  )
}