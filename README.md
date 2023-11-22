# API DE ALIMENTOS

Este projeto é uma API Rest feita em Node Express, utilizando boas práticas de desenvolvimento de software com a linguagem JavaScript. Os dados são importados da Open Food Facts para o MongoDB, contendo data e status de importação, e com agendamento todas as noites para sincronização. A documentação da API está disponível, bem como as rotas de inserção, remoções, atualização, listagem e descrição dos projeots alimentícios.

## Variáveis de Ambiente

Esta versão da aplicação foi desenhada para usar um arquivo .env
As variáveis contidas neste arquivo serão carregadas pelo Node por meio da bibliioteca "dotenv"
Algumas variáveis contidas nesta arquivo serão carregadas pelo docker-compose.yml
A depender do cenário do ambiente de produção, talvez seja necessária pequena reegenharia a fim de assegurar o apropriado armazenamento e carregamento de tais variáveis.

## Banco de Dados

Nesta versão de desenvolvimento, subimos uma instância do MongoDB em um container.
Este container está programado no arquivo docker-compose.yml
Deixamos, por enquanto, as credenciais de exemplo chumbadas no código.
Utilizamos a imagem oficial mongo:latest
E para nos conectar do Node para o MongoDB utilizaremos o driver nativo mongodb@6.2

## Script de Povoamento

- preencher os produtos catalogados pela Open Food Facts.

- agendamento diário de sincronização.

### Estratégia de migração

Dividmos em duas partes com abordagens diferentes:

1) Primeiro, script de importação dos dados da Open Foods Facts.

Para isto, optamos por realizar o download do arquivo compactado: "openfoodfacts-mongodbdump.tar.gz"

1.1) Baixamos ele dentro do folder ./db/scripts e extraímos neste mesmo diretório, então é criada um novo diretório chamado "dump" e dentro dele o diretório "off", contendo o arquivo products.bson (atualmente ele está medindo 48.8GB).

1.2) Importamos toda essa base de dados para o Mongo, dentro do container criado pelo docker-compose, carregando os dados através do comando seguinte comando: 

```
mongorestore --username admin --password off --authenticationDatabase admin --db off --drop -d off -c offC /tmp/products.bson
```

1.3) Para concluir a importação dos dados, realizamos uma operação especial para preparar os dados conforme o modelo proposto, com os campos 'imported_t' e 'status'. 

1.3.1) Para fazer isto, entramos dentro do "mongosh" e executamos o seguinte comando, para assinalar o status 1 para todos os itens, desde que 'code' não seja nulo:

```
db.offC.updateMany({"code":{$ne:null}}, {$set:{status:1}},{upsert:false})
```

1.3.2) A seguir, vamos rodar o script para criar o campo imported_t:

```
db.offC.updateMany({"code":{$ne:null}}, {$set:{imported_t:{$type: "timestamp"}}},{upsert:false})
```

2) Segundo, script de atualização dos dados.

O script de atualização dos dados pressupõe que o servidor da API esteja em pé.

2.1) Em vez de baixar algum arquivo volumoso de backup, o script de sincronização utiliza o campo '_id' para consultar a API oficial do Open Foods Facts e, assim, comparar, um a um, os produtos com aqueles contidos em nosso banco de dados, atualizando ou inserindo os novos dados. Parte-se do princípio de que o campo '_id' possui o cumprimento de 10 dígitos, variando do 0000000000 (primeiro '_id') ao 9999999999 (último '_id').

2.2) Sincronização

2.2.1) Toda vez que a rota for chamada, haverá uma requisição para API oficial da OFF

2.2.2) Utiliza o método "upsert" do Mongo para cada campo. 

2.2.3) Sistema de alertas para casos de falhas no sync

2.2.4) Cronjob. Configurações do horário para agendamento de sincronização.

## API de Alimentos

### A REST API

Na REST API teremos um CRUD com os seguintes endpoints:

 - `GET /`: Detalhes da API
 - `PUT /products/:code`: Responsável por receber atualizações
 - `DELETE /products/:code`: Mudança do status do produto para `trash`
 - `GET /products/:code`: Descrição de um produto específico da base de dados
 - `GET /products`: Listagem com paginação de todos os produtos da base de dados

# Documentação da API

Utilizamos a Especificação OpenAPI para  gerar a documentação, cuja interface pode ser acessada através do link seguinte:

http://localhost:8000/docs/

A documentação foi produzida com a utilização de duas bibliotecas utilitárias:

- "swagger-autogen": "^2.23.7",
- "swagger-ui-express": "^5.0.0"

Para geração do arquivo swagger utilizou o caminho docs/swagger.json

Este arquivo é gerado com o swagger-autogen, carregando as informações de forma automática conforme as especificações das rotas.

Este arquivo é carregado pelo swagger-ui-express, com seu método "swaggerDocument", produzindo a interface para o usuário, disponibilizando-a na rota "/docs" da API.

# Testes

.http - Este arquivo contém requisições HTTP configurados, úteil para usuários do vscode, para ser utilizado com a extensão REST Cliente.

Alguns testes unitários foram utilizados e podem ser acessados na pasta tests.

O script de configuração do Jest já está contigo no package.json
