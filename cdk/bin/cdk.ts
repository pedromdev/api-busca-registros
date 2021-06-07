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
    record: '<recordName>',
    zone: '<domain>',
    hostedZone: '<hostedZoneId>',
  },
});
