# Alfabetizando: app Android

App para a Google Play feito a partir do "Brincando com as Letras"
(repositório `editoraanap-tupa/letras`), com as 10 trilhas completas.

## Como funciona o bloqueio

- Em cada uma das 10 trilhas, os **itens 1 e 2 ficam abertos** para a família conhecer.
- Do item 3 em diante aparece um **cadeado amarelo**. Ao tocar, a criança vê
  "Chame um adulto"; o adulto responde uma conta simples e chega à tela de compra.
- A compra é **única** ("Trilhas completas") e libera tudo, para sempre, na conta Google.
  O botão "Já comprei: restaurar" recupera a compra num celular novo.
- Na página inicial, acima da lista de trilhas, aparece uma faixa "Liberar tudo" até a compra ser feita.

## Pastas

| Pasta | O que é |
|---|---|
| `conteudo/` | Cópia das 11 páginas do Alfabetizando (index + 10 trilhas), sem mudanças. |
| `web/premium.js` | Bloqueio dos itens e compra pela Google Play. |
| `scripts/textos-app.mjs` | Textos ajustados só no app (o conteúdo deixa de ser de acesso livre). |
| `scripts/montar-www.mjs` | Gera `www/` com as páginas + o bloqueio. |
| `android/` | Projeto Android (Capacitor), aberto no Android Studio. |

Os textos que falavam de acesso livre são trocados no app por `scripts/textos-app.mjs`
(por exemplo: "Sem cadastro..." na página inicial e "Como a trilha avança" nas trilhas).
Se uma frase mudar no site, o `npm run montar` avisa qual delas não foi encontrada.

A pasta `app-alfabetizando/` fica fora do site educaanap.org.br (veja `_config.yml` na raiz).

Para atualizar o conteúdo, copie de novo as páginas do repositório `letras` para `conteudo/`.

## Gerar o app

Precisa de Node.js e Android Studio instalados.

```
npm install
npm run sync      # monta www/ e copia para o projeto Android
npm run abrir     # abre no Android Studio
```

No Android Studio: **Build > Generate Signed App Bundle** gera o arquivo `.aab` que vai para a Play Store.
Guarde bem a chave de assinatura: sem ela não dá para publicar atualizações.

## O que fazer no Google Play Console

1. Criar a conta de desenvolvedor (taxa única de US$ 25) e o **perfil de pagamentos**.
2. Criar o app com o pacote `br.org.educaanap.alfabetizando`, gratuito para baixar.
3. Enviar o `.aab` para o teste interno (a compra só aparece depois do primeiro envio).
4. Em **Monetizar > Produtos > Produtos no app**, criar o produto com ID
   `trilhas_completas`, preço **R$ 19,90** (compra única) e ativar.
   Se o preço mudar, troque também `PRECO_PADRAO` no `web/premium.js`.
5. Preencher o público-alvo (crianças), a política de privacidade e a classificação de conteúdo.
6. Adicionar seu e-mail como "testador de licença" para testar a compra sem pagar.
