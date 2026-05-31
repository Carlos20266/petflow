import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const categorias = [
  'Alimentação',
  'Mercado',
  'Transporte',
  'Faculdade',
  'Internet',
  'Celular',
  'Lazer',
  'Saúde',
  'Outros',
  'fatura'
]

function salvar(chave, valor){
  localStorage.setItem(chave, JSON.stringify(valor))
}

function carregar(chave, padrao){
  const item = localStorage.getItem(chave)
  return item ? JSON.parse(item) : padrao
}

function dinheiro(valor){
  return Number(valor || 0).toLocaleString('pt-BR', {
    style:'currency',
    currency:'BRL'
  })
}

function App(){
  const [logado,setLogado] = useState(false)
  const [tab,setTab] = useState('inicio')
  const [dark,setDark] = useState(carregar('eb_dark',false))
  const [toast,setToast] = useState('')

  const [entradas,setEntradas] = useState(carregar('eb_entradas',[]))
  const [gastos,setGastos] = useState(carregar('eb_gastos',[]))
  const [metas,setMetas] = useState(carregar('eb_metas',[]))

  const [entrada,setEntrada] = useState({descricao:'Salário',valor:'',categoria:'Salário'})
  const [gasto,setGasto] = useState({descricao:'',valor:'',categoria:'Alimentação'})
  const [meta,setMeta] = useState({nome:'',objetivo:'',atual:''})

  useEffect(()=>salvar('eb_dark',dark),[dark])
  useEffect(()=>salvar('eb_entradas',entradas),[entradas])
  useEffect(()=>salvar('eb_gastos',gastos),[gastos])
  useEffect(()=>salvar('eb_metas',metas),[metas])

  function aviso(msg){
    setToast(msg)
    setTimeout(()=>setToast(''),3000)
  }

  const totalEntradas = entradas.reduce((s,e)=>s + Number(e.valor || 0),0)
  const totalGastos = gastos.reduce((s,g)=>s + Number(g.valor || 0),0)
  const saldo = totalEntradas - totalGastos
  const economia = Math.max(saldo,0)

  function addEntrada(){
    if(!entrada.valor) return aviso('Digite o valor da entrada')
    setEntradas([...entradas,{id:Date.now(),...entrada,valor:Number(entrada.valor),data:new Date().toLocaleDateString('pt-BR')}])
    setEntrada({descricao:'',valor:'',categoria:'Salário'})
    aviso('Entrada adicionada com sucesso')
  }

  function addGasto(){
    if(!gasto.descricao || !gasto.valor) return aviso('Preencha descrição e valor')
    setGastos([...gastos,{id:Date.now(),...gasto,valor:Number(gasto.valor),data:new Date().toLocaleDateString('pt-BR')}])
    setGasto({descricao:'',valor:'',categoria:'Alimentação'})
    aviso('Gasto adicionado com sucesso')
  }

  function addMeta(){
    if(!meta.nome || !meta.objetivo) return aviso('Preencha o nome e valor da meta')
    setMetas([...metas,{id:Date.now(),...meta,objetivo:Number(meta.objetivo),atual:Number(meta.atual || 0)}])
    setMeta({nome:'',objetivo:'',atual:''})
    aviso('Meta criada com sucesso')
  }

  function removerEntrada(id){
    setEntradas(entradas.filter(e=>e.id!==id))
    aviso('Entrada removida')
  }

  function removerGasto(id){
    setGastos(gastos.filter(g=>g.id!==id))
    aviso('Gasto removido')
  }

  function removerMeta(id){
    setMetas(metas.filter(m=>m.id!==id))
    aviso('Meta removida')
  }

  function atualizarMeta(id,valor){
    setMetas(metas.map(m=>m.id===id?{...m,atual:Number(valor)}:m))
    aviso('Meta atualizada')
  }

  if(!logado) return <Login onLogin={()=>setLogado(true)}/>

  return (
    <div className={dark?'app dark':'app'}>
      {toast && <div className="toast">💰 {toast}</div>}

      <header>
        <div>
          <h1>💰 ECONOMIA BAIXA</h1>
          <p>Controle financeiro pessoal</p>
        </div>
        <button onClick={()=>setLogado(false)}>Sair</button>
      </header>

      {tab==='inicio'&&
        <>
          <Card title="Dashboard Financeiro">
            <div className="grid">
              <Kpi label="Saldo Atual" value={dinheiro(saldo)}/>
              <Kpi label="Entradas" value={dinheiro(totalEntradas)}/>
              <Kpi label="Gastos" value={dinheiro(totalGastos)}/>
              <Kpi label="Economizado" value={dinheiro(economia)}/>
            </div>
          </Card>

          <Card title="Resumo do Mês">
            <p><b>Você recebeu:</b> {dinheiro(totalEntradas)}</p>
            <p><b>Você gastou:</b> {dinheiro(totalGastos)}</p>
            <p><b>Sobra atual:</b> {dinheiro(saldo)}</p>
          </Card>
        </>
      }

      {tab==='entradas'&&
        <Card title="Adicionar Entrada">
          <input placeholder="Descrição" value={entrada.descricao} onChange={e=>setEntrada({...entrada,descricao:e.target.value})}/>
          <input placeholder="Valor" type="number" value={entrada.valor} onChange={e=>setEntrada({...entrada,valor:e.target.value})}/>
          <select value={entrada.categoria} onChange={e=>setEntrada({...entrada,categoria:e.target.value})}>
            <option>Salário</option>
            <option>Horas extras</option>
            <option>Bônus</option>
            <option>Freelance</option>
            <option>Outros ganhos</option>
          </select>
          <button className="primary" onClick={addEntrada}>Adicionar entrada</button>

          <h3>Histórico</h3>
          {entradas.map(e=>(
            <div className="linha" key={e.id}>
              <div>
                <b>{e.descricao}</b><br/>
                {e.categoria} • {e.data}<br/>
                {dinheiro(e.valor)}
              </div>
              <button className="danger" onClick={()=>removerEntrada(e.id)}>Remover</button>
            </div>
          ))}
        </Card>
      }

      {tab==='gastos'&&
        <Card title="Adicionar Gasto">
          <input placeholder="Descrição" value={gasto.descricao} onChange={e=>setGasto({...gasto,descricao:e.target.value})}/>
          <input placeholder="Valor" type="number" value={gasto.valor} onChange={e=>setGasto({...gasto,valor:e.target.value})}/>
          <select value={gasto.categoria} onChange={e=>setGasto({...gasto,categoria:e.target.value})}>
            {categorias.map(c=><option key={c}>{c}</option>)}
          </select>
          <button className="primary" onClick={addGasto}>Adicionar gasto</button>

          <h3>Histórico</h3>
          {gastos.map(g=>(
            <div className="linha" key={g.id}>
              <div>
                <b>{g.descricao}</b><br/>
                {g.categoria} • {g.data}<br/>
                {dinheiro(g.valor)}
              </div>
              <button className="danger" onClick={()=>removerGasto(g.id)}>Remover</button>
            </div>
          ))}
        </Card>
      }

      {tab==='metas'&&
        <Card title="Minhas Metas">
          <input placeholder="Nome da meta" value={meta.nome} onChange={e=>setMeta({...meta,nome:e.target.value})}/>
          <input placeholder="Valor objetivo" type="number" value={meta.objetivo} onChange={e=>setMeta({...meta,objetivo:e.target.value})}/>
          <input placeholder="Valor já guardado" type="number" value={meta.atual} onChange={e=>setMeta({...meta,atual:e.target.value})}/>
          <button className="primary" onClick={addMeta}>Criar meta</button>

          {metas.map(m=>{
            const perc = Math.min(100,Math.round((m.atual/m.objetivo)*100))
            return (
              <div className="meta" key={m.id}>
                <b>{m.nome}</b>
                <p>{dinheiro(m.atual)} de {dinheiro(m.objetivo)}</p>
                <div className="bar"><span style={{width:`${perc}%`}}>{perc}%</span></div>
                <input type="number" placeholder="Atualizar valor guardado" onChange={e=>atualizarMeta(m.id,e.target.value)}/>
                <button className="danger" onClick={()=>removerMeta(m.id)}>Remover meta</button>
              </div>
            )
          })}
        </Card>
      }

      {tab==='relatorios'&&
        <Card title="Relatórios">
          <h3>Gastos por Categoria</h3>
          {categorias.map(cat=>{
            const total = gastos.filter(g=>g.categoria===cat).reduce((s,g)=>s+Number(g.valor),0)
            if(total===0) return null
            return <p key={cat}><b>{cat}:</b> {dinheiro(total)}</p>
          })}

          <h3>Resumo Geral</h3>
          <p><b>Total de entradas:</b> {dinheiro(totalEntradas)}</p>
          <p><b>Total de gastos:</b> {dinheiro(totalGastos)}</p>
          <p><b>Saldo:</b> {dinheiro(saldo)}</p>
        </Card>
      }

      {tab==='config'&&
        <Card title="Configurações">
          <button className="primary" onClick={()=>setDark(!dark)}>
            {dark?'Desativar modo noturno':'Ativar modo noturno'}
          </button>

          <button className="danger" onClick={()=>{
            if(confirm('Tem certeza que deseja apagar todos os dados?')){
              localStorage.clear()
              location.reload()
            }
          }}>
            Apagar todos os dados
          </button>
        </Card>
      }

      <nav>
        {[
          ['inicio','🏠'],
          ['entradas','💵'],
          ['gastos','💸'],
          ['metas','🎯'],
          ['relatorios','📊'],
          ['config','⚙️']
        ].map(([id,icon])=>(
          <button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>
            <span>{icon}</span>{id}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Login({onLogin}){
  const [senha,setSenha] = useState('')

  function entrar(){
    if(senha !== '21012003'){
      alert('Senha incorreta')
      return
    }
    onLogin()
  }

  return (
    <div className="login">
      <div className="loginCard">
        <h1>💰 ECONOMIA BAIXA</h1>
        <p>Controle financeiro pessoal</p>
        <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)}/>
        <button className="primary" onClick={entrar}>Entrar</button>
        <small>seja bem vindo </small>
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
