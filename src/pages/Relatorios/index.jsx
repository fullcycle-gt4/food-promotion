import { NavLink } from 'react-router-dom'
import './relatorios.css'

const resumo = [
	{ titulo: 'Produtos ativos', valor: '128', detalhe: '+12% neste mes', icone: '01' },
	{ titulo: 'Promocoes publicadas', valor: '86', detalhe: '+8% neste mes', icone: '02' },
	{ titulo: 'Itens vendidos', valor: '342', detalhe: '+18% neste mes', icone: '03' },
	{ titulo: 'Economia gerada', valor: 'R$ 4.280', detalhe: '+21% neste mes', icone: '04' },
]

const vendasPorCategoria = [
	{ categoria: 'Hortifruti', quantidade: 142, percentual: 82 },
	{ categoria: 'Laticínios', quantidade: 96, percentual: 61 },
	{ categoria: 'Padaria', quantidade: 64, percentual: 43 },
	{ categoria: 'Bebidas', quantidade: 40, percentual: 28 },
]

function Relatorios() {
	return (
		<div className="report-shell">
			<aside className="sidebar">
				<div className="brand"><span className="brand-mark">F</span><span>food<span className="brand-accent">.</span></span></div>
				<nav aria-label="Navegacao principal">
					<NavLink to="/inicio"><span className="nav-icon">+</span>Inicio</NavLink>
					<NavLink to="/produtos"><span className="nav-icon">□</span>Produtos</NavLink>
					<NavLink to="/relatorios"><span className="nav-icon">▥</span>Relatorios</NavLink>
					<NavLink to="/clientes"><span className="nav-icon">○</span>Clientes</NavLink>
				</nav>
				<div className="sidebar-footer">
					<div className="user-avatar">AM</div>
					<div><strong>Admin Manager</strong><span>Administrador</span></div>
				</div>
			</aside>

			<main className="dashboard">
				<header className="page-header">
					<div><span className="eyebrow">VISAO GERAL / 2024</span><h1>Relatorios</h1><p>Acompanhe o desempenho das suas promocoes em um so lugar.</p></div>
					<div className="header-actions"><button className="icon-button" aria-label="Notificacoes">!</button><button className="export-button">Exportar relatorio <span>↗</span></button></div>
				</header>

				<div className="period-bar"><span>Periodo analisado</span><button className="period-button">01 Jun 2024 - 30 Jun 2024 <span>⌄</span></button><span className="updated">Atualizado ha 5 min</span></div>

				<section className="metrics-grid" aria-label="Resumo do periodo">
					{resumo.map((item) => <article className="metric-card" key={item.titulo}><div className="metric-top"><span>{item.titulo}</span><span className="metric-icon">{item.icone}</span></div><strong>{item.valor}</strong><small><b>↑</b> {item.detalhe}</small></article>)}
				</section>

				<section className="content-grid">
					<article className="panel sales-panel" aria-labelledby="vendas-titulo">
						<div className="panel-heading"><div><h2 id="vendas-titulo">Desempenho de vendas</h2><p>Receita gerada pelas promocoes</p></div><span className="growth">+18,4%</span></div>
						<div className="chart-value">R$ 18.640 <span>este mes</span></div>
						<div className="chart" aria-label="Grafico de vendas dos ultimos seis meses"><div className="chart-grid"><span>20k</span><span>15k</span><span>10k</span><span>5k</span><span>0</span></div><div className="chart-bars">{[48, 64, 56, 76, 68, 92].map((height, index) => <div className="bar-column" key={index}><div className="bar" style={{ height: `${height}%` }}></div><span>{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][index]}</span></div>)}</div></div>
					</article>

					<article className="panel category-panel" aria-labelledby="categorias-titulo"><div className="panel-heading"><div><h2 id="categorias-titulo">Por categoria</h2><p>Itens vendidos</p></div><button className="more-button" aria-label="Mais opcoes">...</button></div><div className="category-list">{vendasPorCategoria.map((item) => <div className="category-row" key={item.categoria}><div className="category-label"><span className="category-dot"></span><span>{item.categoria}</span><strong>{item.quantidade}</strong></div><div className="progress-track"><span style={{ width: `${item.percentual}%` }}></span></div></div>)}</div><button className="link-button">Ver relatorio completo <span>→</span></button></article>
				</section>

				<section className="bottom-grid"><article className="panel highlight"><div><span className="eyebrow">PRODUTO DESTAQUE</span><h2>Hortifruti fresco</h2><p>Categoria com maior giro no periodo.</p></div><strong>142 <small>itens vendidos</small></strong></article><article className="panel quick-info"><span className="eyebrow">TAXA DE CONVERSAO</span><strong>68,2%</strong><span className="positive">↑ 4,6% vs. mes anterior</span></article></section>
			</main>
		</div>
	)
}

export default Relatorios
