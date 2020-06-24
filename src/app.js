const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;/* title, url e techs são tecnologias que vêm de dentro do corpo "body" da nossa requisição. */

  // Criando um novo repositório. Cadastro de um novo projeto dentro do objeto chamado "repository"
  const repository =  {
    id: uuid(), /* Descomentar "const { uuid } = require("uuidv4");" */
    title,
    url,
    techs,
    likes: 0,
  };

  // Agora vim aqui no meu "repositories" e vou adicionar esse "repository" dentro da lista de ropositórios que eu já tenho.
  repositories.push(repository);

  // Agora estou retornando um "json" com o projeto que acabou de ser criado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //Recebendo o "id"
  const { id } = request.params;
  
  //Recebendo title, url e techs
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  // Garantindo que o repositório que estamos tentando atualizar realmente existe.
  if(repositoryIndex<0) {
    return response.status(400).json( {error: "project not found"} );
  }

  // Garantindo que os likes sejam alterados só no post
  const likes = repositories[repositoryIndex].likes;

  // Criando novo repositório
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  // Agora vou lá no meu array de repositories, vou procurar na posição "repositorytIndex" e substituir o valor que está armazenado nessa posição pelo "repository" que acabei de criar em "const repository = {title, url, techs,}"
  repositories[repositoryIndex] = repository;

  // Agora eu retorno o repositório(repository) atualizado e não a lista completa
  return response.json(repository);



});

app.delete("/repositories/:id", (request, response) => {
  // Primeiro rebemos o id do repositório que estamos querendo deletar
  const { id } = request.params;

  // Recebendo o id de repositorio(repository) que tenha id igual ao id que estamos querendo deletar
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Segundo analizamos se o id que estamos querendo deletar realmente existe(chechando o id)
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "repository not found!!!"});
  }

  // Terceiro: Deletamos o id
  repositories.splice(repositoryIndex, 1);

  // Agora retornamos a resposta vazia com o status 240
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // Primeiro temos que pegar o "id" que está dentro dos parâmetros "params"
  const { id } =request.params;

  // Nós vamos encontrar aquele repositório(repository) lá do nosso "repositories" em cuja o "id" é igual ao "id" que eu estou recebendo nos parãmetros "params".
  const repository = repositories.find(repository => repository.id === id);

  // Se o repositório não existe
  if(!repository){
    return response.status(400).send(); /* Então não preciso enviar mensagem. Mensagem vazia "send()" */
  }
  // Se existir, então soma.
  repository.likes += 1;

  // Agora a gente retorna o "repository" que nos informará os "likes"
  return response.json(repository);
});

module.exports = app;
