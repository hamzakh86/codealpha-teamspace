import { NavLink } from 'react-router-dom'

import logo from '../../assets/img/teamspace-logo.png'

export function HomePageHeader() {
	return (
		<header className="homepage-header">
			<NavLink to="/" className="homepage-header-logo">
				<img src={logo} alt="logo" />
				<h1 className="teamspace-logo">TeamSpace</h1>
			</NavLink>

			<nav>
				<NavLink to="/login">
					<button className="login-btn">Log in</button>
				</NavLink>
				<NavLink to="/signup">
					<button className="singup-btn">Get TeamSpace for free</button>
				</NavLink>
			</nav>
		</header>
	)
}
