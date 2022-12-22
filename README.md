<div id="top"></div>
<h1 align="center">
    <img alt="NextLevelWeek" title="#NextLevelWeek" src="https://github.com/rethink-projects/rethink-academy-portal/blob/main/public/logo.png?raw=true" />
</h1>
<h4 align="center"> 
	🚧  A API do Portal Rethink Academy está em Desenvolvimento 🚀 🚧
</h4>

<p align="center">
 <a href="#-sobre">Sobre</a> •
 <a href="#-squads">Squads e Problematicas</a> • 
 <a href="#-layout">Layout</a> • 
 <a href="#-como-executar-o-projeto">Como executar</a> • 
 <a href="#-tecnologias">Tecnologias</a> • 
 <a href="#-roadmap">Roadmap</a> • 
 <a href="#-contribuidores">Contribuidores</a> • 
</p>

## 💻 Sobre o projeto

<div id="#-sobre"></div>
<p>O <strong>Rethink Academy</strong> ainda possui muitas possibilidades de evolução para atender todas as necessidades tanto dos estagiários inseridos no programa, como da empresa.

Desta forma, o propósito do desafio é criar, por meio de um produto digital, um ambiente único para os colaboradores do Rethink Academy, para que assim as informações referentes ao programa estejam centralizadas e a visualização de atividades esteja disponível para todos, bem como os conteúdos de aulas, dentre outros aspectos.

<strong>DESAFIO:</strong> desenvolver um produto que contribua com a evolução do programa Rethink Academy. Um portal que será desenvolvido e alimentado pelos próprios estagiários.

A ideia principal é desenvolver um projeto que contribua com a evolução do programa Rethink Academy, com isso é necessário considerar que o acesso a este ambiente esteja disponível para a gestão do programa, aos estagiários e possíveis outros stakeholders.

Com isso iremos percorrer as seguintes etapas: a de imersão com levantamento de dados, com compreensão da problemática e entendimento do briefing. Na etapa de ideação gerar alternativas com pensamento abdutivo, com criatividade e hipóteses projetuais. Por fim, na etapa de implementação tornando realidade as visões de produto e design com a entrega de tecnologia.

</p>

## Squads

<div id="#-squads"></div>

#### 🥷 Tech Squad

<p>Como podemos criar um ambiente único em que todos os conteúdos relacionados a hard skills estejam centralizados para que todos os estagiários possam acessar e acompanhar?</p>

#### 🧙‍♂️ Mestre dos Magos

<p>Como podemos criar um ambiente que possibilite o registro de horas dos estagiários, trazendo visibilidade de todas as atividades atreladas a eles e o tempo dedicado a cada tarefa?</p>

#### ❤️ Squad s2

<p>Como podemos criar um ambiente em que o estagiário possa acompanhar a evolução do seu contrato, das suas avaliações de soft skills e seu desenvolvimento pessoal?</p>

## 🎨 Layout

O layout da aplicação está disponível no Figma:

<a href="https://www.figma.com/file/EBZhQTuJxfdbIAXmlCFfvv/Design-System---Rethink-Portal">
  <img alt="Made by Rethink Academy" src="https://img.shields.io/badge/Figma-Design%20System-brightgreen">
</a>

<a href="https://www.figma.com/file/EBZhQTuJxfdbIAXmlCFfvv/Design-System---Rethink-Portal">
  <img alt="Made by Rethink Academy" src="https://img.shields.io/badge/Figma-Layout-yellowgreen">
</a>

## 🎢 Roadmap

<div id="#-roadmap"></div>

- [x] Boilerplate inicial do Projeto
- [x] Documentação do Projeto.

## 🚀 Como executar o projeto

Esse é o nosso repo para o backend da aplicação.

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 🧭 Rodando a aplicação

```bash

# Clone este repositório
$ git clone git@github.com:rethink-projects/rethink-academy-portal-api.git

# Acesse a pasta do projeto no seu terminal/cmd
$ cd rethink-academy-portal-api

```

📦 Instale nossos pacotes

```bash
# Instale o ts-node globalmente
$ npm install -g ts-node

# Agora instale as dependências
$ npm install

```

🗄 Agora vamos gerar nossa estrutura do Banco de dados

