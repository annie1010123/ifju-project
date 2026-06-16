import { useState } from "react";

const SCREENS = {
  LOGIN: "login", HOME: "home", MAP: "map", SCAN: "scan",
  FOREST: "forest", POINTS: "points", ACCOUNT: "account",
  LEADERBOARD: "leaderboard", ANOMALY: "anomaly"
};

const binData = [
  { id: 1, name: "宜聖宿舍站", capacity: 23, type: "回收", x: 22, y: 28, compressed: "10 分鐘前", smell: 12, weight: 3.2, opens: 18, status: "正常" },
  { id: 2, name: "進修部大樓站", capacity: 87, type: "一般", x: 55, y: 18, compressed: "2 分鐘前", smell: 34, weight: 8.7, opens: 52, status: "即將滿載" },
  { id: 3, name: "學餐周邊站", capacity: 45, type: "廚餘", x: 62, y: 55, compressed: "5 分鐘前", smell: 61, weight: 5.1, opens: 37, status: "異味偵測" },
  { id: 4, name: "圖書館站", capacity: 12, type: "回收", x: 35, y: 65, compressed: "15 分鐘前", smell: 8, weight: 1.4, opens: 9, status: "正常" },
  { id: 5, name: "體育館站", capacity: 56, type: "一般", x: 78, y: 42, compressed: "8 分鐘前", smell: 22, weight: 6.0, opens: 44, status: "正常" },
  { id: 6, name: "文德樓站", capacity: 91, type: "廚餘", x: 45, y: 80, compressed: "1 分鐘前", smell: 78, weight: 9.3, opens: 61, status: "需清運" },
];

const capColor = (c) => c < 40 ? "#0F6E56" : c < 70 ? "#BA7517" : "#A32D2D";
const capBg   = (c) => c < 40 ? "#E1F5EE" : c < 70 ? "#FAEEDA" : "#FCEBEB";
const capText = (c) => c < 40 ? "充裕" : c < 70 ? "適中" : "即將滿載";

const statusColor = (s) => ({
  "正常": "#0F6E56", "即將滿載": "#BA7517", "需清運": "#A32D2D", "異味偵測": "#7B4FBF"
})[s] || "#888";
const statusBg = (s) => ({
  "正常": "#E1F5EE", "即將滿載": "#FAEEDA", "需清運": "#FCEBEB", "異味偵測": "#F3EEFF"
})[s] || "#eee";

const leaderboard = [
  { rank: 1, name: "陳小明", dept: "資工系 3A", trees: 142, pts: 3840, co2: 25.6 },
  { rank: 2, name: "林雅婷", dept: "護理系 2B", trees: 128, pts: 3210, co2: 22.1 },
  { rank: 3, name: "王建豪", dept: "法律系 4A", trees: 119, pts: 2980, co2: 20.8 },
  { rank: 4, name: "你", dept: "企管系 4A", trees: 94, pts: 2640, co2: 18.4, isMe: true },
  { rank: 5, name: "吳雪玲", dept: "社工系 1C", trees: 88, pts: 2490, co2: 15.9 },
  { rank: 6, name: "張偉誠", dept: "神學系 2A", trees: 76, pts: 2105, co2: 13.7 },
  { rank: 7, name: "劉靜宜", dept: "心理系 3B", trees: 71, pts: 1980, co2: 12.8 },
];

const classBoard = [
  { rank: 1, name: "資工系 3A", trees: 892, pts: 24800 },
  { rank: 2, name: "護理系 2B", trees: 764, pts: 20100 },
  { rank: 3, name: "企管系 4A", trees: 641, pts: 17300, isMe: true },
  { rank: 4, name: "法律系 4A", trees: 598, pts: 15900 },
  { rank: 5, name: "社工系 1C", trees: 521, pts: 14200 },
];

const anomalyLog = [
  { id: "S003", name: "學餐周邊站", type: "異味超標", time: "今天 13:42", level: "警告", desc: "異味指數 61，超過門檻值 50" },
  { id: "S006", name: "文德樓站", type: "需清運", time: "今天 13:15", level: "緊急", desc: "容量達 91%，自動壓縮失效" },
  { id: "S002", name: "進修部大樓站", type: "即將滿載", time: "今天 11:30", level: "警告", desc: "容量達 87%，建議儘速清運" },
  { id: "S001", name: "宜聖宿舍站", type: "維修紀錄", time: "昨天 16:20", level: "資訊", desc: "感測器校正完成，恢復正常運作" },
];

function PineTree({ size = 44, delay = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" style={{ animation: `treeGrow 0.6s ease-out ${delay}s both` }}>
      <rect x="27" y="54" width="6" height="12" rx="2" fill="#8B6914"/>
      <polygon points="30,12 45,35 15,35" fill="#2f7d4f"/>
      <polygon points="30,24 48,47 12,47" fill="#37935c"/>
      <polygon points="30,36 51,59 9,59" fill="#2f7d4f"/>
      <polygon points="30,12 30,35 15,35" fill="#fff" opacity="0.12"/>
      <circle cx="30" cy="11" r="2.4" fill="#FFD54A"/>
    </svg>
  );
}

