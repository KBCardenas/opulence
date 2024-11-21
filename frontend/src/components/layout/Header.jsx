import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-dark shadow-sm" id="mainNav">
            <div className="container px-5">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="bi-list"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav nav1 m-auto me-4 my-3 my-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3" to="/">New</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3" to="/">Mujer</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3" to="/">Hombre</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3" to="/">Niños</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3" to="/">Promos</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav nav2">
                        <li className="nav-item">
                            <Link className="nav-link" to="/search" id="search-icon"><i className="bi bi-search"></i></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/user-profile"><i className="bi bi-person-circle"></i></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/carrito"><i className="bi bi-cart-fill"></i></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
