export const SidePanel = () => {
  return (
    <aside id='sidebar' className="col-span-12 md:col-span-4 bg-orange-400  p-4">
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