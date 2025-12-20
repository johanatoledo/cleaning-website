import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logoPristineTransp.png';

const navItems = [
    { path: '/', label: 'Home', view: 'home' },
    { path: '/about', label: 'About', view: 'about' },
    { path: '/blog', label: 'Blog', view: 'blog' },
    { path: '/dashboard', label: 'My Dashboard', view: 'panel' },
];

export default function Header() {
    const location = useLocation();

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light sticky-top'>
            <div className='container'>
                <img src={logo} className='logo' alt='Logo pristine homes' />
                <Link className='navbar-brand fw-bold' to='/' style={{ color: 'var(--pristine-magenta)' }}>
                    Pristine Homes
                </Link>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navMain'
                    aria-controls='navMain'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div id='navMain' className='collapse navbar-collapse'>
                    <ul className='navbar-nav ms-auto align-items-lg-center gap-lg-2'>
                        {navItems.map((item) => (
                            <li className='nav-item' key={item.path}>
                                <Link
                                    className={`nav-link list-hover ${location.pathname === item.path ? 'active' : ''}`}
                                    to={item.path}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className='nav-item ms-lg-2'>
                            <Link className='btn btn-brand btn-custom' to='/booking'>
                                Book now
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

