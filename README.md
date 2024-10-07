# FSW-Barber
> Um aplicativo desenvolvido durante a Semana Full Stack com objetivo de ser um site para visualização de barbearias e serviços utilizando autenticação com google.

> Para o desenvolvimento dessa aplicação foram utilizadas as seguintes tecnologias: 

- Next.js
- PostgresSQL
- Docker para desenvolvimento
- neondb em produção
- Vercel para deploy
- shadcn para componentes estilizados
- tailwindcss para estilização

# Rodando a aplicação
> Para rodar a aplicação, pode tanto entrar no link hospedado quanto rodar em sua máquina. 

## Rodando a aplicação na máquina própria

Inicialmente utilize o comando para clonar o repositório e possuir o projeto em sua máquina:

```bash
git clone https://github.com/JadirJunior/fsw-barber.git
```

Com o projeto clonado, pode executar a instalação das dependências do node: 

```bash
npm install
```

Após a instalação dessas dependências certifique-se de criar a .env na raiz do projeto e colocar os seguintes dados:

```
DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_AUTH_SECRET
```

Certifique-se também que o docker está instalado na sua máquina. Feitas essas configurações pode iniciar o container do docker com o comando:

```bash
docker-compose up -d
```

Em seguida rodar a aplicação em desenvolvimento:

```bash
npm run dev
```

## Link do projeto na Vercel
Caso queira acessá-lo em produção, pode utilizar o seguinte link:

`https://fsw-barber-eight-kohl.vercel.app`