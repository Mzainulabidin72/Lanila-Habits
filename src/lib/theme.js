export const getTheme=()=>localStorage.getItem('th')||'system';
export function applyTheme(){const v=getTheme();document.documentElement.dataset.theme=v==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):v}
export const setTheme=v=>{localStorage.setItem('th',v);applyTheme()};
export const toast=m=>{const e=document.createElement('div');e.textContent=m;e.setAttribute('role','status');e.style.cssText='position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1a1f36;color:#fff;padding:.6rem 1rem;border-radius:12px;z-index:9';document.body.append(e);setTimeout(()=>e.remove(),2500)};
