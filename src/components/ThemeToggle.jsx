import {useState} from 'react';import Icon from './Icon';import {setTheme} from '../lib/theme';
// Memakai sistem tema yang sudah ada (setTheme menyimpan pilihan di localStorage 'th' dan menerapkannya ke <html data-theme>).
export default function ThemeToggle(){
 const[dark,setDark]=useState(document.documentElement.dataset.theme==='dark');
 return <button type="button" className="ib authx-tt" aria-label={dark?'Aktifkan mode terang':'Aktifkan mode gelap'} onClick={()=>{setTheme(dark?'light':'dark');setDark(!dark)}}><Icon n={dark?'sun':'moon'} s={18}/></button>;
}
