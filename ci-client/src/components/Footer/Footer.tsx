import React from 'react';
import './Footer.scss';

export function Footer() {

    return (
      <footer className='footer'>
        <div className="footer__content">
            <ul className="footer__menu text_size_m">
                <li><a className="text_view_secondary footer__menu-link" href="\">Support</a></li>
                <li><a className="text_view_secondary footer__menu-link" href="\">Learning</a></li>
            </ul>
            <div className="text footer__text text_size_m text_view_secondary">© 2020 Vladimir</div>
        </div>
      </footer>
    );
  }