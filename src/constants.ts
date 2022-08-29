/**
 * @file Contains the action constants.
 */
export const ISSUES_TEMPLATES_FOLDER = `.github/ISSUE_TEMPLATE/`
export const ACTION_MOCK_PAYLOAD = {
  action: 'opened',
  changes: {
    body: {
      from: '',
      to: '**Describe the bug**\nA test.\n\n'
    }
  },
  issue: {
    number: 32,
    state: 'open',
    body: '**Describe the bug**\nA test.\n\n'
  }
}
