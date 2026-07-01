import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Timeline() {
  const text = "VEILiq is here for you!!";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 80); // Adjust typing speed here
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timeline-container" style={{ 
      padding: '80px 32px', 
      background: 'var(--bg-card)', 
      borderRadius: 'var(--radius-xl)', 
      boxShadow: 'var(--shadow-md)', 
      border: '1px solid var(--border)', 
      maxWidth: 500, 
      margin: '60px auto', 
      textAlign: 'center', 
      minHeight: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}
      </style>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ 
          fontFamily: '"Dancing Script", cursive', 
          color: 'var(--primary)', 
          fontSize: '2.4rem', 
          marginRight: '8px',
          display: 'inline-block'
        }}>
          {displayedText.slice(0, 6)}
        </span>
        <span style={{ display: 'inline-block', minWidth: '180px', textAlign: 'left' }}>
          {displayedText.slice(6)}
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ 
              display: 'inline-block', 
              width: '3px', 
              height: '1.6rem', 
              background: 'var(--primary)', 
              marginLeft: '4px', 
              verticalAlign: 'middle',
              borderRadius: '2px'
            }}
          />
        </span>
      </h3>
    </div>
  );
}
