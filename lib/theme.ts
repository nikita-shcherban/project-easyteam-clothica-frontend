export type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'clothica-theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme) {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  const root = document.documentElement;
  if (root.dataset.theme === resolved) return;

  const style = document.createElement('style');
  style.textContent = '*,*::before,*::after{transition:none!important}';
  document.head.appendChild(style);
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  // Flush styles while transitions are disabled so text and surfaces change together.
  window.getComputedStyle(document.body).getPropertyValue('color');
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => style.remove());
  });
}

// Runs before the first paint; never interpolate user data into this script.
export const THEME_INIT_SCRIPT = `(function(){var t='light';try{var s=localStorage.getItem('clothica-theme');if(s==='light'||s==='dark'||s==='system')t=s;}catch(e){}var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r;})();`;