```bash
# Gere a estrutura do prisma
$ npm run prisma:generate

# Gere nosso banco de dados e a estrutura
$ npm run prisma:migrate

# Gere nossa base de dados fake
$ npm run prisma:seed

# Agora confira nosso banco de dados
$ npm run prisma:studio

```

<p>🛠 Execute a aplicação em modo de desenvolvimento</p>

```bash
$ npm run dev
# A aplicação será aberta na porta:4000 - acesse http://localhost:4000
```

---

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- **[Primsa](https://prisma.io)**
- **[TypeScript](https://www.typescriptlang.org/)**

> Veja o arquivo [package.json](https://github.com/rethink-projects/rethink-academy-portal/package.json)

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## Contribuindo

Abaixo vamos explicar um pouco sobre como iremos trabalhar no github:

1. Antes de começar sua nova Feature crie uma Branch para ela:<br>
   `$ git checkout -b feature/AmazingFeature`
   <br>

2. Commit suas alterações sendo bem objetivo:<br>
   `$ git commit -m 'Add some AmazingFeature'`
   <br>
3. Push sua Branch para o nosso repo online:<br>
   `$ git push origin feature/AmazingFeature`
   <br>
4. Agora faça [Pull Request](https://github.com/rethink-projects/rethink-academy-portal/pulls).
5. Não esqueça de marcar o Embaixador e o Assistente para fazer o code review da sua branch.

<p align="right">(<a href="#top">back to top</a>)</p>

## 👨‍💻 Contribuidores

<small>💚 Um super thanks 👏 para essa galera que está fazendo esse produto sair do campo da ideia e se tornando um produto Rethink Academy :)</small>

<table>
  <strong>Suporte</strong>
  <tr>
    <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/46483368?v=4" width="100px;" alt="Embaixador Rethink Academy"/><br /><sub><b>Filipe Prado</b></sub></a><br /><a href="https://rethink.dev" title="Embaixador Rethink Academy">👨‍🚀</a></td>
    <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/82178938?v=4" width="100px;" alt="Assistente - Rethink Academy"/><br /><sub><b>Gabriel Gomes</b></sub></a><br /><a href="https://rethink.dev" title="Assistente - Rethink Academy">👨‍🚀</a></td>
  </tr>
</table>
<table>
  <strong>Tech Squad</strong>
  <tr>
    <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102759771?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Ana Ramos</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
      <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102822686?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Lucas de Paula</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
      <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/64514117?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Fernando Henrique</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
      
  </tr>
</table>
 <table>
 <strong>Mestre dos Magos</strong>
  <tr>
   <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102779256?v=4" width="100px;" alt="Embaixador Rethink Academy"/><br /><sub><b>Carolina Valeriano</b></sub></a><br /><a href="https://rethink.dev" title="Embaixador Rethink Academy">🥷</a></td>
    <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102757800?v=4" width="100px;" alt="Assistente - Rethink Academy"/><br /><sub><b>Fabiana Kamo</b></sub></a><br /><a href="https://rethink.dev" title="Assistente - Rethink Academy">🥷</a></td>
     <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102760281?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Sthéphany Tezza</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
    
  </table>
  <table>
  <strong>Squad S2</strong>
    <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102760382?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Gabriel Melo</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
     <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102760437?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Amanda Duarte</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
      <td align="center"><a href="https://rethink.dev"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102805505?v=4" width="100px;" alt="Estagiário - Rethink Academy"/><br /><sub><b>Felipe Reggiane</b></sub></a><br /><a href="https://rethink.dev" title="Estagiário - Rethink Academy">🥷</a></td>
  </tr>
</table>

---

### Feito com 💚 pelo time Rethink Academy 👋🏽 [Entre em contato!](https://github.com/filiperethink)

### Participantes.

[x] - Filipe Prado
[x] - Fernando Henrique
[x] - Felipe Reggiane
[x] - Lucas Araújo
[x] - Sthéphany Tezza
[x] - Gabriel Melo
[x] - Fabiana Kamo
[x] - Gabriel Gomes
[x] - Ana Clara Ramos
[x] - Amanda Duarte
[x] - Gabriel Gomes 2
[x] - Carolina Valeriano

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>
