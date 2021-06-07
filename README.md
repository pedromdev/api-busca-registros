<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# API de busca

## Descrição

API para realizar busca em mensagens.

## Instalação

```bash
$ npm install
```

## Executar a API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Executar os testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Executar o ambiente de desenvolvimento

```bash
$ docker-compose up -d # Após isso, acesse a URL http://localhost:7000/docs
```

## Instalar a API na AWS

Siga para o arquivo cdk/bin/cdk.ts e edite as propriedades da ApiStack. Ao configurar a URI de
conexão do MongoDB, descomente uma das opções da propriedade *mongoUriOrSecret*.

Na primeira opção, você deve pre-configurar a URI de conexão em um segredo no Secrets Manager na sua
conta da AWS. Após isso, informe o nome do segredo e a chave que contém a URI.

Na segunda opção, você deve informar a URI de conexão diretamente na propriedade. Esta opção não é
recomendada em ambiente de produção.

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

new ApiStack(app, 'ApiStack', {
  nodeEnv: 'production',
  /*
   * A conexão do MongoDB pode ser passada via Secrets Manager ou a URI
   * do banco na propriedade 'mongoUriOrSecret'.
   */
  // mongoUriOrSecret: { secret: 'mongodb', uriKey: 'uri' },
  // mongoUriOrSecret: 'mongodb://root:root@host/database',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  route53: {
    record: '<recordName>', // e.g. subdomain
    zone: '<domain>', // e.g. example.com
    hostedZone: '<hostedZoneId>', // e.g. HUY2391NAGDH2384
  },
});
```

Após realizar essas configuração, execute o comando abaixo e confirme a instalação da API na AWS:

```bash
$ cd cdk
$ npm run cdk deploy ApiStack
# ou
$ yarn cdk deploy ApiStack
```

Ao finalizar a instalação, acesse a url http://&lt;subdomain&gt;.&lt;domain&gt;/docs de acordo com
os parâmetros especificados.

## Versões

Cheque o arquivo [CHANGELOG](CHANGELOG.md) para acompanhar as mudanças entre as versões.

## Licença

[MIT](LICENSE)
