import { FC } from 'react'
import join from "../../Assets/join-findeck-on-openchat.png"
import { useAuthState } from '@ic-reactor/react'

export const DashboardScreen: FC = () => {
  const { identity } = useAuthState()


  return (
    <div className='container mx-auto items-center justify-center text-center'>
      <h1 className='text-2xl'>Dashboard</h1>
      <p><span className="font-extrabold">Here are your stats:</span> {identity?.getPrincipal().toString()}</p>
      <p className="mb-20">
        In the future this page will be a dashboard that shows all of the details of your trading.
        It will have things like your positions, your total equity, your total cost basis,
        your trades, your profits, and your losses.
      </p>
      <p>For now free to poke around the site and offer any feedback in our{" "}
        <a href="https://oc.app/community/vmoft-nqaaa-aaaar-bh3pa-cai/?ref=ex43p-lqaaa-aaaar-bal2q-cai">
          OpenChat
        </a>
        .
      </p>

      <p>Or, to offer feedback, you can scan the QR Code below.</p>

      <img src={join} alt="Join FinDeck on OpenChat" className="mx-auto" />
    </div>
  )
}