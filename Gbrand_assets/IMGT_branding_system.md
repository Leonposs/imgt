# IMGT — Cores e Tipografia
**Instituto Mineiro de Gestalt-Terapia**

---

## Tipografia

| Função | Fonte |
|--------|-------|
| Títulos | Zilla Slab (300, 400, 500, 600, 700) — self-hosted via `GFonts/` |
| Corpo e UI | Inter (400, 500, 600) — Google Fonts |

Zilla Slab é self-hosted na pasta `GFonts/`, declarada via `@font-face` inline. Inter é importada via Google Fonts.

---

## Neutros (todas as páginas)

| Token | Hex |
|-------|-----|
| Background padrão | `#F5F4F0` |
| Background secundário | `#ECEAE4` |
| Background escuro | `#1A1A1A` |
| Texto principal | `#1A1A1A` |
| Texto secundário | `#4D4D4D` |
| Texto muted | `#777777` |

---

## Cores por página

| Página | Cor de fundo | Cor de destaque | Modo |
|--------|-------------|----------------|------|
| Site institucional | `#1A1A1A` | `#5f4c99` | **Escuro** |
| LP Formação Completa | `#0B203F` | `#00C3FF` | **Escuro** |
| LP Gratuito | `#0B203F` | `#00C3FF` | **Escuro** |
| LP Ciclo de Contato | `#19030E` | `#D31160` | **Escuro** |
| LP Teoria do Self | `#19030E` | `#D31160` | **Escuro** |
| LP Fenomenologia | `#160D35` | `#6633FF` | **Escuro** |
| LP Ansiedade | `#0B203F` | `#FF6D00` | **Escuro** |
| LP Depressão | `#1D1D35` | `#07D62D` | **Escuro** |
| LP Vícios Contemporâneos | `#190E13` | `#ED1C24` | **Escuro** |
| LP TDAH na Clínica | `#161651` | `#FFB600` | **Escuro** |

---

## Neutros — Modo Escuro (todas as páginas)

| Token | Hex |
|-------|-----|
| Texto principal | `#F5F4F0` |
| Texto secundário | `#C0BCB5` |
| Texto muted | `#918D88` |

Sombras usam preto puro com opacidade maior que no modo claro (0.10–0.25).
`--page-dark` é invertido para `#F5F4F0` (lily white) em todas as páginas escuras.

---

## Paleta Dark por página

Cada página usa como `--color-bg` a cor de fundo definida na tabela acima.
A cor de destaque permanece inalterada como accent. O lily white (`#F5F4F0`) é usado em títulos e textos.

### Logo monocromático
O logo IMGT (`.logo-adornment`) é renderizado em monocromático usando CSS `mask-image` com `background-color: var(--page-accent)`.
O logo do footer permanece colorido original (`gestaltlogo.svg`).

### Site institucional
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#17141f` | Roxo-negro profundo |
| `--color-bg-elevated` | `#1e193a` | Superfície elevada violeta |
| `--color-bg-dark` | `#1c1924` | Variante mais escura |
| `--page-mid` | `#433960` | Tom intermediário |
| `--page-accent-soft` | `#574884` | Accent suavizado |
| glass-light base | `rgba(33, 30, 42, 0.55)` | Vidro com matiz roxo |

### LP Formação Completa / LP Gratuito
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#0B203F` | Azul-marinho profundo |
| `--color-bg-elevated` | `#19365A` | Superfície elevada azul |
| `--color-bg-dark` | `#071933` | Variante mais escura |
| `--page-mid` | `#0A6F99` | Tom intermediário |
| `--page-accent-soft` | `#00A8DB` | Accent suavizado |
| glass-light base | `rgba(19, 40, 71, 0.55)` | Vidro com matiz azul |

### LP Ciclo de Contato / LP Teoria do Self
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#19030E` | Magenta-escuro profundo |
| `--color-bg-elevated` | `#2E1823` | Superfície elevada vinho |
| `--color-bg-dark` | `#100208` | Variante mais escura |
| `--page-mid` | `#7A0B3A` | Tom intermediário carmim |
| `--page-accent-soft` | `#B0104F` | Accent suavizado |
| glass-light base | `rgba(25, 3, 14, 0.55)` | Vidro com matiz vinho |

### LP Fenomenologia
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#160D35` | Roxo-escuro profundo |
| `--color-bg-elevated` | `#2B224E` | Superfície elevada violeta |
| `--color-bg-dark` | `#0F0828` | Variante mais escura |
| `--page-mid` | `#3B1F6A` | Tom intermediário violeta |
| `--page-accent-soft` | `#5529DB` | Accent suavizado |
| glass-light base | `rgba(22, 13, 53, 0.55)` | Vidro com matiz violeta |

### LP Ansiedade
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#0B203F` | Azul-marinho profundo |
| `--color-bg-elevated` | `#19365A` | Superfície elevada azul |
| `--color-bg-dark` | `#071933` | Variante mais escura |
| `--page-mid` | `#8A4A10` | Tom intermediário âmbar |
| `--page-accent-soft` | `#DB5E00` | Accent suavizado |
| glass-light base | `rgba(19, 40, 71, 0.55)` | Vidro com matiz azul |

### LP Depressão
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#1D1D35` | Índigo-acinzentado profundo |
| `--color-bg-elevated` | `#32324F` | Superfície elevada índigo |
| `--color-bg-dark` | `#141428` | Variante mais escura |
| `--page-mid` | `#0E7A3D` | Tom intermediário esmeralda |
| `--page-accent-soft` | `#06B826` | Accent suavizado |
| glass-light base | `rgba(29, 29, 53, 0.55)` | Vidro com matiz índigo |

### LP Vícios Contemporâneos
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#190E13` | Púrpura-escuro profundo |
| `--color-bg-elevated` | `#2E2328` | Superfície elevada púrpura |
| `--color-bg-dark` | `#10070C` | Variante mais escura |
| `--page-mid` | `#8A1E40` | Tom intermediário rubi |
| `--page-accent-soft` | `#CC1920` | Accent suavizado |
| glass-light base | `rgba(25, 14, 19, 0.55)` | Vidro com matiz púrpura |

### LP TDAH na Clínica
| Token | Hex | Descrição |
|-------|-----|-----------|
| `--color-bg` | `#161651` | Índigo profundo |
| `--color-bg-elevated` | `#26266B` | Superfície elevada índigo |
| `--color-bg-dark` | `#101042` | Variante mais escura |
| `--page-mid` | `#8A6E14` | Tom intermediário dourado |
| `--page-accent-soft` | `#DB9D00` | Accent suavizado |
| glass-light base | `rgba(30, 30, 89, 0.55)` | Vidro com matiz índigo |

---

## Tokens constantes — Modo Escuro

Estes valores são idênticos em todas as páginas dark:

```css
/* Glass */
--glass-dark: rgba(0, 0, 0, 0.2);
--glass-light-border: rgba([accent RGB], 0.15);
--glass-dark-border: rgba([accent RGB], 0.12);
--glass-blur: 16px;

/* Sombras */
--shadow-ambient: 0 4px 24px rgba(0,0,0,0.15), 0 12px 48px rgba(0,0,0,0.10);
--shadow-elevated: 0 8px 32px rgba(0,0,0,0.20), 0 24px 64px rgba(0,0,0,0.12);
--shadow-float: 0 12px 40px rgba(0,0,0,0.25), 0 32px 80px rgba(0,0,0,0.15);
```

---

*Sistema criado por POSS para o Instituto Mineiro de Gestalt-Terapia — Abril 2026*
