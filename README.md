<p align="center">
  Projeto desenvolvido totalmente em NestJS com TypeScript para o curso da Udemy
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
</p>

## 📌 Descrição

Este projeto foi desenvolvido com o framework **NestJS** e **TypeScript**, com foco no cadastro de usuários e tarefas, utilizando **PostgreSQL** como banco de dados e executando totalmente via **Docker Compose**.  
Conta com **testes unitários e de integração (e2e)**, além de documentação automática com **Swagger**.

---

## 🚀 Instalação

```bash
npm install
```

---

## ▶️ Executando o projeto em modo de desenvolvimento

```bash
npm run start:dev
```

---

## 🐳 Utilizando Docker

### Buildando e subindo os containers

```bash
docker-compose up --build
```

> Isso irá subir tanto o backend (NestJS) quanto o banco de dados PostgreSQL.

---

## 🔼 Criando as migrações com prisma

```bash
npx prisma migrate dev --name init
```

---

## ✅ Executando os testes

### Testes unitários

```bash
npm run test
```

### Testes de integração (e2e)

```bash
npm run test:e2e
```

### Cobertura de testes

```bash
npm run test:cov
```

---

## 🛠 Recursos

- ✅ CRUD de usuários  
- ✅ CRUD de tarefas  
- 🔐 Autenticação com JWT  
- 🧪 Testes unitários e e2e  
- 📄 Documentação com Swagger  

---

## 📄 Licença

Este projeto utiliza a licença [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
