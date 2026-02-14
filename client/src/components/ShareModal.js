import React, { useState, useEffect } from 'react';
import { FaTimes, FaWhatsapp, FaTelegramPlane, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, code }) => {
  const [step, setStep] = useState('generating'); // 'generating' or 'ready'
  const [copied, setCopied] = useState(false);

  // Fake Link (In a real app, this would be your backend ID)
  // We encode the code to make it somewhat usable or just a dummy link
  const shareUrl = `https://ai-code-reviewer.app/share/${Math.random().toString(36).substring(7)}`;

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep('generating');
      setCopied(false);
      
      // Fake loading delay (1.5 seconds) to look "Pro"
      const timer = setTimeout(() => {
        setStep('ready');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl); // Copies the link
    // navigator.clipboard.writeText(code); // Uncomment if you want to copy CODE instead of LINK
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social Sharing Links
  const msg = "Check out my code on AI Code Reviewer!";
  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}%20${encodeURIComponent(shareUrl)}`;
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(msg)}`;
  const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const liLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="share-header">
          <h3>{step === 'generating' ? 'Processing...' : 'Share your code'}</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Content */}
        <div className="share-body">
          
          {step === 'generating' ? (
            /* STAGE 1: Generating Animation */
            <div className="generating-container">
              <p className="generating-text">Generating unique link...</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          ) : (
            /* STAGE 2: Share Options */
            <>
              <div className="link-box">
                <input 
                  type="text" 
                  className="link-input" 
                  value={shareUrl} 
                  readOnly 
                />
                <button className="copy-link-btn" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <div className="divider-text">or share using</div>

              <div className="social-grid">
                <a href={waLink} target="_blank" rel="noreferrer" className="social-btn whatsapp" title="WhatsApp">
                  <FaWhatsapp />
                </a>
                <a href={tgLink} target="_blank" rel="noreferrer" className="social-btn telegram" title="Telegram">
                  <FaTelegramPlane />
                </a>
                <a href={liLink} target="_blank" rel="noreferrer" className="social-btn linkedin" title="LinkedIn">
                  <FaLinkedinIn />
                </a>
                <a href={fbLink} target="_blank" rel="noreferrer" className="social-btn facebook" title="Facebook">
                  <FaFacebookF />
                </a>
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ShareModal;