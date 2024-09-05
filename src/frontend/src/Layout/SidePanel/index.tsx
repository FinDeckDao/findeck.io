import { Link } from "react-router-dom"

export const SidePanel = () => {
  return (
    <aside id='sidebar' className="col-span-12 md:col-span-4 bg-dark p-4 text-blue-200">
      {/* TODO: Move this list of links to it's own component. */}
      <nav>
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/positions`}>Positions</Link>
          </li>
          <li>
            <Link to={`/dashboard`}>Dashboard</Link>
          </li>
        </ul>
      </nav>
      <div id="detail"></div>
    </aside>
  )
}

export default SidePanel