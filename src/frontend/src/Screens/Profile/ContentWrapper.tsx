import { FC, PropsWithChildren } from 'react'

export const ContentWrapper: FC<PropsWithChildren> = (props) => {
  const { children } = props
  return (
    <div className='container pt-4 mx-auto items-center justify-center 
                    text-center rounded-3xl bg-dark max-w-2xl'
    >
      {children}
    </div>
  )
}