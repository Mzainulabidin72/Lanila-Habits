// Ikon garis (gaya Feather/Lucide) — menggantikan emoji pada navigasi & dashboard. Warna mengikuti currentColor.
const L=(...p)=>p.map((d,i)=><path key={i} d={d}/>);
const P={
 home:L('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'),
 check:L('M20 6L9 17l-5-5'),
 checkc:L('M22 11.08V12a10 10 0 1 1-5.93-9.14','M22 4L12 14.01l-3-3'),
 calendar:<><rect x="3" y="4" width="18" height="18" rx="2"/>{L('M16 2v4','M8 2v4','M3 10h18')}</>,
 target:<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
 chart:L('M18 20V10','M12 20V4','M6 20v-6'),
 pen:L('M12 20h9','M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'),
 award:<><circle cx="12" cy="8" r="7"/>{L('M8.21 13.89L7 23l5-3 5 3-1.21-9.12')}</>,
 clock:<><circle cx="12" cy="12" r="10"/>{L('M12 6v6l4 2')}</>,
 user:<>{L('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2')}<circle cx="12" cy="7" r="4"/></>,
 sliders:L('M4 21v-7','M4 10V3','M12 21v-9','M12 8V3','M20 21v-5','M20 12V3','M1 14h6','M9 8h6','M17 16h6'),
 menu:L('M3 12h18','M3 6h18','M3 18h18'),
 sun:<><circle cx="12" cy="12" r="5"/>{L('M12 1v2','M12 21v2','M4.22 4.22l1.42 1.42','M18.36 18.36l1.42 1.42','M1 12h2','M21 12h2','M4.22 19.78l1.42-1.42','M18.36 5.64l1.42-1.42')}</>,
 moon:L('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'),
 bell:L('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'),
 plus:L('M12 5v14','M5 12h14'),
 flame:L('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'),
 eye:<>{L('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z')}<circle cx="12" cy="12" r="3"/></>,
 eyeoff:L('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24','M1 1l22 22'),
 bulb:L('M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5','M9 18h6','M10 22h4')};
export default function Icon({n,s=20}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex:'none'}}>{P[n]}</svg>}
