// Trajetória profissional, mais recente primeiro: cada cargo vira uma linha na seção Experiência.
// Mesma empresa com vários cargos = um item por cargo, para mostrar a evolução.
export const experiencia = [
  {
    empresa: 'Sercompe',
    cargo: 'Analista Sênior',
    periodo: 'set/2025 – atual',
    conquistas: [
      'Liderança técnica dos projetos de inovação e automação, da concepção à implantação',
      'Correlação de eventos com LLM: −70% de ruído operacional',
      'SSO com Keycloak em +6 sistemas para +150 usuários'
    ],
  },
  {
    empresa: 'Sercompe',
    cargo: 'Analista Pleno',
    periodo: 'ago/2022 – set/2025',
    conquistas: [
      'Sustentação do monitoramento de vários clientes com Zabbix e Grafana',
      'Automação com SQL, Python, Shell Script e JavaScript',
      'Operação de VMware vSphere, Cloud Director e NSX-T',
    ],
  },
  {
    empresa: 'Sercompe',
    cargo: 'Analista Júnior',
    periodo: 'jun/2019 – ago/2022',
    conquistas: [
      'Monitoramento de grande porte com Zabbix, Grafana e scripts próprios',
      'ZmapL: chamados classificados por cliente, com +100 clientes mapeados',
      'FortiGate, pfSense e servidores Linux',
    ],
  },
  {
    empresa: 'TNG Tecnologia',
    cargo: 'Analista de Infraestrutura de TI',
    periodo: 'nov/2018 – jun/2019',
    conquistas: ['Políticas de backup', 'Switches, roteadores, firewalls, servidores e APs'],
  },
  {
    empresa: 'Gidion Transporte e Turismo',
    cargo: 'Auxiliar de TI · Jovem Aprendiz em Service Desk',
    periodo: 'mai/2016 – nov/2018',
    conquistas: ['Service desk N1/N2', 'Active Directory, GPO e DNS', 'Power BI e redes'],
  },
]
