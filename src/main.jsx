import React, {useEffect, useState} from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const usuariosBase = [
  {usuario:'flavia.trindade', senha:'1', cargo:'lideranca'},
  {usuario:'jose.ivanilson', senha:'2', cargo:'lideranca'},
  {usuario:'carlos.eduardo', senha:'3', cargo:'apoio'},
  {usuario:'francisca', senha:'4', cargo:'apoio'},
  {usuario:'bruna', senha:'1234', cargo:'colaborador'},
]

const pessoasBase = [
  {id:1,nome:'Bruna',equipe:'Equipe A',senha:'1234',fixo:false,falta:false,cargo:'colaborador'},
  {id:2,nome:'Dayane',equipe:'Equipe B',senha:'1234',fixo:false,falta:false,cargo:'colaborador'},
  {id:3,nome:'Poliana',equipe:'Equipe A',senha:'1234',fixo:true,falta:false,cargo:'colaborador'},
  {id:4,nome:'Lidiane',equipe:'Equipe B',senha:'1234',fixo:false,falta:false,cargo:'colaborador'},
  {id:5,nome:'Janiele',equipe:'Equipe A',senha:'1234',fixo:false,falta:false,cargo:'colaborador'},
]

function salvar(chave, valor){
  localStorage.setItem(chave, JSON.stringify(valor))
}

function carregar(chave, padrao){
  const item = localStorage.getItem(chave)
  return item ? JSON.parse(item) : padrao
}

