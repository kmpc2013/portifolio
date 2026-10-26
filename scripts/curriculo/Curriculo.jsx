// Layout do currículo em PDF, montado com os mesmos dados do site (src/data).
// Segue o que recrutador e ATS leem melhor: uma coluna, fonte padrão, títulos de seção comuns,
// sem ícones nem gráficos, e o texto todo selecionável.
import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { experiencia } from '../../src/data/experiencia.js'
import { certificacoes, formacao } from '../../src/data/formacao.js'
import { habilidades } from '../../src/data/habilidades.js'
import { perfil } from '../../src/data/perfil.js'
import { CURSO, projetos } from '../../src/data/projetos.js'
import { agruparPorEmpresa, textoPdf, urlCurta } from './conteudo.js'

// Sem isso o react-pdf quebra palavras com hífen usando regras do inglês
Font.registerHyphenationCallback((palavra) => [palavra])

const COR_TEXTO = '#1a1a1a'
const COR_SUAVE = '#555555'
const COR_DESTAQUE = '#0b5394'

const estilos = StyleSheet.create({
  pagina: {
    paddingVertical: 36,
    paddingHorizontal: 42,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    color: COR_TEXTO,
  },
  nome: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.1 },
  cargo: { fontSize: 12, color: COR_DESTAQUE, marginTop: 4 },
  contatos: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, color: COR_SUAVE },
  link: { color: COR_SUAVE, textDecoration: 'none' },
  separador: { marginHorizontal: 5 },
  secao: { marginTop: 14 },
  tituloSecao: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: COR_DESTAQUE,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: COR_DESTAQUE,
    paddingBottom: 2,
    marginBottom: 6,
  },
  bloco: { marginBottom: 8 },
  linhaTitulo: { flexDirection: 'row', justifyContent: 'space-between' },
  negrito: { fontFamily: 'Helvetica-Bold' },
  periodo: { color: COR_SUAVE },
  cargoGrupo: { marginTop: 3 },
  item: { flexDirection: 'row', marginTop: 1.5 },
  marcador: { width: 10 },
  itemTexto: { flex: 1 },
  impacto: { fontFamily: 'Helvetica-Bold', color: COR_DESTAQUE },
  suave: { color: COR_SUAVE },
})

// Junta itens com " · ". O separador vai colado no fim do item anterior: se a linha quebrar,
// ele fica no fim da linha de cima em vez de sozinho no começo da de baixo.
function Contatos({ itens }) {
  return (
    <View style={estilos.contatos}>
      {itens.map((item, i) => (
        <View key={item.texto} style={{ flexDirection: 'row' }}>
          {item.url ? (
            <Link src={item.url} style={estilos.link}>
              {item.texto}
            </Link>
          ) : (
            <Text>{item.texto}</Text>
          )}
          {i < itens.length - 1 && <Text style={estilos.separador}>·</Text>}
        </View>
      ))}
    </View>
  )
}

function Secao({ titulo, children }) {
  return (
    <View style={estilos.secao}>
      {/* minPresenceAhead: o título não fica sozinho no pé da página */}
      <Text style={estilos.tituloSecao} minPresenceAhead={40}>
        {titulo}
      </Text>
      {children}
    </View>
  )
}

function Item({ children }) {
  return (
    <View style={estilos.item}>
      <Text style={estilos.marcador}>•</Text>
      <Text style={estilos.itemTexto}>{children}</Text>
    </View>
  )
}

function LinhaTitulo({ titulo, direita }) {
  return (
    <View style={estilos.linhaTitulo}>
      <Text style={[estilos.negrito, { flex: 1 }]}>{titulo}</Text>
      <Text style={[estilos.periodo, { marginLeft: 8 }]}>{direita}</Text>
    </View>
  )
}

export function Curriculo() {
  const contatos = [
    { texto: perfil.localizacao },
    { texto: perfil.email, url: `mailto:${perfil.email}` },
    { texto: urlCurta(perfil.linkedin), url: perfil.linkedin },
    { texto: urlCurta(perfil.github), url: perfil.github },
    { texto: urlCurta(perfil.site), url: perfil.site },
  ]
  // Projetos de curso ficam no site; no currículo entram os de trabalho real
  const projetosProfissionais = projetos.filter((p) => p.status !== CURSO)

  return (
    <Document
      title={`Currículo - ${perfil.nome}`}
      author={perfil.nome}
      subject={perfil.cargo}
      keywords={habilidades.flatMap((g) => g.itens).join(', ')}
      language="pt-BR"
    >
      <Page size="A4" style={estilos.pagina}>
        <Text style={estilos.nome}>{perfil.nome}</Text>
        <Text style={estilos.cargo}>{perfil.cargo}</Text>
        <Contatos itens={contatos} />

        <Secao titulo="Resumo">
          <Text>{perfil.resumo}</Text>
          <Text style={[estilos.suave, { marginTop: 3 }]}>Busco: {perfil.disponibilidade.join(' · ')}</Text>
        </Secao>

        <Secao titulo="Experiência">
          {agruparPorEmpresa(experiencia).map((grupo) => (
            <View key={grupo.empresa} style={estilos.bloco} wrap={false}>
              <LinhaTitulo titulo={grupo.empresa} direita={grupo.periodo} />
              {grupo.cargos.map((c) => (
                <View key={c.cargo} style={estilos.cargoGrupo}>
                  {/* Com um cargo só, o período já está na linha da empresa */}
                  <LinhaTitulo titulo={c.cargo} direita={grupo.cargos.length > 1 ? c.periodo : ''} />
                  {c.conquistas.map((conquista) => (
                    <Item key={conquista}>{textoPdf(conquista)}</Item>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </Secao>

        <Secao titulo="Projetos">
          {projetosProfissionais.map((p) => (
            <View key={p.id} style={estilos.bloco} wrap={false}>
              <Text>
                <Text style={estilos.negrito}>{p.titulo}</Text>
                {p.status && <Text style={estilos.suave}> ({p.status.toLowerCase()})</Text>}
              </Text>
              {p.impacto && <Text style={estilos.impacto}>{textoPdf(p.impacto)}</Text>}
              <Text>{textoPdf(p.descricao)}</Text>
              <Text style={estilos.suave}>
                {p.tecnologias.join(', ')}
                {p.repositorio && ' · '}
                {p.repositorio && (
                  <Link src={p.repositorio} style={estilos.link}>
                    {urlCurta(p.repositorio)}
                  </Link>
                )}
              </Text>
            </View>
          ))}
          <Text style={estilos.suave}>
            Mais detalhes e outros projetos em{' '}
            <Link src={perfil.site} style={estilos.link}>
              {urlCurta(perfil.site)}
            </Link>
          </Text>
        </Secao>

        <Secao titulo="Habilidades">
          {habilidades.map((g) => (
            <Text key={g.categoria}>
              <Text style={estilos.negrito}>{g.categoria}: </Text>
              {g.itens.join(', ')}
            </Text>
          ))}
        </Secao>

        <Secao titulo="Certificações">
          {certificacoes.map((c) => (
            <LinhaTitulo
              key={c.titulo}
              titulo={`${c.titulo} (${c.emissor})${c.expirada ? ' - expirada' : ''}`}
              direita={c.ano}
            />
          ))}
        </Secao>

        <Secao titulo="Formação">
          {formacao.map((f) => (
            <LinhaTitulo key={f.titulo} titulo={`${f.titulo} - ${f.instituicao}`} direita={f.periodo} />
          ))}
        </Secao>
      </Page>
    </Document>
  )
}
