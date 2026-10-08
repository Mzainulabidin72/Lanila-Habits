import {useState} from 'react';import Icon from './Icon';
// Input kata sandi dengan tombol mata di dalam kolom (type=button agar tidak men-submit form).
export default function PasswordInput({id,...p}){
 const[show,setShow]=useState(false);
 return <div className="pw"><input id={id} type={show?'text':'password'} {...p}/>
  <button type="button" className="pw-b" aria-label={show?'Hide password':'Show password'} aria-pressed={show} onClick={()=>setShow(!show)}><Icon n={show?'eyeoff':'eye'} s={18}/></button></div>;
}
