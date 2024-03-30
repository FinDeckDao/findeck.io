export const SidePanel = () => {
  return (
    <aside id='sidebar' className="col-span-12 md:col-span-4 bg-slate-800 p-4 text-blue-200">
      <nav>
        <ul>
          <li>
            <a href={`/`}>Dashboard</a>
          </li>
          <li>
            <a href={`/positions`}>Positions</a>
          </li>
        </ul>
      </nav>
      <div id="detail"></div>
    </aside>
  )
}

export default SidePanel