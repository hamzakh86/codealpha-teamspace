import { NavLink } from 'react-router-dom'
import polyLogo from '../../assets/img/polyspace-logo.png'

export function HomePageHeader() {
	return (
		<header className="homepage-header">
			<NavLink to="/" className="homepage-header-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
				<img src={polyLogo} alt="PolySpace Logo" style={{ height: '38px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} />
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ fontSize: '18px', fontWeight: '800', color: '#0066B3', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
						Poly<span style={{ color: '#F58220' }}>Space</span>
					</span>
					<span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
						École Polytechnique de Sousse
					</span>
				</div>
			</NavLink>

			<nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<NavLink to="/login">
					<button className="login-btn" style={{ fontWeight: '600', padding: '8px 16px', borderRadius: '6px' }}>
						Connexion
					</button>
				</NavLink>
				<NavLink to="/signup">
					<button className="singup-btn" style={{ backgroundColor: '#0066B3', color: '#FFF', fontWeight: '700', padding: '9px 18px', borderRadius: '6px', border: 'none' }}>
						Accès Étudiant Gratuit
					</button>
				</NavLink>
			</nav>
		</header>
	)
}
