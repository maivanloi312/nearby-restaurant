import { Link } from "react-router-dom";
import HeartIcon from "../../images/heart.svg";
import UserIcon from "../../images/user.svg";
import CartIcon from "../../images/cart.svg";
import { useEffect } from "react";
import clientRequest from "../../APIFeatures/clientRequest";
import { useState } from "react";
const MenuHome = () => {
    const [user, setUser] = useState({});
    const [quantity, setQuantity] = useState(0);
    useEffect(() => {
        clientRequest.getProfileMe().then((res) => {
            setUser(res.user);
            let totalQuantity = 0;
            // res.user.cartItems.forEach(item=>totalQuantity+=item.quantity)
            setQuantity(totalQuantity);
        });
    }, []);

    return (
        <header className="header_area menu-home">
            <div className="classy-nav-container breakpoint-off d-flex align-items-center justify-content-between light left">
                <nav className="classy-navbar" id="essenceNav">
                    <a className="nav-brand" href="index.html">
                        <img src="img/core-img/logo.png" alt="" />
                    </a>
                    <div className="classy-navbar-toggler">
            <span className="navbarToggler">
              <span />
              <span />
              <span />
            </span>
                    </div>

                    <div className="classy-menu">
                        <div className="classycloseIcon">
                            <div className="cross-wrap">
                                <span className="top" />
                                <span className="bottom" />
                            </div>
                        </div>
                        <div className="classynav">
                            <ul className="menu-list">
                                <li className="megamenu-item">
                                    <Link to="/home"><img src="/static/media/tazas.98794f90.png" style={{width: "65px"}}></img></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="header-meta d-flex clearfix justify-content-end">
                    <div className="user-login-info">
                        {user.avatar && (
                            <Link to="/profile">
                                <img src={user.avatar.url} alt="" />
                            </Link>
                        )}
                        {!user.avatar && (
                            <Link to="/login">
                                <img src={UserIcon} alt="" />
                            </Link>
                        )}
                    </div>
                    <div className="cart-area">
                        {
                            user.role!== 'admin' && <Link to="/cart-items" id="essenceCartBtn">
                                <img src={CartIcon} alt="" />
                            </Link>
                        }

                    </div>
                </div>
            </div>
        </header>
    );
};
export default MenuHome;
