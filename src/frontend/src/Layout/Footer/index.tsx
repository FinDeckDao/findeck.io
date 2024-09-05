import iclogo from '../../Assets/internet-computer-icp-logo.svg'

export const Footer = () => {
  return (
    <div className="bg-dark col-span-12 min-h-[5rem] text-center p-4 text-white rounded-t-lg">
      <p>
        This project is proudly hosted on the {' '}
        <a href="https://internetcomputer.org/" target="_blank" className="text-white hover:bg-dark rounded-lg px-0.5 py-2.5">
          <img src={iclogo} alt="Internet Computer Logo" className="h-8 w-8 inline p-0 mb-1 align-middle" />{' '}
          Internet Computer
        </a>{' '}
        made possible by the <a href="https://dfinity.org/" target="_blank" className="text-white hover:bg-dark rounded-lg px-0.5 py-2.5">
          <img src={iclogo} alt="Internet Computer Logo" className="h-8 w-8 inline p-0 mb-1 align-middle" />{' '}
          DFINITY Foundation
        </a>.
      </p>
    </div>
  )
}