function App(){
  const [usuarioLogado,setUsuarioLogado]=useState(null)
  const [tab,setTab]=useState('inicio')
  const [dia,setDia]=useState(carregar('petflow_dia',1))
  const [notificacao,setNotificacao]=useState('')
  const [dark,setDark]=useState(carregar('petflow_dark',false))

  const [pessoas,setPessoas]=useState(carregar('petflow_pessoas',pessoasBase))
  const [ladoA,setLadoA]=useState(carregar('petflow_ladoA',[]))
  const [ladoB,setLadoB]=useState(carregar('petflow_ladoB',[]))
  const [meta,setMeta]=useState(carregar('petflow_meta',{meta:5000,realizado:3200}))
  const [dash,setDash]=useState(carregar('petflow_dash',{ativos:21,faltas:2,fixos:3,bancadas:44}))

  const [novo,setNovo]=useState({nome:'',equipe:'Equipe A',senha:'1234',cargo:'colaborador'})
  const [bancada,setBancada]=useState({lado:'A',numero:'',colaborador:''})
  const [senha,setSenha]=useState({nome:'Bruna',nova:''})

  const podeEditar = usuarioLogado?.cargo === 'lideranca' || usuarioLogado?.cargo === 'apoio'

  useEffect(()=>salvar('petflow_dia',dia),[dia])
  useEffect(()=>salvar('petflow_pessoas',pessoas),[pessoas])
  useEffect(()=>salvar('petflow_ladoA',ladoA),[ladoA])
  useEffect(()=>salvar('petflow_ladoB',ladoB),[ladoB])
  useEffect(()=>salvar('petflow_meta',meta),[meta])
  useEffect(()=>salvar('petflow_dash',dash),[dash])
  useEffect(()=>salvar('petflow_dark',dark),[dark])

  function aviso(msg){
    setNotificacao(msg)
    setTimeout(()=>setNotificacao(''),3000)
  }

  function addPessoa(){
    if(!novo.nome.trim()) return aviso('Digite o nome do colaborador')
    setPessoas([...pessoas,{id:Date.now(),...novo,fixo:false,falta:false}])
    setNovo({nome:'',equipe:'Equipe A',senha:'1234',cargo:'colaborador'})
    aviso('Colaborador adicionado com sucesso')
  }

  function removerPessoa(id){
    setPessoas(pessoas.filter(p=>p.id!==id))
    aviso('Colaborador removido')
  }

  function toggle(id,key){
    setPessoas(pessoas.map(p=>p.id===id?{...p,[key]:!p[key]}:p))
    aviso('Status atualizado')
  }

  function addBancada(){
    if(!bancada.numero.trim()) return aviso('Digite a série da bancada')

    const item = {
      numero:bancada.numero,
      colaborador:bancada.colaborador || 'VAZIO'
    }

    if(bancada.lado === 'A'){
      setLadoA([...ladoA,item])
    } else {
      setLadoB([...ladoB,item])
    }

    setBancada({lado:'A',numero:'',colaborador:''})
    aviso('Série adicionada e salva na escala')
  }

  function removerBancada(lado,index){
    if(lado === 'A'){
      setLadoA(ladoA.filter((_,i)=>i!==index))
    } else {
      setLadoB(ladoB.filter((_,i)=>i!==index))
    }
    aviso('Série removida da escala')
  }

  function rodarDia(){
    setDia(dia+1)
    aviso('Rodízio do próximo dia simulado com sucesso')
  }

  function alterarSenha(){
    if(!senha.nova.trim()) return aviso('Digite a nova senha')
    setPessoas(pessoas.map(p=>p.nome===senha.nome?{...p,senha:senha.nova}:p))
    setSenha({...senha,nova:''})
    aviso('Senha alterada com sucesso')
  }

  function sair(){
    setUsuarioLogado(null)
    setTab('inicio')
  }

  if(!usuarioLogado) return <Login onLogin={setUsuarioLogado}/>

  return (
    <div className={dark?'app dark':'app'}>
      {notificacao && <div className="toast">🐾 {notificacao}</div>}

      <header>
        <div>
          <h1>🐾 PETFLOW V6</h1>
          <p><b>Lideranças:</b> Flavia Trindade / José Ivanilson<br/><b>Apoio:</b> Carlos / Francisca</p>
        </div>
        <button onClick={sair}>Sair</button>
      </header>

      {tab==='inicio'&&
        <>
          <Card title="Dashboard Operacional">
            <div className="grid">
              <Kpi label="Ativos" value={dash.ativos}/>
              <Kpi label="Faltas" value={dash.faltas}/>
              <Kpi label="Fixos" value={dash.fixos}/>
              <Kpi label="Bancadas" value={dash.bancadas}/>
            </div>
            <p><b>Rodízio diário:</b> 00:00</p>
            <p><b>Troca semanal:</b> Domingo 23:59</p>
          </Card>

          <Card title="Meta Geral do Dia">
            <p><b>Meta:</b> {meta.meta} pedidos</p>
            <p><b>Realizado:</b> {meta.realizado}</p>
            <p><b>Faltam:</b> {Math.max(meta.meta-meta.realizado,0)}</p>
            <div className="bar"><span style={{width:`${Math.min(100,Math.round(meta.realizado/meta.meta*100))}%`}}>{Math.min(100,Math.round(meta.realizado/meta.meta*100))}%</span></div>
          </Card>
        </>
      }

      {tab==='escala'&&
        <Card title={`Escala do Dia • Dia ${dia}`}>
          <button className="primary" onClick={rodarDia}>Simular próximo dia</button>

          <h3>Lado A</h3>
          {ladoA.length===0 && <p>Nenhuma série cadastrada.</p>}
          {ladoA.map((b,i)=>(
            <p key={i}>{i+1}º — {b.numero} — {b.colaborador || 'VAZIO'}</p>
          ))}

          <h3>Lado B</h3>
          {ladoB.length===0 && <p>Nenhuma série cadastrada.</p>}
          {ladoB.map((b,i)=>(
            <p key={i}>{i+1}º — {b.numero} — {b.colaborador || 'VAZIO'}</p>
          ))}
        </Card>
      }

      {tab==='dados'&&
        <Card title="Dados / Meta Operacional">
          <label>Meta geral</label>
          <input value={meta.meta} onChange={e=>setMeta({...meta,meta:+e.target.value})}/>
          <label>Realizado</label>
          <input value={meta.realizado} onChange={e=>setMeta({...meta,realizado:+e.target.value})}/>
          <button className="primary" onClick={()=>aviso('Meta atualizada com sucesso')}>Salvar dados</button>
        </Card>
      }

      {tab==='equipe'&&
        <Card title="Cadastro de Colaboradores">
          {podeEditar&&<>
            <input placeholder="Nome" value={novo.nome} onChange={e=>setNovo({...novo,nome:e.target.value})}/>
            <select value={novo.equipe} onChange={e=>setNovo({...novo,equipe:e.target.value})}>
              <option>Equipe A</option>
              <option>Equipe B</option>
            </select>
            <input placeholder="Senha" value={novo.senha} onChange={e=>setNovo({...novo,senha:e.target.value})}/>
            <select value={novo.cargo} onChange={e=>setNovo({...novo,cargo:e.target.value})}>
              <option value="colaborador">Colaborador</option>
              <option value="apoio">Apoio</option>
              <option value="lideranca">Liderança</option>
            </select>
            <button className="primary" onClick={addPessoa}>Adicionar</button>
          </>}

          {pessoas.map(p=>(
            <div className="linha" key={p.id}>
              <div>
                <b>{p.nome}</b><br/>
                {p.equipe} • {p.cargo} {p.fixo?'• FIXO':''} {p.falta?'• FALTA':''}
              </div>
              {podeEditar&&<div>
                <button onClick={()=>toggle(p.id,'falta')}>Falta</button>
                <button onClick={()=>toggle(p.id,'fixo')}>Fixo</button>
                <button className="danger" onClick={()=>removerPessoa(p.id)}>Remover</button>
              </div>}
            </div>
          ))}
        </Card>
      }

      {tab==='bancadas'&&
        <>
          {podeEditar&&
          <Card title="Gestão de Séries">
            <input placeholder="Série" value={bancada.numero} onChange={e=>setBancada({...bancada,numero:e.target.value})}/>
            <input placeholder="Colaborador" value={bancada.colaborador} onChange={e=>setBancada({...bancada,colaborador:e.target.value})}/>
            <select value={bancada.lado} onChange={e=>setBancada({...bancada,lado:e.target.value})}>
              <option>A</option>
              <option>B</option>
            </select>
            <button className="primary" onClick={addBancada}>Inserir série</button>
          </Card>}

          <Card title="Lado A">
            {ladoA.map((b,i)=>(
              <p key={i}>{i+1}º — {b.numero} — {b.colaborador || 'VAZIO'} {podeEditar&&<button className="danger" onClick={()=>removerBancada('A',i)}>X</button>}</p>
            ))}
          </Card>

          <Card title="Lado B">
            {ladoB.map((b,i)=>(
              <p key={i}>{i+1}º — {b.numero} — {b.colaborador || 'VAZIO'} {podeEditar&&<button className="danger" onClick={()=>removerBancada('B',i)}>X</button>}</p>
            ))}
          </Card>
        </>
      }

      {tab==='config'&&
        <Card title="Configurações">
          {!podeEditar&&<p>Acesso restrito para liderança e apoio.</p>}

          {podeEditar&&<>
            <h3>Alterar visão do Dashboard</h3>
            {Object.keys(dash).map(k=>(
              <label key={k}>{k}
                <input value={dash[k]} onChange={e=>setDash({...dash,[k]:+e.target.value})}/>
              </label>
            ))}

            <h3>Alterar senha de colaborador</h3>
            <select value={senha.nome} onChange={e=>setSenha({...senha,nome:e.target.value})}>
              {pessoas.map(p=><option key={p.id}>{p.nome}</option>)}
            </select>
            <input placeholder="Nova senha" value={senha.nova} onChange={e=>setSenha({...senha,nova:e.target.value})}/>
            <button className="primary" onClick={alterarSenha}>Alterar senha</button>

            <h3>Acessos cadastrados</h3>
            {pessoas.map(p=><p key={p.id}><b>{p.nome}</b> — {p.cargo} — senha: {p.senha}</p>)}

            <h3>Modo noturno</h3>
            <button className="primary" onClick={()=>setDark(!dark)}>{dark?'Desativar modo noturno':'Ativar modo noturno'}</button>
          </>}
        </Card>
      }

      <nav>
        {[
          ['inicio','▦'],
          ['escala','▤'],
          ['dados','◎'],
          ['equipe','♙'],
          ['bancadas','✤'],
          ['config','⚙']
        ].map(([id,icon])=>(
          <button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>
            <span>{icon}</span>{id}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Login({onLogin}){
  const [login,setLogin]=useState('flavia.trindade')
  const [senha,setSenha]=useState('')

  function entrar(){
    const usuariosSalvos = carregar('petflow_pessoas',pessoasBase)
    const usuarios = [
      ...usuariosBase,
      ...usuariosSalvos.map(p=>({
        usuario:p.nome.toLowerCase().replaceAll(' ','.'),
        senha:p.senha,
        cargo:p.cargo || 'colaborador'
      }))
    ]

    const user = usuarios.find(u=>u.usuario===login && u.senha===senha)

    if(!user){
      alert('Usuário ou senha incorretos')
      return
    }

    onLogin(user)
  }

  return (
    <div className="login">
      <div className="loginCard">
        <h1>🐾 PETFLOW</h1>
        <p>Sistema online interno</p>
        <input placeholder="Usuário" value={login} onChange={e=>setLogin(e.target.value)}/>
        <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)}/>
        <button className="primary" onClick={entrar}>Entrar</button>
      </div>
    </div>
  )
}

function Card({title,children}){
  return <section className="card"><h2>{title}</h2>{children}</section>
}

function Kpi({label,value}){
  return <div className="kpi"><span>{label}</span><b>{value}</b></div>
}

createRoot(document.getElementById('root')).render(<App />)
