import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"; // Import CSS file

const NotificationBell = ({ deadlines }) => {
  const [hasNewAlerts, setHasNewAlerts] = useState(false);

  useEffect(() => {
    const now = new Date();
    const upcomingDeadlines = deadlines.filter(
      (deadline) => new Date(deadline.date) - now <= 24 * 60 * 60 * 1000
    );

    if (upcomingDeadlines.length > 0) {
      setHasNewAlerts(true);
      upcomingDeadlines.forEach((deadline) => {
        toast.info(`Upcoming deadline: ${deadline.name} - ${deadline.date}`);
      });
    }
  }, [deadlines]);

  return (
    <div>
      <button
        className="notification-bell"
        onClick={() => setHasNewAlerts(false)}
      >
        🔔
        {hasNewAlerts && <span className="alert-dot"></span>}
      </button>
      <ToastContainer className="notification-toast-container" />
    </div>
  );
};

export default NotificationBell;
