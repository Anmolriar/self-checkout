import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface NotificationItem {
  id: string;
  message: string;
  startTime: number;
}

interface NotificationProps {
  messages: string[];
  duration?: number;
}

const ProgressNotification = ({ messages, duration = 1000 }: NotificationProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && (!notifications.length || notifications[0].message !== lastMessage)) {
      const newNotification = {
        id: Date.now().toString(),
        message: lastMessage,
        startTime: Date.now()
      };
      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(notification => now - notification.startTime < duration)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  if (!notifications.length) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        .progress-bar {
          animation: progress ${duration}ms linear;
          transform-origin: left;
        }
        
        .notification-enter {
          animation: slide-in 150ms ease-out;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2 z-50">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="notification-enter relative bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg overflow-hidden"
            style={{
              opacity: 1 - index * 0.15,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 5}px)`,
            }}
          >
            <div className="absolute inset-0 border-2 border-white/20 rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0 bg-white/20 progress-bar"
                style={{
                  animationDelay: '0ms',
                  animationFillMode: 'forwards',
                }}
              />
            </div>
            <Check className="h-4 w-4 relative" />
            <span className="relative">{notification.message}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProgressNotification;