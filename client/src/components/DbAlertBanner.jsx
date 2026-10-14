import React, { useState } from 'react';
import { Database, AlertTriangle, X, Terminal, ArrowRight } from 'lucide-react';

export default function DbAlertBanner({ dbStatus, onRefresh }) {
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // If connected or dismissed, don't show
  if (dbStatus?.connected || dismissed) return null;

  return (
    <div className="db-alert-banner">
      <div className="db-alert-main">
        <div className="db-alert-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="db-alert-text">
          <strong>MongoDB Atlas is not connected yet.</strong>
          <span> Please update <code>server/.env</code> with your MongoDB connection string to persist and load data.</span>
        </div>
        <div className="db-alert-actions">
          <button
            className="btn-text-action"
            onClick={() => setShowDetails(prev => !prev)}
          >
            {showDetails ? 'Hide Setup Guide' : 'How to connect Atlas?'}
          </button>
          <button
            className="btn btn-secondary btn-xs"
            onClick={onRefresh}
          >
            Check Again
          </button>
          <button
            className="db-alert-close"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="db-setup-guide">
          <p className="guide-title">
            <Terminal size={16} /> 3 Quick Steps to Connect MongoDB Atlas:
          </p>
          <ol className="guide-steps">
            <li>
              Log in to <strong>MongoDB Atlas</strong> (cloud.mongodb.com) and create a free M0 Cluster.
            </li>
            <li>
              Go to <strong>Database Access</strong> & create a user with username & password. Under <strong>Network Access</strong>, allow IP <code>0.0.0.0/0</code> (or current IP).
            </li>
            <li>
              Click <strong>Connect</strong> &gt; <strong>Drivers</strong>, copy the connection string, and paste it in <code>server/.env</code>:
              <pre className="code-snippet">
                MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@&lt;cluster&gt;.mongodb.net/minishop?retryWrites=true&w=majority
              </pre>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