function TreeSVG({ size = 40, color = "#2d8a4e", delay = 0, stage = 3, fruit = false, blossom = false }) {
  const blossoms = [[24,40],[36,42],[30,33],[33,47]];
  const apples = [[22,40],[38,40],[30,32],[26,49],[36,30],[34,48],[19,35]];
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" style={{ animation: `treeGrow 0.6s ease-out ${delay}s both` }}>
      {stage === 1 && (
        <>
          <rect x="28.5" y="48" width="3" height="14" rx="1.5" fill="#9C7322"/>
          <ellipse cx="30" cy="44" rx="7" ry="8" fill={color}/>
          <ellipse cx="26" cy="46" rx="4.5" ry="4.5" fill={color}/>
          <ellipse cx="34" cy="46" rx="4.5" ry="4.5" fill={color}/>
          <ellipse cx="27" cy="41" rx="3" ry="3.5" fill="#fff" opacity="0.25"/>
        </>
      )}
      {stage === 2 && (
        <>
          <rect x="27" y="46" width="6" height="18" rx="2" fill="#8B6914"/>
          <ellipse cx="30" cy="40" rx="14" ry="16" fill={color}/>
          <ellipse cx="23" cy="37" rx="9" ry="9" fill={color}/>
          <ellipse cx="37" cy="37" rx="9" ry="9" fill={color}/>
          <ellipse cx="24" cy="33" rx="5" ry="6" fill="#fff" opacity="0.22"/>
          <ellipse cx="37" cy="44" rx="6" ry="6" fill="#000" opacity="0.08"/>
          {fruit && blossoms.map(([cx,cy],i)=>(
            <g key={i}><circle cx={cx} cy={cy} r="2" fill="#F8BBD0"/><circle cx={cx} cy={cy} r="0.7" fill="#F06292"/></g>
          ))}
        </>
      )}
      {stage === 3 && (
        <>
          <rect x="26" y="45" width="8" height="20" rx="2.5" fill="#8B6914"/>
          <rect x="26" y="45" width="3" height="20" rx="1.5" fill="#A0782C" opacity="0.6"/>
          <ellipse cx="30" cy="42" rx="19" ry="21" fill={color}/>
          <ellipse cx="21" cy="37" rx="12" ry="12" fill={color}/>
          <ellipse cx="39" cy="37" rx="12" ry="12" fill={color}/>
          <ellipse cx="30" cy="27" rx="12" ry="14" fill={color}/>
          <ellipse cx="22" cy="31" rx="7" ry="8" fill="#fff" opacity="0.2"/>
          <ellipse cx="37" cy="49" rx="9" ry="7" fill="#000" opacity="0.08"/>
          {fruit && apples.map(([cx,cy],i)=>(
            <g key={i}><circle cx={cx} cy={cy} r={blossom?2.2:2.6} fill={blossom?"#F06DA6":"#E23B3B"}/><circle cx={cx-0.8} cy={cy-0.8} r="0.7" fill="#fff" opacity={blossom?0.5:0.7}/></g>
          ))}
        </>
      )}
    </svg>
  );
}

/* ── NAV ── */
function NavBar({ screen, setScreen }) {
  const tabs = [
    { id: SCREENS.HOME,   label: "首頁",   path: "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" },
    { id: SCREENS.MAP,    label: "地圖",   path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" },
    { id: SCREENS.SCAN,   label: "投遞",   path: "M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-5 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zM17 13h1.5v1.5H17V13zm-3 3h1.5v1.5H14V16zm1.5 1.5H17V19h-1.5v-1.5zM17 16h1.5v1.5H17V16zm1.5-1.5H20V16h-1.5v-1.5zm0 3H20V19h-1.5v-1.5zM22 13h-2v2h2v-2z" },
    { id: SCREENS.FOREST, label: "森林",   path: "M12 2L6 10h3l-3 6h4l-2 6 10-8h-4l3-4h-5z" },
    { id: SCREENS.ACCOUNT,label: "我的",   path: "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 58,
      background: "var(--color-background-primary)", borderTop: "1px solid var(--color-border-tertiary)",
      display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 10,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={screen === t.id ? "#0F6E56" : "var(--color-text-tertiary)"}>
            <path d={t.path}/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 500, color: screen === t.id ? "#0F6E56" : "var(--color-text-tertiary)" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── LOGIN ── */
function LoginScreen({ onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handle = () => {
    if (id.trim() && pw.trim()) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1800); }
  };

  return (
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
          background: "linear-gradient(135deg, #085041, #1D9E75)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <TreeSVG size={40} color="#E1F5EE" delay={0}/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>iFJU</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>智慧減量循環系統</div>
      </div>

      <div style={{ animation: err ? "shake 0.35s" : "none" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>學號 / 教職員工號</div>
          <input value={id} onChange={e => setId(e.target.value)}
            placeholder="例：412382042"
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
              border: `1.5px solid ${err ? "#A32D2D" : "var(--color-border-secondary)"}`,
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", outline: "none", boxSizing: "border-box",
            }}/>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>密碼</div>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="輸入密碼"
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
              border: `1.5px solid ${err ? "#A32D2D" : "var(--color-border-secondary)"}`,
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", outline: "none", boxSizing: "border-box",
            }}/>
        </div>
        {err && <div style={{ fontSize: 12, color: "#A32D2D", textAlign: "center", marginBottom: 10 }}>請輸入學號與密碼</div>}
        <button onClick={handle} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #085041, #1D9E75)",
          color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}>登入</button>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--color-text-tertiary)" }}>
        使用輔大學生帳號 SSO 登入
      </div>
      <button onClick={onLogin} style={{
        marginTop: 10, background: "none", border: "none", cursor: "pointer",
        fontSize: 11, color: "var(--color-text-tertiary)", textDecoration: "underline",
      }}>跳過（展示模式）</button>
    </div>
  );
}

