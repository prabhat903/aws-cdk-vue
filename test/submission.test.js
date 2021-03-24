const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Submission = require('../lib/submission-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Submission.SubmissionStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
