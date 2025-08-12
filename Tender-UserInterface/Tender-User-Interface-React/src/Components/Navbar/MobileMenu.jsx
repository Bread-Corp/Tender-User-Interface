import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const MenuIcon = ({ open, toggle }) => (
    <div className="menu-icon" onClick={toggle}>
        {open ? <FaTimes /> : <FaBars />}
    </div>
);

export default MenuIcon;
