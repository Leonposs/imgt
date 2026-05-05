# CLAUDE.md — Frontend Website Rules

## Reference Images
- Se uma imagem de referência for fornecida: replicar layout, espaçamento, tipografia e cor exatamente. Substituir com conteúdo placeholder (`https://placehold.co/`). Não melhorar nem adicionar ao design.
- Sem referência: design do zero com alto nível de craft (ver guardrails abaixo).
- Screenshot do output, comparar com referência, corrigir divergências, re-screenshot. No mínimo 2 rodadas de comparação. Parar somente quando não houver diferenças visíveis ou o usuário autorizar.

## Local Server
- **Sempre servir em localhost** — nunca screenshot de URL `file:///`.
- Iniciar o servidor: `node serve.mjs` (serve a raiz do projeto em `http://localhost:3000`)
- `serve.mjs` fica na raiz do projeto. Iniciar em background antes de qualquer screenshot.
- Se o servidor já estiver rodando, não iniciar uma segunda instância.

## Screenshot Workflow
- **Sempre screenshot via localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots salvos automaticamente em `./temporary screenshots/screenshot-N.png` (auto-incrementado, nunca sobrescrito).
- Sufixo opcional: `node screenshot.mjs http://localhost:3000 label` → salva como `screenshot-N-label.png`
- `screenshot.mjs` fica na raiz do projeto.
- Após screenshot, ler o PNG de `temporary screenshots/` com a ferramenta Read — Claude pode ver e analisar a imagem diretamente.
- Ao comparar, ser específico: "heading está em 32px mas referência mostra ~24px", "card gap é 16px mas deveria ser 24px"
- Verificar: spacing/padding, font size/weight/line-height, cores (hex exato), alinhamento, border-radius, shadows, sizing de imagens

## Output Defaults
- Arquivo único `index.html`, todos os estilos inline, exceto se o usuário indicar outro formato
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Imagens placeholder: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- A pasta `Gbrand_assets/` contém todos os assets de marca: logos SVG e o documento de branding.
- O arquivo `Gbrand_assets/IMGT_branding_system.md` é a fonte de verdade de cores e tipografia. **Ler antes de qualquer decisão visual.**
- **Logos:** usar os SVGs de `Gbrand_assets/` (ex: `Gbrand_assets/gestaltlogo.svg`). Nunca referenciar logos fora dessa pasta.
- **Tipografia:** usar exclusivamente Zilla Slab (títulos, self-hosted via `GFonts/`) e Inter (corpo e UI, via Google Fonts). Nunca substituir por outra fonte.
- **Cores:** usar exclusivamente os hex values definidos no documento para a página em questão. Nunca inventar, ajustar ou substituir cores. Se uma variação de hover for necessária, derivar com transparência (`rgba`) da cor existente.
- **Modo claro/escuro:** respeitar o modo definido por página na tabela de cores.
- **Background:** sempre `#F5F4F0` — nunca `#FFFFFF`.

## Anti-Generic Guardrails
- **Cores:** Nunca usar paleta Tailwind padrão (indigo-500, blue-600, etc.). Escolher uma cor de marca customizada e derivar dela.
- **Sombras:** Nunca usar `shadow-md` flat. Usar sombras em camadas, com matiz de cor e baixa opacidade.
- **Tipografia:** Nunca usar a mesma fonte para headings e body. Parear uma display/serif com uma sans limpa. Aplicar tracking apertado (`-0.03em`) em headings grandes, line-height generosa (`1.7`) no body.
- **Gradients:** Camadas de múltiplos gradientes radiais. Adicionar grain/textura via SVG noise filter para profundidade.
- **Animações:** Animar apenas `transform` e `opacity`. Nunca `transition-all`. Usar easing estilo spring.
- **Estados interativos:** Todo elemento clicável precisa de estados hover, focus-visible e active. Sem exceções.
- **Imagens:** Adicionar gradient overlay (`bg-gradient-to-t from-black/60`) e uma camada de tratamento de cor com `mix-blend-multiply`.
- **Espaçamento:** Usar spacing tokens intencionais e consistentes — não passos aleatórios do Tailwind.
- **Profundidade:** Superfícies devem ter um sistema de camadas (base → elevated → floating), não assentar todas no mesmo z-plane.

## Hard Rules
- Não adicionar seções, features ou conteúdo não presentes na referência
- Não "melhorar" um design de referência — replicá-lo
- Não parar após um único round de screenshot
- Não usar `transition-all`
- Não usar azul/índigo padrão do Tailwind como cor primária
