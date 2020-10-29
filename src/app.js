const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const repositories = [];

const app = express();

app.use(express.json());

app.use(cors());

app.get('/repositories', (_request, response) => response.json(repositories));

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
  if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not found' });

  let selectedRepository = repositories[repositoryIndex];

  selectedRepository = {
    ...selectedRepository,
    title,
    url,
    techs,
  };

  return response.status(201).json(selectedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
  if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not found' });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
  if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not found' });

  const selectedRepository = repositories[repositoryIndex];

  selectedRepository.likes += 1;

  return response.status(201).json(selectedRepository);
});

module.exports = app;
