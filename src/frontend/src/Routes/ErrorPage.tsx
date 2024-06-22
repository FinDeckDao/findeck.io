import { DefaultLayout } from "../Layout"
import join from "../Assets/join-findeck-on-openchat.png"

export const ErrorPage = () => {

  return (
    <DefaultLayout>
      <div id="error-page" className=" bg-slate-800 w-full h-auto text-sky-100 p-4 text-center">
        <h1>Sorry FinDeck.io doesn't understand what you're requesting.</h1>
        <p>Very sorry for the confusion.</p>

        <p>
          Please select a different page from the navigation bar above.
        </p>

        <p>Origin on the Internet Computer: {import.meta.env.VITE_CANISTER_ORIGIN}</p>

        <p>
          If you need additional help follow this {" "}
          <a className='text-sky-400 hover:bg-slate-700 rounded-lg px-0.5 py-2.5'
            target="_blank"
            href='https://oc.app/group/44cgg-6iaaa-aaaar-bhoiq-cai/?ref=ex43p-lqaaa-aaaar-bal2q-cai&code=37e610bea997ad09'>
            OpenChat
          </a>
          {" "}link.
        </p>

        <p>Or, you can scan the QR Code below.</p>

        <img src={join} alt="Join FinDeck on OpenChat" className="mx-auto" />

      </div>
    </DefaultLayout>
  )
}

export default ErrorPage