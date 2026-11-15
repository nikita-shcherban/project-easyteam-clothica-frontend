'use client';

import { useRouter } from 'next/navigation';
import { getUserOrders, logout } from '@/lib/api/client-api';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import LogoutModal from './LogoutModal/LogoutModal';
import type { Order } from '@/types/order';
import { showToast } from '@/lib/toast';
import Loader from '@/components/Loader/Loader';
import UserInfoForm from './UserInfoForm/UserInfoForm';
import styles from './ProfilePage.module.css';
import MessageNoInfo from '../MessageNoInfo/MessageNoInfo';

const orderStatusLabels: Record<Order['status'], string> = {
  pending: 'Очікується',
  processing: 'У процесі',
  shipped: 'Відправлено',
  delivered: 'Виконано',
  cancelled: 'Скасовано',
};

export default function ProfilePage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);
  const { user } = useUserProfile();
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
        setOrdersError(true);
      } finally {
        setOrdersLoading(false);
      }
    };
    void loadOrders();
  }, []);

  const clearUser = useAuthStore((state) => state.clearUser);
  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.replace('/');
      router.refresh();
    } catch (error) {
      console.error('Помилка виходу з кабінету', error);
    }
  };
  if (isAuthLoading) {
    return <Loader overlay />;
  }
  if (!user) {
    return (
      <div className={styles.page}>
        <p>
          Не вдалося завантажити дані користувача. Спробуйте оновити сторінку.
        </p>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <section className={styles.container}>
        <h1 className={styles.title}>Кабінет</h1>
        <div className={styles.content}>
          <div className={styles.userInfoWrapper}>
            <UserInfoForm />
          </div>
          <section className={styles.transactions}>
            <h2 className={styles.sectionTitle}>Мої замовлення</h2>
            {ordersLoading ? (
              <Loader />
            ) : ordersError ? (
              <p>Не вдалося завантажити замовлення.</p>
            ) : orders.length === 0 ? (
              <MessageNoInfo
                text="У вас ще не було жодних замовлень! Мерщій до покупок!"
                buttonText="До покупок"
                onClick={() => router.push('/goods')}
              />
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order._id} className={styles.orderItem}>
                    <div>
                      <p className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                      </p>
                      <p
                        className={styles.orderNumber}
                        title={`№${order._id}`}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(order._id);
                            void showToast(
                              'success',
                              'Номер замовлення скопійовано',
                            );
                          } catch {
                            void showToast(
                              'error',
                              'Не вдалося скопіювати номер замовлення',
                            );
                          }
                        }}
                      >
                        №{order._id.slice(0, 8)}...
                      </p>
                    </div>

                    <div>
                      <p className={styles.orderPriceLabel}>Сума:</p>
                      <p className={styles.orderPrice}>
                        {order.totalPrice} грн
                      </p>
                    </div>
                    <div className={styles.orderStatus}>
                      <p className={styles.orderStatusLabel}>Статус:</p>
                      <p className={styles.orderStatusValue}>
                        {orderStatusLabels[order.status]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Вийти з кабінету
          </button>
        </div>
        {isLogoutModalOpen && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setIsLogoutModalOpen(false)}
          />
        )}
      </section>
    </div>
  );
}
