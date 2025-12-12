# 🍽️ Restaurante Sabor Local - Site Institucional

Aplicação web desenvolvida para um restaurante local, demonstrando integração de APIs e padrões web fundamentais (HTML, CSS, JavaScript).

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um trabalho acadêmico sobre padrões web e ferramentas no-code/low-code. A aplicação simula um site institucional para um restaurante local, incluindo:

- Página inicial com apresentação
- Cardápio interativo
- Formulário de pedidos com integração de API
- Seção de localização
- Informações sobre o restaurante

## 🚀 Funcionalidades

### ✨ Principais Recursos

1. **Cardápio Interativo**
   - Visualização de itens do cardápio
   - Seleção de itens para pedido
   - Cálculo automático do total

2. **Formulário de Pedidos**
   - Validação de campos
   - Integração com API ViaCEP para preenchimento automático de endereço
   - Máscaras de input (telefone e CEP)
   - Gerenciamento de itens selecionados

3. **Design Responsivo**
   - Layout adaptável para desktop, tablet e mobile
   - Menu mobile com toggle
   - Boas práticas de acessibilidade

4. **Integração com API**
   - **ViaCEP**: Busca automática de endereço através do CEP
   - API pública e gratuita, sem necessidade de autenticação

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna e responsiva
- **JavaScript (ES6+)**: Interatividade e integração com APIs
- **ViaCEP API**: Busca de endereços por CEP

## 📁 Estrutura do Projeto

```
restaurante-sabor-local/
│
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos da aplicação
├── js/
│   └── main.js        # Lógica JavaScript e integração API
└── README.md          # Documentação do projeto
```

## 🎯 Como Usar

### Opção 1: Live Server (VS Code / Cursor)

1. Abra o projeto no VS Code ou Cursor
2. Instale a extensão "Live Server" (se ainda não tiver)
3. Clique com o botão direito no arquivo `index.html`
4. Selecione "Open with Live Server"
5. A aplicação abrirá automaticamente no navegador

### Opção 2: Servidor Local

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server
```

Acesse: `http://localhost:8000`

### Opção 3: Abrir Diretamente

Simplesmente abra o arquivo `index.html` no navegador (algumas funcionalidades podem não funcionar devido a restrições CORS).

## 🔌 Integração com API ViaCEP

A aplicação utiliza a API ViaCEP para buscar endereços automaticamente quando o usuário digita um CEP válido.

### Como Funciona:

1. Usuário digita o CEP no formulário
2. Quando o CEP tem 8 dígitos, a aplicação faz uma requisição para a API ViaCEP
3. Os campos de endereço são preenchidos automaticamente:
   - Logradouro
   - Bairro
   - Cidade

### Exemplo de Uso:

```javascript
// Código de integração (já implementado em main.js)
async function buscarCEP(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    // Preenche campos automaticamente
}
```

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Ajustes automáticos no grid
- **Mobile**: Menu hambúrguer, layout em coluna única

## ♿ Acessibilidade

- Navegação por teclado
- Labels descritivos nos formulários
- Contraste adequado de cores
- Estrutura semântica HTML
- Suporte a leitores de tela

## 🎨 Personalização

### Cores Principais

As cores podem ser personalizadas através das variáveis CSS em `css/style.css`:

```css
:root {
    --primary-color: #d32f2f;      /* Vermelho principal */
    --primary-dark: #b71c1c;        /* Vermelho escuro */
    --secondary-color: #ff6f00;     /* Laranja */
}
```

### Cardápio

Os itens do cardápio podem ser editados no array `cardapio` em `js/main.js`:

```javascript
const cardapio = [
    {
        id: 1,
        nome: "Nome do Prato",
        descricao: "Descrição do prato",
        preco: 25.90
    },
    // ... mais itens
];
```

## 📝 Próximos Passos para Integração No-Code

Este código pode ser integrado em plataformas no-code/low-code através de:

1. **HTML Embed**: Copiar o código HTML e inserir via widget de código
2. **CSS Customizado**: Adicionar o CSS através de configurações de tema
3. **JavaScript**: Inserir via código customizado ou widget de script

### Plataformas Compatíveis:

- **Webflow**: HTML Embed + Custom Code
- **Softr**: Custom HTML blocks
- **Glide**: Custom HTML components
- **Bubble**: HTML Element plugin

## 🐛 Troubleshooting

### API ViaCEP não funciona

- Verifique sua conexão com a internet
- Certifique-se de que o CEP tem 8 dígitos
- Alguns CEPs podem não estar cadastrados na base da ViaCEP

### Estilos não carregam

- Verifique se o caminho do arquivo CSS está correto
- Certifique-se de estar usando um servidor local (Live Server)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👨‍💻 Desenvolvido por

Projeto desenvolvido como trabalho acadêmico sobre padrões web e ferramentas no-code/low-code.

---

**Nota**: Esta é uma aplicação de demonstração. Em um ambiente de produção, seria necessário implementar backend para processar os pedidos e integrações com sistemas de pagamento e delivery.

