import * as cdk from '@aws-cdk/core';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import { Vpc, InstanceType } from '@aws-cdk/aws-ec2';
import {
  Cluster,
  Ec2TaskDefinition,
  Ec2Service,
  PlacementStrategy,
  ContainerImage,
  Protocol,
  ContainerDefinition,
  Secret as EcsSecret,
  LogDriver,
} from '@aws-cdk/aws-ecs';
import {
  ApplicationLoadBalancer,
  ListenerCondition,
  ListenerAction,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets';
import { Secret } from '@aws-cdk/aws-secretsmanager';

type Props = cdk.StackProps & {
  nodeEnv?: string;
  mongoUriOrSecret?: string | { secret: string; uriKey: string };
  route53: {
    zone: string;
    record: string;
    hostedZone: string;
  };
};

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'default-vpc', {
      isDefault: true,
    });
    const zone = PublicHostedZone.fromHostedZoneAttributes(this, 'dns', {
      zoneName: props.route53.zone,
      hostedZoneId: props.route53.hostedZone,
    });
    const imageAsset = new DockerImageAsset(this, 'api-image', {
      directory: path.join(__dirname, '../../'),
      file: 'Dockerfile',
    });
    const cluster = new Cluster(this, 'cluster', { vpc });
    const autoScalingGroup = cluster.addCapacity('autoscaling', {
      minCapacity: 1,
      maxCapacity: 3,
      desiredCapacity: 1,
      instanceType: new InstanceType('t3a.micro'),
    });
    const loadbalancer = new ApplicationLoadBalancer(this, 'loadbalancer', {
      vpc,
      internetFacing: true,
    });
    const listener = loadbalancer.addListener('listener', {
      port: 80,
      open: true,
      defaultAction: ListenerAction.fixedResponse(404),
    });
    const taskDefinition = new Ec2TaskDefinition(this, 'task-definition');
    let container: ContainerDefinition;

    if (typeof props.mongoUriOrSecret === 'string') {
      container = taskDefinition.addContainer('api', {
        image: ContainerImage.fromDockerImageAsset(imageAsset),
        memoryReservationMiB: 128,
        logging: LogDriver.awsLogs({ streamPrefix: '[API]' }),
        environment: {
          PORT: '8080',
          NODE_ENV: props.nodeEnv || 'production',
          TZ: 'America/Sao_Paulo',
          DATABASE_URI: props.mongoUriOrSecret,
        },
      });
    } else {
      const mongoSecret = Secret.fromSecretNameV2(
        this,
        'secret',
        props.mongoUriOrSecret?.secret as string,
      );
      container = taskDefinition.addContainer('api', {
        image: ContainerImage.fromDockerImageAsset(imageAsset),
        memoryReservationMiB: 128,
        logging: LogDriver.awsLogs({ streamPrefix: '[API]' }),
        environment: {
          PORT: '8080',
          NODE_ENV: props.nodeEnv || 'production',
          TZ: 'America/Sao_Paulo',
        },
        secrets: {
          DATABASE_URI: EcsSecret.fromSecretsManager(
            mongoSecret,
            props.mongoUriOrSecret?.uriKey as string,
          ),
        },
      });
    }

    container.addPortMappings({
      protocol: Protocol.TCP,
      containerPort: 8080,
      hostPort: 8080,
    });

    listener.addTargets('targets', {
      port: 8080,
      priority: 10,
      conditions: [
        ListenerCondition.hostHeaders([
          `${props.route53.record}.${props.route53.zone}`,
        ]),
      ],
      targets: [autoScalingGroup],
    });

    const service = new Ec2Service(this, 'service', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      placementStrategies: [PlacementStrategy.packedByCpu()],
    });

    new ARecord(this, 'zone-record', {
      zone,
      recordName: props.route53.record,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(loadbalancer)),
    });

    service.node.addDependency(loadbalancer);
  }
}
