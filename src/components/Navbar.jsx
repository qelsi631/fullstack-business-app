import { useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login", { replace: true });
    };

    return (
        <nav>
            <h2>BusinessApp</h2>

            <div className="nav-actions">
                <span>{user?.name || "Admin"}</span>
                <span>👤</span>
                <button type="button" className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;