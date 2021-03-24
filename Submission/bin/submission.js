#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SubmissionStack } = require('../lib/submission-stack');

const app = new cdk.App();
new SubmissionStack(app, 'SubmissionStack');
