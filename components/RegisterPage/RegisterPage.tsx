import AuthTabs from '@/components/AuthTabs/AuthTabs';
import RegistrationForm from './RegistrationForm';
import css from './RegisterPage.module.css';

function RegisterPage() {
  return (
    <section className={css.registration} aria-labelledby="registration-title">
      <AuthTabs activeTab="register" />
      <h1 className={css.title} id="registration-title">
        Реєстрація
      </h1>
      <RegistrationForm />
    </section>
  );
}

export default RegisterPage;
