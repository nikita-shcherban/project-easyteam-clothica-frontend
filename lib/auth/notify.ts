export async function notifyAuthError(message: string) {
  // iziToast accesses the DOM; load it only after a browser-side interaction.
  const { default: iziToast } = await import('izitoast');
  iziToast.error({
    id: 'auth-error',
    title: 'Помилка',
    message,
    position: 'topRight',
    timeout: 6000,
    close: true,
    pauseOnHover: true,
  });
}
