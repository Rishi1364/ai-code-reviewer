import React, { useState, useEffect } from 'react';
import { FaTimes, FaWhatsapp, FaTelegramPlane, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import './ShareModal.css';

// 1. ADD 'code' to the props here 👇
const ShareModal = ({ isOpen, onClose, code }) => {
  const [step, setStep] = useState('generating');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep('generating');
      setCopied(false);

      // --- THE LOGIC ---
      // 1. Get the base website link (e.g., http://localhost:3000)
      const baseUrl = window.location.origin;

      // 2. Encode the code so it can travel in a URL (turns spaces into %20, etc.)
      const encodedCode = encodeURIComponent(code);

      // 3. Create the full link
      const finalUrl = `${baseUrl}?code=${encodedCode}`;

      setShareUrl(finalUrl);

      // Fake loading delay
      const timer = setTimeout(() => {
        setStep('ready');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, code]); // Re-run if code changes

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social Sharing Links
  const msg = "Check out this code snippet!";
  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}%20${encodeURIComponent(shareUrl)}`;
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(msg)}`;
  const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const liLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>

        <div className="share-header">
          <h3>{step === 'generating' ? 'Processing...' : 'Share Snippet'}</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="share-body">
          {step === 'generating' ? (
            <div className="generating-container">
              <p className="generating-text">Creating magic link...</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="link-box">
                  <input type="text" className="link-input" value={shareUrl} readOnly />
                <button className="copy-link-btn" onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                </div>
                <div className="divider-text">or share using</div>
              <div className="social-grid">
                  <a href={waLink} target="_blank" rel="noreferrer" className="social-btn whatsapp"><FaWhatsapp /></a>
                  <a href={tgLink} target="_blank" rel="noreferrer" className="social-btn telegram"><FaTelegramPlane /></a>
                  <a href={liLink} target="_blank" rel="noreferrer" className="social-btn linkedin"><FaLinkedinIn /></a>
                  <a href={fbLink} target="_blank" rel="noreferrer" className="social-btn facebook"><FaFacebookF /></a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;