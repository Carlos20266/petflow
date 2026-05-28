import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { PawPrint, LayoutDashboard, Users, ClipboardList, Settings, Target, LogOut } from 'lucide-react';
import './style.css';

const initialA = ['125','307','412','089','221','154','991','402','218','330','715','644','099','180','276','510','888','431','609','711','804','932'];
const initialB = ['501','114','720','333','908','612','447','155','290','781','063','388','419','530','601','712','845','930','102','245','376','489'];
const initialPeople = [
  {id:1,nome:'Bruna',equipe:'Equipe A',senha:'1234',fixo:false,falta:false},
  {id:2,nome:'Dayane',equipe:'Equipe B',senha:'1234',fixo:false,falta:false},
  {id:3,nome:'Poliana',equipe:'Equipe A',senha:'1234',fixo:true,falta:false},
  {id:4,nome:'Lidiane',equipe:'Equipe B',senha:'1234',fixo:false,falta:false},
  {id:5,nome:'Janiele',equipe:'Equipe A',senha:'1234',fixo:false,falta:true},
];

function App(){
  const [logged,setLogged]=useState(false);
  const [tab,setTab]=useState('inicio');
  const [dia,setDia]=useState(1);
  const [ladoA,setLadoA]=useState(initialA);
  const [ladoB,setLadoB]=useState(initialB);
  const [pessoas,setPessoas]=useState(initialPeople);
  const [meta,setMeta]=useState({meta:5000, realizado:3200});
  const [dash,setDash]=useState({ativos:21,faltas:2,fixos:3,bancadas:44});
  const [novo,setNovo]=useState({nome:'', equipe:'Equipe A', senha:'1234'});
  const [senha,setSenha]=useState({nome:'Bruna', nova:''});
  const [bancada,setBancada]=useState({lado:'A', numero:''});

  const equipeA = pessoas.filter(p=>p.equipe==='Equipe A');
  const equipeB = pessoas.filter(p=>p.equipe==='Equipe B');
  const progresso = Math.min(100, meta.meta ? Math.round(meta.realizado/meta.meta*100) : 0);
  const faltam = Math.max(meta.meta-meta.realizado,0);

  function rodarDia(){ setDia(d=>d+1); }
  function addPessoa(){ if(!novo.nome.trim()) return; setPessoas([...pessoas,{id:Date.now(),...novo,fixo:false,falta:false}]); setNovo({nome:'',equipe:'Equipe A',senha:'1234'}); }
  function toggle(id,key){ setPessoas(pessoas.map(p=>p.id===id?{...p,[key]:!p[key]}:p)); }
  function addBancada(){ if(!bancada.numero.trim()) return; bancada.lado==='A'?setLadoA([...ladoA,bancada.numero]):setLadoB([...ladoB,bancada.numero]); setBancada({lado:'A',numero:''}); setDash({...dash,bancadas:ladoA.length+ladoB.length+1}); }
  function alterarSenha(){ setPessoas(pessoas.map(p=>p.nome===senha.nome?{...p,senha:senha.nova||p.senha}:p)); setSenha({...senha,nova:''}); alert('Senha alterada com sucesso.'); }

  if(!logged) return <Login onLogin={()=>setLogged(true)}/>;
  return <div className="app">
    <header><div><h1><PawPrint/> PETFLOW V6</h1><p><b>Lideranças:</b> Flavia Trindade / José Ivanilson<br/><b>Apoio:</b> Carlos / Francisca</p></div><button className="ghost" onClick={()=>setLogged(false)}><LogOut size={16}/> sair</button></header>
    {tab==='inicio'&&<section><Card title="Dashboard Operacional"><div className="grid"><Kpi label="Ativos" value={dash.ativos}/><Kpi label="Faltas" value={dash.faltas}/><Kpi label="Fixos" value={dash.fixos}/><Kpi label="Bancadas" value={dash.bancadas}/></div><p><b>Rodízio diário:</b> 00:00</p><p><b>Troca semanal:</b> Domingo 23:59</p><button className="primary" onClick={rodarDia}>Simular próximo dia</button></Card><Card title="Meta Geral do Dia"><b>Meta:</b> {meta.meta} pedidos<br/><b>Realizado:</b> {meta.realizado}<br/><b>Faltam:</b> {faltam}<div className="progress"><span style={{width:progresso+'%'}}>{progresso}%</span></div></Card></section>}
    {tab==='escala'&&<Card title={`Escala do Dia • Dia ${dia}`}><table><thead><tr><th>Lado A</th><th>Lado B</th></tr></thead><tbody>{Array.from({length:22}).map((_,i)=><tr key={i}><td>{ladoA[i]} — {equipeA[i]?.falta?'VAZIO':equipeA[i]?.nome||'VAZIO'}</td><td>{ladoB[i]} — {equipeB[i]?.falta?'VAZIO':equipeB[i]?.nome||'VAZIO'}</td></tr>)}</tbody></table></Card>}
    {tab==='dados'&&<Card title="Dados / Meta Operacional"><label>Meta geral</label><input value={meta.meta} onChange={e=>setMeta({...meta,meta:+e.target.value})}/><label>Realizado</label><input value={meta.realizado} onChange={e=>setMeta({...meta,realizado:+e.target.value})}/><div className="notice">Liderança e apoio podem preencher esses dados durante o dia.</div></Card>}
    {tab==='equipe'&&<Card title="Cadastro de Colaboradores"><input placeholder="Nome" value={novo.nome} onChange={e=>setNovo({...novo,nome:e.target.value})}/><select value={novo.equipe} onChange={e=>setNovo({...novo,equipe:e.target.value})}><option>Equipe A</option><option>Equipe B</option></select><input placeholder="Senha inicial" value={novo.senha} onChange={e=>setNovo({...novo,senha:e.target.value})}/><button className="primary" onClick={addPessoa}>Adicionar</button><table><tbody>{pessoas.map(p=><tr key={p.id}><td><b>{p.nome}</b><br/><small>{p.equipe} {p.fixo?'• FIXO':''}</small></td><td><button onClick={()=>toggle(p.id,'falta')}>Falta</button></td><td><button onClick={()=>toggle(p.id,'fixo')}>Fixo</button></td></tr>)}</tbody></table></Card>}
    {tab==='bancadas'&&<section><Card title="Gestão de Bancadas"><input placeholder="Número da bancada" value={bancada.numero} onChange={e=>setBancada({...bancada,numero:e.target.value})}/><select value={bancada.lado} onChange={e=>setBancada({...bancada,lado:e.target.value})}><option>A</option><option>B</option></select><button className="primary" onClick={addBancada}>Inserir bancada</button></Card><Card title="Lado A">{ladoA.map((b,i)=>
  <p key={b}>
    {i+1}º — {b}
    <button
      onClick={() => setLadoA(ladoA.filter(x => x !== b))}
      style={{
        marginLeft:'10px',
        background:'red',
        color:'#fff',
        border:'none',
        borderRadius:'5px',
        cursor:'pointer'
      }}
    >
      X
    </button>
  </p>
)}</Card><Card title="Lado B">{ladoB.map((b,i)=>
  <p key={b}>
    {i+1}º — {b}
    <button
      onClick={() => setLadoB(ladoB.filter(x => x !== b))}
      style={{
        marginLeft:'10px',
        background:'red',
        color:'#fff',
        border:'none',
        borderRadius:'5px',
        cursor:'pointer'
      }}
    >
      X
    </button>
  </p>
)}</Card></section>}
    {tab==='config'&&<Card title="Configurações"><h4>Alterar visão do Dashboard</h4>{Object.keys(dash).map(k=><label key={k}>{k}<input value={dash[k]} onChange={e=>setDash({...dash,[k]:+e.target.value})}/></label>)}<h4>Alterar senha de colaborador</h4><select value={senha.nome} onChange={e=>setSenha({...senha,nome:e.target.value})}>{pessoas.map(p=><option key={p.id}>{p.nome}</option>)}</select><input placeholder="Nova senha" value={senha.nova} onChange={e=>setSenha({...senha,nova:e.target.value})}/><button className="primary" onClick={alterarSenha}>Alterar senha</button></Card>}
    <nav>{[['inicio',LayoutDashboard],['escala',ClipboardList],['dados',Target],['equipe',Users],['bancadas',PawPrint],['config',Settings]].map(([id,Icon])=><button className={tab===id?'on':''} onClick={()=>setTab(id)} key={id}><Icon size={16}/><span>{id}</span></button>)}</nav>
  </div>;
}
function Login({onLogin}){return <div className="login"><div className="loginCard"><h1>🐾 PETFLOW</h1><p>Sistema online interno</p><input placeholder="Usuário" defaultValue="flavia.trindade"/><input placeholder="Senha" type="password" defaultValue="1234"/><button className="primary" onClick={onLogin}>Entrar</button><small>
function Card({title,children}){return <div className="card"><h3>{title}</h3>{children}</div>}
function Kpi({label,value}){return <div className="kpi"><span>{label}</span><b>{value}</b></div>}

createRoot(document.getElementById('root')).render(<App/>);
