import Example from "./Pricing"

export const Home = () => {
  return (
    <div className="container mx-auto text-center">
      <h1>Beat the hidden things killing your trade profitability</h1>

      <h2>This dApp is a decision support system to help you optimize your trading</h2>
      <div className="text-left mb-8">
        <p>
          There are a few problems when it comes to trading that cause a lot of people to fail.
          The primary causes of failure are related to mindset, strategy, and poor execution
          because of obscured pitfalls.
        </p>
        <p>
          This dApp is designed to help you avoid these pitfalls by providing you with the tools
          to make better decisions.
        </p>
      </div>

      <h2>How it works</h2>

      <div className="rounded-xl bg-slate-800 p-4 mb-4">
        <h3>Miscalculations</h3>
        <div className="text-left mb-10">
          <p>
            If you've ever closed out a trade at a loss because you didn't calculate your
            profit correctly this dApp can help you.
          </p>
          <p>
            This dApp shows you the profit and loss of your total position and your individual
            trades in real-time. When you have this information you know if you can sell at a profit or not.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800 p-4 mb-4">
        <h3>Not Knowing Your Cost Basis</h3>
        <div className="text-left mb-10">
          <p>
            It's possible for you to take profit on a trade and still lose money because you are
            uncertain of your cost basis.
          </p>
          <p>
            This dApp shows you the cost basis for you entire position as well as the cost basis for
            each of your trades. When you have this information you know if you are in profit or a bag holder.
          </p>
        </div>
      </div>


      <div className="rounded-3xl bg-slate-800 p-4 mb-4">
        <h3>Overwhelmed because you have too many trades open</h3>
        <div className="text-left mb-10">
          <p>
            It's extremely difficult to keep track of all your trades if you have more than just a few open.
          </p>
          <p>
            This dApp shows you a snap shot of your trades in one place. You can see a summary all your
            positions combined, every asset position you have open, and the profit and loss of each individual
            trade.
          </p>
        </div>
      </div>

      <h2>Pricing</h2>
      <Example />
    </div >
  )
}