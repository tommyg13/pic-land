import useStoreSelector from "../hooks/useStoreSelector";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useStoreSelector("auth.token", null);

  return (
    <nav className="navbar">
      <div className="flex">
        <div className="navbar-header">
          <Link to="/">
            <img
              className="navLogo"
              src="https://res.cloudinary.com/dlvavuuqe/image/upload/v1495887467/254c4802-06c5-4a7e-82ee-8524a8399a53_hwzesa.png"
              alt="logo"
            />
          </Link>
        </div>
        <div>
          <ul className="navbar-right">
            {user ? <></> : <Link to="/login">Login</Link>}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
