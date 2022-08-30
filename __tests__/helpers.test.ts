/**
 * @file Helper functions test file.
 *
 * @remark This file does not test functions that wrap external calls to the GitHub client.
 */
import {
  changedEmptyBody,
  changedEmptyTemplate,
  getIssueInfo,
  getRepoInfo,
  GithubContext,
  isEmptyTemplate,
  retrieveTemplateBodies,
  retrieveTemplateFiles,
  str2bool
} from '../src/helpers'

// == Mock functions ==
jest.mock('@actions/github')
jest.mock('@actions/core')

// == Test Objects ==
const ISSUE_TEMPLATES = ['bug_report.md', 'feature_request.md']
const ISSUE_TEMPLATES_BODIES = [
  "\n\n**Describe the bug**\nA clear and concise description of what the bug is.\n\n**To Reproduce**\nSteps to reproduce the behavior:\n1. Go to '...'\n2. Click on '....'\n3. Scroll down to '....'\n4. See error\n\n**Expected behavior**\nA clear and concise description of what you expected to happen.\n\n**Screenshots**\nIf applicable, add screenshots to help explain your problem.\n\n**Desktop (please complete the following information):**\n - OS: [e.g. iOS]\n - Browser [e.g. chrome, safari]\n - Version [e.g. 22]\n\n**Smartphone (please complete the following information):**\n - Device: [e.g. iPhone6]\n - OS: [e.g. iOS8.1]\n - Browser [e.g. stock browser, safari]\n - Version [e.g. 22]\n\n**Additional context**\nAdd any other context about the problem here.\n",
  "\n\n**Is your feature request related to a problem? Please describe.**\nA clear and concise description of what the problem is. Ex. I'm always frustrated when [...]\n\n**Describe the solution you'd like**\nA clear and concise description of what you want to happen.\n\n**Describe alternatives you've considered**\nA clear and concise description of any alternative solutions or features you've considered.\n\n**Additional context**\nAdd any other context or screenshots about the feature request here.\n"
]
const FILLED_IN_TEMPLATE =
  '\n\n**Describe the bug**\nEverytime I supply the function with a string it gives an error.'

// == Tests ==
describe('str2bool', () => {
  it("should return true for 'TRUE'", () => {
    expect(str2bool('TRUE')).toBe(true)
  })

  it("should return true for 'True'", () => {
    expect(str2bool('True')).toBe(true)
  })

  it("should return true for 'true'", () => {
    expect(str2bool('true')).toBe(true)
  })

  it("should return false for 'FALSE'", () => {
    expect(str2bool('FALSE')).toBe(false)
  })

  it("should return false for 'False'", () => {
    expect(str2bool('False')).toBe(false)
  })

  it("should return false for 'false'", () => {
    expect(str2bool('false')).toBe(false)
  })

  it("should return false for 'other'", () => {
    expect(str2bool('other')).toBe(false)
  })
})

describe('getRepoInfo', () => {
  it('should return the issue info', async () => {
    const repoInfoMock = {owner: 'owner', repo: 'repo'}
    const ctx = {
      repo: {...repoInfoMock}
    } as unknown as GithubContext
    const repoInfo = getRepoInfo(ctx)
    expect(repoInfo).toStrictEqual(repoInfoMock)
  })
})

describe('getIssueInfo', () => {
  it('should return the issue info', async () => {
    const issueInfoMock = {number: 1, state: 'open', body: 'body'}
    const ctx = {
      payload: {issue: {...issueInfoMock}}
    } as unknown as GithubContext
    const issueInfo = getIssueInfo(ctx)
    expect(issueInfo).toStrictEqual(issueInfoMock)
  })
})

describe('retrieveTemplateFiles', () => {
  it('should return an array of files', async () => {
    const files = await retrieveTemplateFiles()
    expect(files).toEqual(ISSUE_TEMPLATES)
  })
})

describe('retrieveTemplateBodies', () => {
  it('should return an array of files', async () => {
    const bodies = await retrieveTemplateBodies(ISSUE_TEMPLATES)
    expect(bodies).toEqual(ISSUE_TEMPLATES_BODIES)
  })
})

describe('isEmptyTemplate', () => {
  it("should return 'true' if the template was not changed", async () => {
    const templateFiles = await retrieveTemplateFiles()
    const templateBodies = await retrieveTemplateBodies(templateFiles)
    const issueBody = templateBodies[0]
    expect(isEmptyTemplate(issueBody, templateBodies)).toBe(true)
  })

  it("should return 'false' if the template is not empty", async () => {
    const templateFiles = await retrieveTemplateFiles()
    const templateBodies = await retrieveTemplateBodies(templateFiles)
    expect(isEmptyTemplate(FILLED_IN_TEMPLATE, templateBodies)).toBe(false)
  })
})

describe('changedEmptyBody', () => {
  it("should return 'true' if the changes object is empty", () => {
    const emptyChanges = {
      payload: {
        changes: {}
      }
    } as unknown as GithubContext
    expect(changedEmptyBody(emptyChanges)).toBe(true)
  })

  it("should return 'false' if the changes object is not empty", () => {
    const nonEmptyChanges = {
      payload: {
        changes: {body: {from: 'This body is filled in.'}}
      }
    } as unknown as GithubContext
    expect(changedEmptyBody(nonEmptyChanges)).toBe(false)
  })
})

describe('changedEmptyTemplate', () => {
  it("should return 'false' if the changes object is empty", () => {
    const emptyChanges = {
      payload: {
        changes: {}
      }
    } as unknown as GithubContext
    expect(changedEmptyTemplate(emptyChanges, ISSUE_TEMPLATES_BODIES)).toBe(
      false
    )
  })

  it("should return 'true' if the changes object is a empty template", () => {
    const emptyTemplate = {
      payload: {
        changes: {body: {from: ISSUE_TEMPLATES_BODIES[0]}}
      }
    } as unknown as GithubContext
    expect(changedEmptyTemplate(emptyTemplate, ISSUE_TEMPLATES_BODIES)).toBe(
      true
    )
  })

  it("should return 'false' if the changes object is not a empty template", () => {
    const emptyTemplate = {
      payload: {
        changes: {body: {from: 'This body is filled in.'}}
      }
    } as unknown as GithubContext
    expect(changedEmptyTemplate(emptyTemplate, ISSUE_TEMPLATES_BODIES)).toBe(
      false
    )
  })
})
