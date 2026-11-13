import AuthTabs from '@/components/AuthTabs/AuthTabs';
import LoginForm from './LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <section className={styles.content} aria-labelledby="auth-title">
      <AuthTabs activeTab="login" />
      <h1 id="auth-title" className={styles.title}>
        Вхід
      </h1>
      <LoginForm />
    </section>
  );
}
