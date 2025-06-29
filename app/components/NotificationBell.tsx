import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaBell } from 'react-icons/fa';

export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: any;
  link?: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification))
      );
    });
    return () => unsub();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    notifications.forEach(async (n) => {
      if (!n.read) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
        aria-label="Notifications"
      >
        <FaBell size={24} color="#fff" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: 'red', color: 'white', borderRadius: '50%',
            padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold',
            zIndex: 2
          }}>{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '120%', minWidth: 320, background: 'white',
          border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 32px rgba(31,38,135,0.2)',
          zIndex: 10000, padding: 16
        }}>
          <h4 style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>Notifications</h4>
          {notifications.length === 0 && <div style={{ color: '#888' }}>No notifications</div>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li key={n.id} style={{
                background: n.read ? 'transparent' : 'rgba(33,150,243,0.08)',
                borderRadius: 8, marginBottom: 8, padding: 8, fontWeight: n.read ? 400 : 600
              }}>
                {n.link ? (
                  <a href={n.link} style={{ color: '#1976d2', textDecoration: 'underline' }}>{n.message}</a>
                ) : n.message}
                <span style={{ float: 'right', fontSize: '0.8em', color: '#888' }}>{new Date(n.timestamp?.toDate?.() || n.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
