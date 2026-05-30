# SGE Industrial - Sistema de Gestão de Estoque 📊📦

O **SGE Industrial** é uma aplicação web do tipo **SPA (Single Page Application)** desenvolvida com JavaScript Vanilla (puro), projetada para simular o controle de inventário e fluxo de materiais dentro de um ambiente fabril. 

O projeto foi estruturado com foco em boas práticas de engenharia de software, separação de responsabilidades (HTML/CSS/JS modulares) e gerenciamento de estado consistente para demonstrar competência técnica em desenvolvimento front-end.

---

## 🚀 Funcionalidades Principais

* **Controle de Acesso Multiusuário (RBAC):** Sistema com dois níveis de permissão que alteram dinamicamente a interface do usuário:
    * `admin`: Acesso total (visualização, cadastros, edições, exclusões e movimentações).
    * `usuario01`: Acesso operacional limitado (bloqueia e oculta funções de criação/deleção de produtos, permitindo apenas consultas e lançamentos de fluxo).
* **CRUD Completo com Persistência Local:** Gerenciamento de itens do estoque (Criar, Ler, Atualizar e Deletar) utilizando o `LocalStorage` do navegador para simular a persistência de um banco de dados relacional.
* **Dashboard Interativo em Tempo Real:** Gráfico de barras dinâmico integrado via **Chart.js** e cards de indicadores que calculam automaticamente a volumetria, total de SKUs e alertas críticos simultaneamente a qualquer alteração na tabela.
* **Módulo de Movimentação e Histórico de Auditoria:** Fluxo reativo para registrar entradas e saídas de mercadorias com trava de segurança contra furos de estoque (impede saídas maiores do que o saldo atual) e geração automática de log/extrato temporal.
* **Tratamento de Dados de Entrada:** Normalização automática de strings (ex: capitalização automática da primeira letra em descrições e caixa alta em códigos).
* **Exportação de Relatórios:** Função nativa para conversão de dados estruturados em memória (`Blob`) para download de arquivos no formato **CSV** compatível com Excel.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5** – Estruturação semântica da aplicação.
* **CSS3** – Layout responsivo baseado em Flexbox, com paleta de cores corporativa/formal (Slate/Navy) voltada para ambientes Enterprise.
* **JavaScript (ES6+)** – Manipulação dinâmica do DOM, controle de estado, tratamento de eventos e lógica de negócios.
* **Chart.js** – Renderização gráfica de alta performance para inteligência de dados.

---

## 🔒 Credenciais de Teste

Para homologação das regras de nível de acesso na interface, utilize as seguintes contas no painel de autenticação:

| Usuário | Senha | Nível de Acesso | Permissões |
| :--- | :--- | :--- | :--- |
| `admin` | `12345` | **Administrador (Gerente)** | Total (CRUD + Movimentações) |
| `usuario01` | `123` | **Operador (Almoxarifado)** | Consulta, Dashboard e Fluxos |

---

## 📂 Estrutura do Projeto

```text
├── index.html     # Estrutura semântica e seções do app (SPA)
├── style.css      # Estilização corporativa e regras de visibilidade
└── script.js      # Core da aplicação (Lógica de estado, CRUD e Gráficos)
