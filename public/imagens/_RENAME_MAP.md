# Rename Map — gestalt-images → imagens

Auditoria do rename SEO-friendly executado. Usar para rastreamento histórico ou rollback se necessário.

## Pasta

| Antes | Depois |
| --- | --- |
| `gestalt-images/` | `imagens/` |

## Arquivos renomeados (28)

### Retratos do professor

| Antes | Depois |
| --- | --- |
| `marcelo-gomes-1.jpg` | `retrato-marcelo-gomes-01.jpg` |
| `marcelo-gomes-2.jpg` | `retrato-marcelo-gomes-02.jpg` |
| `marcelo-gomes-3.jpg` | `retrato-marcelo-gomes-03.jpg` |
| `marcelo-gomes-4.jpg` | `retrato-marcelo-gomes-04.jpg` |
| `marcelo-gomes-10.jpg` | `retrato-marcelo-gomes-05.jpg` |

### Família IMGT

| Antes | Depois |
| --- | --- |
| `imgt-hero.jpg` | `hero-instituto-mineiro-gestalt-terapia.jpg` |
| `imgt-sobre-o-instittuto[].jpg` | `bg-sobre-instituto-mineiro-gestalt.jpg` |
| `imgt-gestalt-instituto.jpg` | `card-instituto-mineiro-gestalt.jpg` |
| `imgt-formacao-b.jpg` | `card-formacao-gestalt-terapia.jpg` |
| `imgt-gratuito.jpg` | `bg-curso-gratuito-gestalt.jpg` |
| `imgt-ansiedade.jpg` | `card-minicurso-ansiedade.jpg` |
| `imgt-depressao-b.jpg` | `card-minicurso-depressao.jpg` |
| `imgt-fenomenologia.jpg` | `card-minicurso-fenomenologia.jpg` |
| `imgt-self.jpg` | `card-minicurso-teoria-do-self.jpg` |
| `imgt-tdah.jpg` | `card-minicurso-tdah.jpg` |

### Família mg

| Antes | Depois |
| --- | --- |
| `mg1.jpg` | `bg-professor-leitura-consultorio.jpg` |
| `mg2.jpg` | `bg-estudante-laptop-anotando.jpg` |
| `mg3.jpg` | `bg-sessao-psicoterapia-anotacoes.jpg` |
| `mg4.jpg` | `bg-jornada-caminho-neblina.jpg` |
| `mg5.jpg` | `bg-mulher-exaustao-mental.jpg` |
| `mg8.jpg` | `bg-pioneiro-gestalt-terapia-historico.jpg` |
| `mg14.jpg` | `hero-supervisao-online-grupo.jpg` |
| `mg16.jpg` | `bg-jovens-celular-rua-noite.jpg` |
| `mg17.jpg` | `bg-grupo-estudo-leitura.jpg` |
| `mg18.jpg` | `bg-escritura-reflexao-noturna.jpg` |
| `mg21.jpg` | `hero-contato-jovem-celular.jpg` |
| `mg23.jpg` | `hero-atendimento-acolhimento-sessao.jpg` |
| `mg24.jpg` | `bg-curso-online-aluna-aprendizado.jpg` |

## Arquivos mantidos (9)

Já estavam SEO-friendly e batem com slugs das LPs:

- `curso-gratuito-gestalt-terapia.jpg`
- `formacao-gestalt-terapia-instituto-mineiro-imgt.jpg`
- `minicurso-ansiedade-manejo-clinico.jpg`
- `minicurso-ciclo-contato-gestalt-terapia.jpg`
- `minicurso-depressao-manejo-clinico.jpg`
- `minicurso-fenomenologia-psicoterapia.jpg`
- `minicurso-tdah-clinica-psicoterapeutica.jpg`
- `minicurso-teoria-do-self-gestalt-terapia.jpg`
- `minicurso-vicios-contemporaneos-psicoterapia.jpg`

## Órfãs movidas para `_archive/` (13)

Não eram referenciadas por nenhum HTML do projeto (raiz, `_partials/`, `Landing Pages/`):

- `imgt--fenomenologia-b.jpg`
- `imgt-bk2-depressao.jpg`
- `imgt-bk2-fenomenologia.jpg`
- `imgt-bk2-vicios.jpg`
- `imgt-ciclocontato.jpg`
- `imgt-tdah-b.jpg`
- `imgt-vicios-b.jpg`
- `mg19.jpg`, `mg20.jpg`, `mg22.jpg`, `mg29.jpg`, `mg209.jpg`, `mg219.jpg`

## Arquivos de código atualizados

- `index.html`, `cursos.html`, `sobre.html`, `palestras.html`, `supervisao.html`, `atendimento.html`, `contato.html` (raiz)
- `Landing Pages/curso-gratuito-gestalt-terapia.html`, `formacao-gestalt-terapia-instituto-mineiro-imgt.html`, `minicurso-ansiedade-manejo-clinico.html`, `minicurso-ciclo-contato-gestalt-terapia.html`, `minicurso-depressao-manejo-clinico.html`, `minicurso-fenomenologia-psicoterapia.html`, `minicurso-tdah-clinica-psicoterapeutica.html`, `minicurso-teoria-do-self-gestalt-terapia.html`, `minicurso-vicios-contemporaneos-psicoterapia.html`

Não tocados (não referenciam imagens da pasta): `politica-de-privacidade.html`, `_partials/header.html`, `_partials/footer.html`, `CLAUDE.md`.

## Convenção adotada

`[papel]-[descricao-keyword].jpg` em PT-BR, lowercase, hífens, sem acentos, sem caracteres especiais.

Papéis usados: `hero` (hero/banner principal de página), `bg` (background decorativo), `card` (thumbnail de card/grid), `retrato` (foto de pessoa), `minicurso`/`curso`/`formacao` (capa de curso, slug = nome do curso).
