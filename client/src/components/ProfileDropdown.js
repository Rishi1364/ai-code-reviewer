import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaTimes, FaPlus, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import './ProfileDropdown.css';

const ProfileDropdown = ({ user, onClose, onLogout, onAddAccount }) => {
  const [showAccounts, setShowAccounts] = useState(false); // Default closed like image
  const [recentAccounts, setRecentAccounts] = useState([]);

  // Logic: Recent Accounts in Local Storage
  useEffect(() => {
    if (user) {
      const currentAccount = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      let saved = JSON.parse(localStorage.getItem('app_recent_accounts') || '[]');
      saved = saved.filter(acc => acc.email !== user.email);

      const newHistory = [currentAccount, ...saved].slice(0, 3);
      localStorage.setItem('app_recent_accounts', JSON.stringify(newHistory));
      setRecentAccounts(saved);
    }
  }, [user]);

  if (!user) return null;

  const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
  // Keep your preferred avatar logic
  const safeAvatar = user.photoURL || "https://ui-avatars.com/api/?name=" + user.email + "&background=random&color=fff";

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>

      <div className="profile-dropdown">

        {/* 1. Top Row: Email & Close Button */}
        <div className="dropdown-top-row">
          <span className="dropdown-email-text">{user.email}</span>
          <button className="dropdown-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* 2. Main User Info */}
        <div className="dropdown-user-info">
          <img
            src={safeAvatar}
            alt="Profile"
            className="dropdown-avatar-large"
            onError={(e) => { e.target.onerror = null; e.target.src = safeAvatar; }}
          />
          <h2 className="dropdown-greeting">Hi, {firstName}!</h2>
          <button
            className="manage-account-pill"
            onClick={() => window.open('https://myaccount.google.com/', '_blank')}
          >
            Manage your Google Account
          </button>
        </div>

        {/* 3. The "Inner Box" Container */}
        <div className="dropdown-menu-box">

          {/* Header (Hide/Show) */}
          <div className="menu-box-header" onClick={() => setShowAccounts(!showAccounts)}>
            <span>{showAccounts ? 'Hide' : 'Show'} more accounts</span>
            {showAccounts ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {/* Expanded List */}
          {showAccounts && recentAccounts.map((acc, index) => {
            const accAvatar = acc.photoURL || "https://ui-avatars.com/api/?name=" + acc.email + "&background=random&color=fff";
            return (
              <div
                key={index}
                className="menu-account-item"
                onClick={() => { if (onAddAccount) onAddAccount(acc.email); onClose(); }}
              >
                <img src={accAvatar} alt="" className="small-avatar" />
                <div className="menu-text">
                  <span className="menu-name">{acc.displayName || 'User'}</span>
                  <span className="menu-email">{acc.email}</span>
                </div>
              </div>
            );
          })}

          {/* Action Buttons (Inside the box now) */}
          <button
            className="menu-action-btn"
            onClick={() => { if (onAddAccount) onAddAccount(); onClose(); }}
          >
            <FaPlus /> <span>Add another account</span>
          </button>

          <button
            className="menu-action-btn"
            onClick={() => { onLogout(); onClose(); }}
          >
            <FaSignOutAlt /> <span>Sign out of all accounts</span>
          </button>
        </div>

        <div className="dropdown-footer">
          <a
            href="https://ancient-ballcap-db9.notion.site/Privacy-Policy-306574a2b2598086a97bc23177e43126?source=copy_link"
            target="_blank" rel="noopener noreferrer"
            className="footer-link"
          >
            Privacy Policy
          </a>

          {/* REMOVED THE DOT HERE */}

          <a
            href="https://ancient-ballcap-db9.notion.site/Terms-of-Service-306574a2b259808e9f4ad04c4063d8d3?source=copy_link"
            target="_blank" rel="noopener noreferrer"
            className="footer-link"
          >
            Terms of Service
          </a>
        </div>

      </div>
    </>
  );
};

export default ProfileDropdown;