/* ── HOME ── */
function HomeScreen({ setScreen, treeCount }) {
  return (
    <div style={{ padding: "16px 14px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>早安，陳丹琳</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>今日校園永續快報</div>
        </div>
        <button onClick={() => setScreen(SCREENS.ACCOUNT)} style={{
          width: 38, height: 38, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #085041, #1D9E75)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </button>
      </div>

      <div style={{
        background: "linear-gradient(135deg,#085041,#1D9E75)", borderRadius: 14,
        padding: "16px 18px", marginBottom: 14, color: "#E1F5EE",
      }}>
        <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 10 }}>今日校園減碳成果</div>
        <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
          {[["12.3 kg","CO2 減量"],["847 件","回收件數"],[treeCount+" 棵","我的森林"]].map(([v,l],i)=>(
            <div key={i}><div style={{fontSize:22,fontWeight:500,color:"#fff"}}>{v}</div><div style={{fontSize:10,opacity:0.7,marginTop:2}}>{l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { title:"找最近的桶", sub:"即時GPS導航", s:SCREENS.MAP, path:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" },
          { title:"掃碼投遞", sub:"賺積分種樹", s:SCREENS.SCAN, path:"M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5z" },
          { title:"我的森林", sub:treeCount+"棵樹成長中", s:SCREENS.FOREST, path:"M12 2L6 10h3l-3 6h4l-2 6 10-8h-4l3-4h-5z" },
          { title:"排行榜", sub:"班級永續比拼", s:SCREENS.LEADERBOARD, path:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
        ].map((item,i)=>(
          <button key={i} onClick={()=>item.s&&setScreen(item.s)} style={{
            background:"var(--color-background-secondary)",border:"1px solid var(--color-border-tertiary)",
            borderRadius:12,padding:"14px 12px",cursor:"pointer",textAlign:"left",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0F6E56" style={{marginBottom:4}}><path d={item.path}/></svg>
            <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{item.title}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{item.sub}</div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
          <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>站點即時狀態</div>
          <button onClick={()=>setScreen(SCREENS.ANOMALY)} style={{fontSize:11,color:"#7B4FBF",background:"#F3EEFF",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>
            異常警示 {anomalyLog.filter(a=>a.level==="緊急").length} 則
          </button>
        </div>
        {binData.slice(0,4).map(b=>(
          <div key={b.id} onClick={()=>setScreen(SCREENS.MAP)} style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 12px",marginBottom:6,cursor:"pointer",
            background:"var(--color-background-secondary)",borderRadius:10,
            border:"1px solid var(--color-border-tertiary)",
          }}>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{b.name}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{b.type} · 上次壓縮 {b.compressed}</div>
            </div>
            <span style={{fontSize:12,fontWeight:500,color:statusColor(b.status),background:statusBg(b.status),padding:"2px 8px",borderRadius:6}}>
              {b.status}
            </span>
          </div>
        ))}
      </div>

      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,border:"1px solid var(--color-border-tertiary)"}}>
        <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:6}}>永續小提醒</div>
        <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>
          今天你使用了一次性飲料杯嗎？自帶環保杯減碳效果比回收高 4 倍！源頭減量才是核心。
        </div>
      </div>
    </div>
  );
}

/* ── MAP ── */
function MapScreen() {
  const [selected, setSelected] = useState(null);
  const [nav, setNav] = useState(false);
  return (
    <div style={{padding:"0 0 70px"}}>
      <div style={{padding:"12px 14px 8px"}}>
        <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)"}}>校園智慧桶地圖</div>
        <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>GPS 即時定位 · 點擊站點查看感測數據</div>
      </div>

      <div style={{margin:"0 14px",height:280,borderRadius:14,position:"relative",overflow:"hidden",background:"#E1F5EE",border:"1px solid var(--color-border-tertiary)"}}>
        <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%"}}>
          {[["宿舍區",15,10,20,15],["進修部",40,8,25,12],["學餐",50,45,22,18],["圖書館",22,55,20,18],["體育館",65,30,22,18],["文德樓",35,72,18,14]].map(([n,x,y,w,h])=>(
            <g key={n}><rect x={x} y={y} width={w} height={h} rx="2" fill="#5DCAA5" opacity="0.25" stroke="#1D9E75" strokeWidth="0.3"/>
            <text x={x+w/2} y={y+h/2+1} textAnchor="middle" fontSize="3" fill="#085041">{n}</text></g>
          ))}
          {binData.map(b=>(
            <g key={b.id} onClick={()=>setSelected(b)} style={{cursor:"pointer"}}>
              <circle cx={b.x} cy={b.y} r={selected?.id===b.id?4.5:3.5} fill={capColor(b.capacity)} opacity={0.9} stroke="#fff" strokeWidth={selected?.id===b.id?1:0.5}/>
              <text x={b.x} y={b.y+0.8} textAnchor="middle" fontSize="2.5" fill="#fff" fontWeight="bold">{b.capacity}</text>
            </g>
          ))}
          <circle cx="48" cy="38" r="2" fill="#3B8BD4" opacity="0.9" stroke="#fff" strokeWidth="0.5"/>
          <circle cx="48" cy="38" r="5" fill="none" stroke="#3B8BD4" strokeWidth="0.4" opacity="0.4"/>
          <text x="48" y="33.5" textAnchor="middle" fontSize="2.5" fill="#3B8BD4">你的位置</text>
        </svg>
      </div>

      <div style={{display:"flex",gap:8,margin:"8px 14px",flexWrap:"wrap"}}>
        {[["#0F6E56","#E1F5EE","充裕 <40%"],["#BA7517","#FAEEDA","適中 40-70%"],["#A32D2D","#FCEBEB","滿載 >70%"]].map(([c,bg,l],i)=>(
          <span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:6,color:c,background:bg}}>{l}</span>
        ))}
      </div>

      {selected && (
        <div style={{margin:"6px 14px",padding:14,borderRadius:12,background:"var(--color-background-secondary)",border:"1px solid var(--color-border-tertiary)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
            <div>
              <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)"}}>{selected.name}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{selected.type} · 壓縮時間：{selected.compressed}</div>
            </div>
            <span style={{fontSize:11,fontWeight:500,padding:"3px 8px",borderRadius:6,color:statusColor(selected.status),background:statusBg(selected.status)}}>{selected.status}</span>
          </div>

          {/* Sensor data grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
            {[
              ["桶內容量",selected.capacity+"%",capColor(selected.capacity)],
              ["異味指數",selected.smell,selected.smell>50?"#7B4FBF":"#0F6E56"],
              ["重量",selected.weight+" kg","#0F6E56"],
              ["投入次數",selected.opens+" 次","#0F6E56"],
              ["類型",selected.type,"#333"],
              ["GPS","已定位","#3B8BD4"],
            ].map(([label,val,col],i)=>(
              <div key={i} style={{background:"var(--color-background-primary)",borderRadius:8,padding:"8px 6px",textAlign:"center",border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:10,color:"var(--color-text-secondary)",marginBottom:2}}>{label}</div>
                <div style={{fontSize:13,fontWeight:500,color:col}}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{height:8,borderRadius:4,background:"var(--color-border-tertiary)",marginBottom:12,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:4,width:`${selected.capacity}%`,background:capColor(selected.capacity),transition:"width 0.4s"}}/>
          </div>

          {!nav
            ? <button onClick={()=>setNav(true)} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"none",background:"#0F6E56",color:"#E1F5EE",fontSize:14,fontWeight:500,cursor:"pointer"}}>
                {selected.capacity>=70?"已滿 — 導航至最近可用站點":"開始 GPS 導航"}
              </button>
            : <div style={{textAlign:"center"}}>
                <div style={{fontSize:13,color:"#0F6E56",fontWeight:500,marginBottom:6}}>導航中...預計步行 2 分鐘</div>
                <button onClick={()=>setNav(false)} style={{padding:"8px 20px",borderRadius:8,border:"1px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-secondary)",fontSize:12,cursor:"pointer"}}>取消導航</button>
              </div>
          }
        </div>
      )}
      {!selected && <div style={{margin:"8px 14px",fontSize:12,color:"var(--color-text-secondary)",textAlign:"center"}}>點擊地圖站點查看感測數據</div>}
    </div>
  );
}

/* ── SCAN ── */
function StepBar({ active }) {
  const steps = ["掃碼","分類","完成"];
  return (
    <div style={{display:"flex",alignItems:"flex-start",marginBottom:18}}>
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"flex-start",flex:i<2?1:"0 0 auto"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,
              background:i<=active?"#0F6E56":"var(--color-background-secondary)",
              color:i<=active?"#fff":"var(--color-text-tertiary)",
              border:`1.5px solid ${i<=active?"#0F6E56":"var(--color-border-secondary)"}`}}>
              {i<active?"✓":i+1}
            </div>
            <span style={{fontSize:10,color:i<=active?"#0F6E56":"var(--color-text-tertiary)"}}>{s}</span>
          </div>
          {i<2 && <div style={{flex:1,height:2,marginTop:10,background:i<active?"#0F6E56":"var(--color-border-tertiary)"}}/>}
        </div>
      ))}
    </div>
  );
}

function ScanScreen({ onDeposit, setScreen }) {
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [cat, setCat] = useState(null);
  const station = "學餐周邊站";

  const categories = [
    { id:"plastic", name:"塑膠類", desc:"寶特瓶、塑膠袋、容器", pts:5, trees:1 },
    { id:"paper",   name:"紙類",   desc:"報紙、紙箱、紙袋",   pts:4, trees:1 },
    { id:"metal",   name:"金屬類", desc:"鋁罐、鐵罐、金屬容器", pts:6, trees:2 },
    { id:"food",    name:"廚餘",   desc:"剩飯、果皮、菜葉",   pts:3, trees:1 },
    { id:"general", name:"一般垃圾",desc:"衛生紙、免洗餐具",   pts:1, trees:0 },
  ];

  const handleScan = () => { setScanning(true); setTimeout(()=>{ setScanning(false); setStep(1); }, 1200); };

  if (step===0) return (
    <div style={{padding:"16px 14px 70px"}}>
      <style>{`@keyframes scanLine{0%{top:10%}50%{top:86%}100%{top:10%}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <StepBar active={0}/>
      <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>掃碼投遞</div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:16}}>{scanning?"掃描中，正在連接智慧桶…":"對準智慧桶 QR Code 掃碼"}</div>
      <div style={{position:"relative",height:180,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"var(--color-background-secondary)",border:`2px ${scanning?"solid #1D9E75":"dashed var(--color-border-secondary)"}`,flexDirection:"column",gap:10,marginBottom:20}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-text-tertiary)" opacity={scanning?0.25:0.4}>
          <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-5 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zM17 13h1.5v1.5H17V13z"/>
        </svg>
        {scanning
          ? <>
              <div style={{position:"absolute",left:"10%",right:"10%",height:2,background:"#1D9E75",boxShadow:"0 0 8px #1D9E75",animation:"scanLine 1.2s ease-in-out infinite"}}/>
              <div style={{width:22,height:22,borderRadius:"50%",border:"2.5px solid #cbe8dc",borderTopColor:"#0F6E56",animation:"spin 0.7s linear infinite"}}/>
            </>
          : <button onClick={handleScan} style={{padding:"10px 28px",borderRadius:10,border:"none",background:"#0F6E56",color:"#E1F5EE",fontSize:14,fontWeight:500,cursor:"pointer"}}>模擬掃碼</button>
        }
      </div>
      <div style={{background:"#E1F5EE",borderRadius:12,padding:"12px 14px",display:"flex",gap:8,alignItems:"flex-start"}}>
        <span style={{fontSize:15}}>💡</span>
        <div style={{fontSize:12,color:"#085041",lineHeight:1.6}}>丟對分類最多可 <b>+6 分、種 2 棵樹</b>；感測器會自動辨識重量與分類，丟錯會被擋下喔。</div>
      </div>
    </div>
  );

  if (step===1) return (
    <div style={{padding:"16px 14px 70px"}}>
      <StepBar active={1}/>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#1D9E75",boxShadow:"0 0 0 3px rgba(29,158,117,0.2)"}}/>
        <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)"}}>已連接：{station}</div>
      </div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:16}}>選擇投遞分類</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {categories.map(c=>(
          <button key={c.id} onClick={()=>{setCat(c);setStep(2);if(c.trees>0)onDeposit(c.trees);}} style={{
            display:"flex",alignItems:"center",gap:12,padding:"14px 12px",
            background:"var(--color-background-secondary)",border:"1px solid var(--color-border-tertiary)",
            borderRadius:12,cursor:"pointer",textAlign:"left",
          }}>
            <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,background:"#E1F5EE"}}>
              {c.trees>0?<TreeSVG size={26} color="#2d8a4e" stage={3} fruit delay={0}/>:
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#888"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{c.name}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{c.desc}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,color:"#0F6E56",fontWeight:500}}>+{c.pts}分</div>
              {c.trees>0&&<div style={{fontSize:10,color:"#48b068"}}>+{c.trees}棵</div>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={()=>setStep(0)} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"1px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-secondary)",fontSize:13,cursor:"pointer"}}>重新掃碼</button>
    </div>
  );

  return (
    <div style={{padding:"16px 14px 70px",textAlign:"center"}}>
      <StepBar active={2}/>
      {cat?.trees>0?(
        <div style={{margin:"24px auto 10px",position:"relative",width:120,height:120}}>
          <div style={{animation:"treeGrow 0.8s ease-out forwards"}}><TreeSVG size={100} color="#2d8a4e" stage={3} fruit delay={0}/></div>
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{position:"absolute",top:10+Math.sin(i*1.05)*40,left:20+Math.cos(i*1.05)*45,width:6,height:6,borderRadius:"50%",background:["#FFD700","#48b068","#87CEEB","#FFD700","#48b068","#87CEEB"][i],animation:`sparkle 1s ease-in-out ${0.2+i*0.15}s infinite`}}/>
          ))}
        </div>
      ):(
        <div style={{width:80,height:80,borderRadius:"50%",margin:"24px auto 10px",background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#0F6E56"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
      )}
      <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>投遞成功！</div>
      {cat?.trees>0&&<div style={{fontSize:15,color:"#0F6E56",fontWeight:500,marginBottom:4}}>你的森林新增了 {cat.trees} 棵樹！</div>}
      <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:20}}>{cat?.name} 已投入{station}</div>
      <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:20}}>
        {[["#E1F5EE","#085041","+"+cat?.pts,"永續積分"],["#E6F1FB","#0C447C","-0.18","kg CO2"],...(cat?.trees>0?[["#E8F5E9","#1b5e20","+"+cat?.trees,"棵樹"]]:[] )].map(([bg,c,v,l],i)=>(
          <div key={i} style={{background:bg,borderRadius:12,padding:"12px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:500,color:c}}>{v}</div>
            <div style={{fontSize:11,color:c,opacity:0.7}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,border:"1px solid var(--color-border-tertiary)",textAlign:"left",marginBottom:16}}>
        <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>自帶環保杯比回收一次性杯子減少 4 倍碳排放。下次試試源頭減量！</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{setCat(null);setStep(1);}} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",background:"#0F6E56",color:"#E1F5EE",fontSize:14,fontWeight:500,cursor:"pointer"}}>在此桶繼續投遞</button>
        <button onClick={()=>setScreen(SCREENS.FOREST)} style={{padding:"10px 16px",borderRadius:10,border:"1px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"#0F6E56",fontSize:13,fontWeight:500,cursor:"pointer"}}>查看森林</button>
      </div>
    </div>
  );
}

/* ── FOREST ── */
function ForestScreen({ treeCount, totalCo2 }) {
  const colors = ["#2d8a4e","#3a9e5c","#1f7a3d","#48b068","#267842","#35944f"];
  // 依種樹時間分成長階段：最新的 3 棵=幼苗，再 4 棵=成長中，其餘=成熟
  const stageOf = (i) => { const fromEnd = treeCount - i; return fromEnd <= 3 ? 1 : fromEnd <= 7 ? 2 : 3; };
  const sizeOf = (s) => s === 1 ? 28 : s === 2 ? 38 : 48;
  const trees = Array.from({length:treeCount},(_,i)=>{ const stage = stageOf(i); return { id:i, color:colors[i%colors.length], stage, size:sizeOf(stage) }; });
  const matureCount = trees.filter(t=>t.stage===3).length;
  const growingCount = trees.filter(t=>t.stage===2).length;
  const saplingCount = trees.filter(t=>t.stage===1).length;
  const next = Math.ceil(treeCount/10)*10;
  // 等距島嶼上的植栽佈局（2.5D iso grid + 深度排序）
  const COLS=5, ROWS=5, ISO_CX=175, ISO_TOP=92, HW=28, HV=13;
  const isoSize = (s)=> s===1?22 : s===2?30 : 40;
  const species = ["apple","cherry","pine"];
  const placed = Array.from({length:Math.min(treeCount,COLS*ROWS)},(_,k)=>{
    const gx=k%COLS, gy=Math.floor(k/COLS);
    return { k, gx, gy, stage:stageOf(k), species:species[k%species.length],
      px:ISO_CX+(gx-gy)*HW, py:ISO_TOP+(gx+gy)*HV, depth:gx+gy };
  }).sort((a,b)=> a.depth-b.depth || a.gx-b.gx);
  const renderPlant = (p)=>{
    const sz=isoSize(p.stage), d=Math.min(p.k*0.04,0.8);
    if (p.stage!==3) return <TreeSVG size={sz} color="#3a9e5c" stage={p.stage} fruit delay={d}/>;
    if (p.species==="pine") return <PineTree size={sz+6} delay={d}/>;
    if (p.species==="cherry") return <TreeSVG size={sz} color="#F4C6DD" stage={3} fruit blossom delay={d}/>;
    return <TreeSVG size={sz} color="#2d8a4e" stage={3} fruit delay={d}/>;
  };
  // 最近種樹紀錄（最新在上）
  const plantings = [
    { date:"今天",  action:"回收塑膠類 x2", trees:2, co2:0.36, stage:1 },
    { date:"昨天",  action:"回收寶特瓶 x3", trees:3, co2:0.54, stage:1 },
    { date:"5/14", action:"廚餘分類投遞",   trees:1, co2:0.18, stage:2 },
    { date:"5/12", action:"回收紙類 x5",     trees:5, co2:0.90, stage:2 },
    { date:"5/9",  action:"回收鋁罐 x2",     trees:2, co2:0.30, stage:3 },
  ];
  return (
    <div style={{padding:"16px 14px 70px"}}>
      <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)",marginBottom:2}}>我的永續森林</div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:14}}>每次回收投遞，都為校園種下一棵樹</div>

      <div style={{background:"linear-gradient(135deg,#085041,#1D9E75)",borderRadius:14,padding:"14px 16px",marginBottom:14,color:"#E1F5EE",display:"flex",justifyContent:"space-between",textAlign:"center"}}>
        {[[treeCount,"已種樹木"],[totalCo2.toFixed(1),"kg CO2 減量"],[next-treeCount,"距下個里程碑"]].map(([v,l],i)=>(
          <div key={i}><div style={{fontSize:26,fontWeight:500,color:"#fff"}}>{v}</div><div style={{fontSize:10,opacity:0.7}}>{l}</div></div>
        ))}
      </div>

      <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 12px",border:"1px solid var(--color-border-tertiary)",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
          <span style={{color:"var(--color-text-primary)",fontWeight:500}}>里程碑進度</span>
          <span style={{color:"#0F6E56"}}>{treeCount} / {next} 棵</span>
        </div>
        <div style={{height:8,borderRadius:4,background:"var(--color-border-tertiary)",overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#1D9E75,#48b068)",width:`${(treeCount/next)*100}%`,transition:"width 0.5s"}}/>
        </div>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:6}}>再種 {next-treeCount} 棵解鎖下個徽章</div>
      </div>

      {/* 成長階段圖例 */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {[["幼苗",saplingCount,1,28],["成長中",growingCount,2,32],["成熟",matureCount,3,38]].map(([label,count,stage,boxH],i)=>(
          <div key={i} style={{flex:1,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-secondary)",borderRadius:10,padding:"8px 10px",border:"1px solid var(--color-border-tertiary)"}}>
            <div style={{width:24,height:boxH,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
              <TreeSVG size={boxH} color="#2d8a4e" stage={stage} fruit delay={0}/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>{count}</div>
              <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(180deg,#cdeffa 0%,#dff5ef 55%,#eaf7ec 100%)",borderRadius:14,border:"1px solid #cfe6d4",marginBottom:14,paddingTop:8}}>
        {/* 太陽 + 雲 */}
        <div style={{position:"absolute",top:14,right:20,width:26,height:26,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#FFE680,#FDB44B)",boxShadow:"0 0 14px rgba(253,180,75,0.5)"}}/>
        <div style={{position:"absolute",top:22,left:24,width:30,height:9,borderRadius:9,background:"#fff",opacity:0.9}}/>
        <div style={{position:"absolute",top:16,left:32,width:16,height:12,borderRadius:8,background:"#fff",opacity:0.9}}/>
        {/* 標題 */}
        <div style={{position:"relative",textAlign:"center",fontSize:12,fontWeight:600,color:"#1b5e20",zIndex:5}}>🌳 輔大永續島 — {treeCount} 棵樹</div>
        {/* 等距漂浮島 */}
        <div style={{position:"relative",width:"100%",aspectRatio:"350 / 250"}}>
          <svg viewBox="0 0 350 250" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}}>
            {/* 土壤側面 */}
            <polygon points="38,140 175,210 175,240 38,170" fill="#7A5230"/>
            <polygon points="312,140 175,210 175,240 312,170" fill="#5E3F25"/>
            <polygon points="38,140 175,210 175,240 38,170" fill="#000" opacity="0.05"/>
            {/* 草地頂面 */}
            <polygon points="175,70 312,140 175,210 38,140" fill="#9ED66E"/>
            <polygon points="175,70 312,140 175,210 38,140" fill="url(#g)" opacity="0.0"/>
            <polygon points="175,70 175,210 38,140" fill="#000" opacity="0.04"/>
            {/* 草地邊緣亮線 */}
            <polyline points="38,140 175,70 312,140" fill="none" stroke="#B6E88A" strokeWidth="3"/>
          </svg>
          {/* 植栽（深度排序疊放） */}
          {placed.map(p=>{
            const sz=isoSize(p.stage);
            return (
              <div key={p.k} style={{position:"absolute",left:`${p.px/350*100}%`,top:`${p.py/250*100}%`,transform:"translate(-50%,-100%)",zIndex:10+p.depth}}>
                <div style={{position:"relative"}}>
                  {renderPlant(p)}
                  <div style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:sz*0.55,height:sz*0.16,borderRadius:"50%",background:"rgba(0,0,0,0.16)",zIndex:-1}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近種樹時間軸 */}
      <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>最近種樹紀錄</div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:13,top:6,bottom:6,width:2,background:"var(--color-border-tertiary)"}}/>
        {plantings.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,position:"relative"}}>
            <div style={{flexShrink:0,width:28,height:28,borderRadius:"50%",background:"var(--color-background-secondary)",border:"2px solid #1D9E75",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>
              <TreeSVG size={20} color="#2d8a4e" stage={p.stage} delay={0}/>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--color-background-secondary)",borderRadius:10,padding:"10px 12px",border:"1px solid var(--color-border-tertiary)"}}>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{p.action}</div>
                <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{p.date} · 減碳 {p.co2.toFixed(2)} kg</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                <TreeSVG size={16} color="#48b068" stage={1} delay={0}/>
                <span style={{fontSize:13,fontWeight:600,color:"#0F6E56"}}>+{p.trees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LEADERBOARD ── */
function LeaderboardScreen() {
  const [tab, setTab] = useState("個人");
  return (
    <div style={{padding:"16px 14px 70px"}}>
      <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)",marginBottom:14}}>永續排行榜</div>

      <div style={{display:"flex",background:"var(--color-background-secondary)",borderRadius:10,padding:3,marginBottom:16,border:"1px solid var(--color-border-tertiary)"}}>
        {["個人","班級"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,
            background:tab===t?"#0F6E56":"transparent",
            color:tab===t?"#fff":"var(--color-text-secondary)",transition:"all 0.2s",
          }}>{t}排行</button>
        ))}
      </div>

      {tab==="個人" && (
        <>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            {leaderboard.slice(0,3).map((p,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",padding:"12px 6px",background:["#FFF8E7","#F5F5F5","#FFF3EC"][i],borderRadius:12,margin:"0 3px",border:`1px solid ${["#F5C430","#C0C0C0","#CD7F32"][i]}30`}}>
                <div style={{fontSize:18,marginBottom:4}}>{"🥇🥈🥉"[i]}</div>
                <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)"}}>{p.name}</div>
                <div style={{fontSize:10,color:"var(--color-text-secondary)",marginTop:2}}>{p.trees} 棵</div>
              </div>
            ))}
          </div>
          {leaderboard.map(p=>(
            <div key={p.rank} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:6,borderRadius:10,
              background:p.isMe?"#E1F5EE":"var(--color-background-secondary)",
              border:`1px solid ${p.isMe?"#1D9E75":"var(--color-border-tertiary)"}`,
            }}>
              <div style={{width:24,textAlign:"center",fontSize:13,fontWeight:600,color:p.rank<=3?"#BA7517":"var(--color-text-secondary)"}}>{p.rank}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:p.isMe?600:400,color:"var(--color-text-primary)"}}>{p.name}{p.isMe&&" (我)"}</div>
                <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{p.dept}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,fontWeight:500,color:"#0F6E56"}}>{p.trees} 棵</div>
                <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{p.pts} 分</div>
              </div>
            </div>
          ))}
        </>
      )}

      {tab==="班級" && (
        <>{classBoard.map(c=>(
          <div key={c.rank} style={{
            display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:8,borderRadius:10,
            background:c.isMe?"#E1F5EE":"var(--color-background-secondary)",
            border:`1px solid ${c.isMe?"#1D9E75":"var(--color-border-tertiary)"}`,
          }}>
            <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:c.isMe?"#0F6E56":"var(--color-border-secondary)",color:c.isMe?"#fff":"var(--color-text-secondary)",fontSize:12,fontWeight:600}}>
              {c.rank<=3?["🥇","🥈","🥉"][c.rank-1]:c.rank}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{c.name}{c.isMe&&" ✦"}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{c.pts.toLocaleString()} 積分</div>
            </div>
            <div style={{textAlign:"right",fontSize:13,fontWeight:500,color:"#0F6E56"}}>{c.trees.toLocaleString()} 棵</div>
          </div>
        ))}</>
      )}
    </div>
  );
}

/* ── ANOMALY ── */
function AnomalyScreen() {
  const lvColor = {"緊急":"#A32D2D","警告":"#BA7517","資訊":"#3B8BD4"};
  const lvBg    = {"緊急":"#FCEBEB","警告":"#FAEEDA","資訊":"#E6F1FB"};
  return (
    <div style={{padding:"16px 14px 70px"}}>
      <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>異常偵測 · 維運紀錄</div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:16}}>感測器即時回報 · 故障 / 清運 / 異味警示</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[["緊急","1"],["警告","2"],["正常","3"]].map(([l,n],i)=>(
          <div key={i} style={{background:["#FCEBEB","#FAEEDA","#E1F5EE"][i],borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:600,color:["#A32D2D","#BA7517","#0F6E56"][i]}}>{n}</div>
            <div style={{fontSize:10,color:["#A32D2D","#BA7517","#0F6E56"][i]}}>{l}警示</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>今日紀錄</div>
      {anomalyLog.map((a,i)=>(
        <div key={i} style={{padding:"12px 14px",marginBottom:8,borderRadius:10,background:"var(--color-background-secondary)",border:"1px solid var(--color-border-tertiary)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:6}}>
            <div>
              <span style={{fontSize:12,fontWeight:600,color:lvColor[a.level],background:lvBg[a.level],padding:"2px 8px",borderRadius:5,marginRight:6}}>{a.level}</span>
              <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{a.type}</span>
            </div>
            <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{a.time}</span>
          </div>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>{a.name} ({a.id})</div>
          <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{a.desc}</div>
        </div>
      ))}

      <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",margin:"16px 0 10px"}}>各站感測數據總覽</div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:12,border:"1px solid var(--color-border-tertiary)"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:4,marginBottom:6}}>
          {["站點","容量","異味","重量 kg"].map((h,i)=>(
            <div key={i} style={{fontSize:10,fontWeight:600,color:"var(--color-text-secondary)",paddingBottom:4,borderBottom:"1px solid var(--color-border-tertiary)"}}>{h}</div>
          ))}
        </div>
        {binData.map(b=>(
          <div key={b.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:4,padding:"5px 0",borderBottom:"1px solid var(--color-border-tertiary)"}}>
            <div style={{fontSize:11,color:"var(--color-text-primary)"}}>{b.name.replace("站","")}</div>
            <div style={{fontSize:11,fontWeight:500,color:capColor(b.capacity)}}>{b.capacity}%</div>
            <div style={{fontSize:11,fontWeight:500,color:b.smell>50?"#7B4FBF":"#0F6E56"}}>{b.smell}</div>
            <div style={{fontSize:11,color:"var(--color-text-primary)"}}>{b.weight}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ACCOUNT ── */
function AccountScreen({ setScreen, treeCount, totalCo2 }) {
  const [showAll, setShowAll] = useState(false);
  const hist = [
    {date:"5/7",action:"回收塑膠類 x2",pts:10,trees:2,co2:0.12},
    {date:"5/6",action:"回收寶特瓶 x3",pts:15,trees:3,co2:0.18},
    {date:"5/5",action:"廚餘分類投遞",pts:10,trees:1,co2:0.12},
    {date:"5/5",action:"回收紙類 x5",pts:20,trees:5,co2:0.25},
    {date:"5/4",action:"連續7天獎勵",pts:50,trees:0,co2:0},
    {date:"5/3",action:"回收鋁罐 x2",pts:12,trees:2,co2:0.15},
  ];
  const weekData = [{d:"一",v:3.2},{d:"二",v:2.8},{d:"三",v:4.1},{d:"四",v:3.5},{d:"五",v:5.2},{d:"六",v:1.8},{d:"日",v:1.2}];
  const maxV = Math.max(...weekData.map(d=>d.v));

  return (
    <div style={{padding:"0 0 70px"}}>
      {/* Profile header */}
      <div style={{background:"linear-gradient(135deg,#085041,#1D9E75)",padding:"24px 20px 32px",color:"#E1F5EE"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(255,255,255,0.4)"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:600,color:"#fff"}}>陳丹琳</div>
            <div style={{fontSize:12,opacity:0.8}}>企業管理學系 4A · 412382042</div>
            <div style={{fontSize:11,opacity:0.65,marginTop:2}}>加入 iFJU 第 127 天</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
          {[[treeCount,"棵樹"],[totalCo2.toFixed(1),"kg CO2"],["1,280","積分"]].map(([v,l],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 8px"}}>
              <div style={{fontSize:20,fontWeight:600,color:"#fff"}}>{v}</div>
              <div style={{fontSize:10,opacity:0.75,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"14px 14px 0"}}>
        {/* Badges */}
        <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>獲得的徽章</div>
        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {[["🌱","環保新芽","10棵樹","done"],["🌿","綠色守護者","20棵樹","done"],["🌲","森林大使","50棵樹","done"],["🏆","永續英雄","100棵樹","lock"]].map((b,i)=>(
            <div key={i} style={{flexShrink:0,textAlign:"center",padding:"10px 12px",borderRadius:10,background:b[3]==="done"?"#E1F5EE":"var(--color-background-secondary)",border:`1px solid ${b[3]==="done"?"#1D9E75":"var(--color-border-tertiary)"}`,opacity:b[3]==="lock"?0.5:1}}>
              <div style={{fontSize:20,marginBottom:2}}>{b[0]}</div>
              <div style={{fontSize:11,fontWeight:500,color:b[3]==="done"?"#0F6E56":"var(--color-text-secondary)"}}>{b[1]}</div>
              <div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>{b[2]}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,border:"1px solid var(--color-border-tertiary)",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>本週減碳紀錄 (kg CO2)</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
            {weekData.map((d,i)=>(
              <div key={i} style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:9,color:"var(--color-text-secondary)",marginBottom:2}}>{d.v}</div>
                <div style={{height:`${(d.v/maxV)*80}px`,borderRadius:"4px 4px 0 0",background:i===4?"#0F6E56":"#5DCAA5",transition:"height 0.3s"}}/>
                <div style={{fontSize:9,color:"var(--color-text-tertiary)",marginTop:3}}>{d.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recycling breakdown */}
        <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:14,border:"1px solid var(--color-border-tertiary)",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>回收分類比例</div>
          {[["塑膠類",38,"#1D9E75"],["紙類",28,"#378ADD"],["金屬類",18,"#EF9F27"],["廚餘",12,"#D85A30"],["一般垃圾",4,"#888"]].map((c,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                <span style={{color:"var(--color-text-primary)"}}>{c[0]}</span>
                <span style={{color:"var(--color-text-secondary)"}}>{c[1]}%</span>
              </div>
              <div style={{height:6,borderRadius:3,background:"var(--color-border-tertiary)"}}>
                <div style={{height:"100%",width:`${c[1]}%`,borderRadius:3,background:c[2]}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Points history */}
        <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>投遞紀錄</span>
          <button onClick={()=>setShowAll(!showAll)} style={{fontSize:11,color:"#0F6E56",background:"none",border:"none",cursor:"pointer"}}>{showAll?"收起":"查看全部"}</button>
        </div>
        {(showAll?hist:hist.slice(0,3)).map((h,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",marginBottom:4,borderRadius:8,background:"var(--color-background-secondary)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {h.trees>0&&<TreeSVG size={22} color="#2d8a4e" delay={0}/>}
              <div>
                <div style={{fontSize:13,color:"var(--color-text-primary)"}}>{h.action}</div>
                <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{h.date}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,fontWeight:500,color:"#0F6E56"}}>+{h.pts}</div>
              {h.co2>0&&<div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>-{h.co2}kg</div>}
            </div>
          </div>
        ))}

        {/* Rewards */}
        <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",margin:"16px 0 8px"}}>積分兌換</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[["一粒麥咖啡折 $10",50],["環保杯折扣 $20",100],["學餐優惠券 $15",80],["服務學習認證 1hr",200]].map((r,i)=>(
            <div key={i} style={{background:"var(--color-background-secondary)",borderRadius:10,padding:12,border:"1px solid var(--color-border-tertiary)",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>{r[0]}</div>
              <div style={{fontSize:11,color:"#085041",background:"#E1F5EE",padding:"2px 8px",borderRadius:4,display:"inline-block"}}>{r[1]} 分</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{background:"var(--color-background-secondary)",borderRadius:12,border:"1px solid var(--color-border-tertiary)",overflow:"hidden"}}>
          {["個人資料設定","通知偏好設定","隱私與數據","登出帳號"].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 14px",borderBottom:i<3?"1px solid var(--color-border-tertiary)":"none",cursor:"pointer"}}>
              <span style={{fontSize:13,color:i===3?"#A32D2D":"var(--color-text-primary)"}}>{item}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-text-tertiary)"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [treeCount, setTreeCount] = useState(14);
  const [totalCo2, setTotalCo2] = useState(8.4);

  const handleDeposit = (n) => { setTreeCount(p=>p+n); setTotalCo2(p=>p+0.18*n); };

  const handleSetScreen = (s) => {
    if (s === SCREENS.LEADERBOARD || s === SCREENS.ANOMALY) {
      setScreen(s);
    } else {
      setScreen(s);
    }
  };

  return (
    <div style={{padding:"16px 0",display:"flex",justifyContent:"center"}}>
      <style>{`
        @keyframes treeGrow{0%{transform:scale(0) translateY(20px);opacity:0}60%{transform:scale(1.15) translateY(-4px);opacity:1}100%{transform:scale(1) translateY(0);opacity:1}}
        @keyframes sparkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1)}}
      `}</style>
      <div style={{width:375,maxWidth:"100%",borderRadius:28,overflow:"hidden",border:"2px solid var(--color-border-tertiary)",position:"relative",minHeight:720,background:"var(--color-background-primary)"}}>
        <div style={{height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-background-secondary)",borderBottom:"1px solid var(--color-border-tertiary)",fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",letterSpacing:0.5}}>
          iFJU 智慧減量循環
        </div>

        <div style={{height:622,overflowY:"auto",overflowX:"hidden"}}>
          {!loggedIn
            ? <LoginScreen onLogin={()=>setLoggedIn(true)}/>
            : <>
                {screen===SCREENS.HOME        && <HomeScreen setScreen={handleSetScreen} treeCount={treeCount}/>}
                {screen===SCREENS.MAP         && <MapScreen/>}
                {screen===SCREENS.SCAN        && <ScanScreen onDeposit={handleDeposit} setScreen={setScreen}/>}
                {screen===SCREENS.FOREST      && <ForestScreen treeCount={treeCount} totalCo2={totalCo2}/>}
                {screen===SCREENS.ACCOUNT     && <AccountScreen setScreen={setScreen} treeCount={treeCount} totalCo2={totalCo2}/>}
                {screen===SCREENS.LEADERBOARD && <LeaderboardScreen/>}
                {screen===SCREENS.ANOMALY     && <AnomalyScreen/>}
              </>
          }
        </div>

        {loggedIn && <NavBar screen={screen} setScreen={setScreen}/>}
      </div>
    </div>
  );
}