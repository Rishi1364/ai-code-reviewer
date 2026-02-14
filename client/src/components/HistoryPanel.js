import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaTimes, FaHistory, FaCode, FaTrash } from 'react-icons/fa';

// 1. ACCEPT 'theme' AS A PROP HERE vvv
const HistoryPanel = ({ user, onClose, onLoad, theme }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. HELPER VARIABLE: Checks if we are in dark mode
  const isDark = theme === 'dark';

  // Fetch History Logic
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const historyRef = collection(db, "history");
        const q = query(
          historyRef,
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setHistory(items);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Delete Function
  const handleDelete = async (e, itemId) => {
    e.stopPropagation();

    setHistory(prev => prev.filter(item => item.id !== itemId));

    try {
      await deleteDoc(doc(db, "history", itemId));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // 3. DYNAMIC STYLES (Switches colors based on isDark)
  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', justifyContent: 'flex-end',
      backdropFilter: 'blur(2px)'
    },
    panel: {
      width: '400px', height: '100%',
      // Dark: Dark Blue-Grey | Light: Pure White
      backgroundColor: isDark ? '#0d1117' : '#ffffff',
      borderLeft: isDark ? '1px solid #30363d' : '1px solid #d0d7de',
      display: 'flex', flexDirection: 'column',
      boxShadow: '-5px 0 25px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease-out',
      transition: 'background-color 0.3s, border-color 0.3s'
    },
    header: {
      padding: '20px',
      borderBottom: isDark ? '1px solid #21262d' : '1px solid #d0d7de',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      // Dark: Light Grey Text | Light: Dark Text
      color: isDark ? '#e6edf3' : '#24292f',
      backgroundColor: isDark ? '#161b22' : '#f6f8fa' // Light mode header is slightly grey
    },
    closeBtn: {
      background: 'none', border: 'none',
      color: isDark ? '#8b949e' : '#57606a',
      fontSize: '20px', cursor: 'pointer',
      padding: '5px', borderRadius: '50%',
      transition: 'color 0.2s'
    },
    list: {
      flex: 1, overflowY: 'auto', padding: '15px'
    },
    // The History Cards
    item: {
      padding: '15px', marginBottom: '12px',
      backgroundColor: isDark ? '#161b22' : '#ffffff',
      border: isDark ? '1px solid #30363d' : '1px solid #d0d7de',
      borderRadius: '8px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
      display: 'flex', flexDirection: 'column', gap: '8px'
    },
    dateText: {
      fontWeight: 'bold', fontSize: '13px',
      color: isDark ? '#e6edf3' : '#1f2328'
    },
    timeText: {
      fontSize: '11px',
      color: isDark ? '#8b949e' : '#656d76'
    },
    previewBox: {
      color: isDark ? '#8b949e' : '#57606a',
      fontSize: '13px', display: 'flex', alignItems: 'center',
      // Subtle background for code snippet
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f6f8fa',
      padding: '6px', borderRadius: '4px',
      border: isDark ? 'none' : '1px solid #eaeef2'
    },
    deleteBtn: {
      position: 'absolute', right: '20px', bottom: '15px',
      background: 'transparent', border: 'none',
      color: '#da3633', cursor: 'pointer', fontSize: '14px', padding: '5px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>

        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FaHistory /> Past Reviews
          </h3>
          <button onClick={onClose} style={styles.closeBtn}><FaTimes /></button>
        </div>

        {/* Content */}
        <div style={styles.list}>
          {loading ? (
            <p style={{ textAlign: 'center', color: isDark ? '#888' : '#555', marginTop: '20px' }}>Loading...</p>
          ) : history.length === 0 ? (
            <p style={{ textAlign: 'center', color: isDark ? '#888' : '#555', marginTop: '20px' }}>No history found yet.</p>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                onClick={() => onLoad(item)}
                style={styles.item}
                className="history-item"
              >
                {/* Item Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.dateText}>
                    {item.timestamp?.toDate ? new Date(item.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                  </span>
                  <span style={styles.timeText}>
                    {item.timestamp?.toDate ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                {/* Code Preview */}
                <div style={styles.previewBox}>
                  <FaCode style={{ marginRight: '8px', color: '#58a6ff' }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {item.code ? item.code.substring(0, 50) : "No code preview"}...
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  style={styles.deleteBtn}
                  title="Delete this item"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;