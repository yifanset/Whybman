import './page-header.css';
import logo from './logo.svg';
import line from './line.svg';
import { Link } from 'react-router-dom';

const PageHeader = () => {
  return (
    <div className='page-header__block'>
      <div className="page-header__right-block">
        <img className='page-header__logo' src={logo} alt="logo" />
        <img className='page-header__line' src={line} alt="line" />
        <div className='page-header__text'>WHY</div> 
        <div className='page-header__text2'>[Б]</div> 
        <div className='page-header__text3'>MEN</div> 
      </div>

      <div className="page-header__container">
        <nav className="page-header__nav">
          <Link to="/" className="page-header__nav-link">Главная</Link>
          <Link to="/team" className="page-header__nav-link">Наша команда</Link>
        </nav>
      </div>
    </div>
  );
};

export default PageHeader;