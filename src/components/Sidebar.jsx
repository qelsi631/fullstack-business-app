import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        MENU
      </div>

      <ul className="sidebar-menu">

        <li>
          <NavLink to="/dashboard">
            <span>▣</span>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/products">
            <span>📦</span>
            Products
          </NavLink>
        </li>

        <li>
          <NavLink to="/customers">
            <span>👥</span>
            Customers
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders">
            <span>🛒</span>
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings">
            <span>⚙️</span>
            Settings
          </NavLink>
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;