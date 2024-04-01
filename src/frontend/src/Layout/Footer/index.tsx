export const Footer = () => {
  return (
    <div className="bg-slate-800 col-span-12 h-[3.75rem] text-center p-2 text-sky-100">
      <p>
        This project is proudly hosted on{' '}
        <a href="https://internetcomputer.org/" target="_blank" className="text-sky-400">
          The Internet Computer
        </a>{' '}
        made possible by the <a href="https://dfinity.org/" className="text-sky-400">
          DFINITY Foundation
        </a>.
      </p>
    </div>
  )
}