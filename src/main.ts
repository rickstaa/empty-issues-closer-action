/**
 * @file Main action file.
 */

import {debug, getInput, info, setFailed} from '@actions/core'
import {context} from '@actions/github'
import {inspect} from 'util'
import {
  changeIssueState,
  fetchIssueInfo,
  getRepoInfo,
  retrieveTemplateBodies,
  retrieveTemplateFiles,
  str2bool,
  templateChanged
} from './helpers'

/**
 * Main function.
 */
async function run(): Promise<void> {
  try {
    debug('Getting action inputs...')
    const inputs = {
      github_token: getInput('github_token'),
      close_comment: getInput('close_comment'),
      open_comment: getInput('open_comment'),
      check_templates: str2bool(getInput('check_templates')),
      template_close_comment: getInput('template_close_comment'),
      template_open_comment: getInput('template_open_comment')
    }
    debug(`Inputs: ${inspect(inputs)}`)

    debug('Fetching repo info...')
    const {owner, repo} = getRepoInfo(context)
    debug(`Repo info: ${inspect({owner, repo})}`)

    debug('Check if action was trigger by issues event...')
    if (context.eventName !== 'issues') {
      setFailed('This action can only be run by issues event.')
      if (
        !['opened', 'reopened', 'edited'].includes(context.payload.action || '')
      ) {
        setFailed(
          "This action is meant to be run with the 'opened', 'reopened' or 'edited' event types."
        )
      }
    }

    debug('Fetching issue information...')
    const issueInfo = fetchIssueInfo(context)
    debug(`Issue info: ${inspect(issueInfo)}`)

    // Close empty issues and re-open filled in issues.
    debug('Checking if issue is empty...')
    if (
      issueInfo &&
      issueInfo.state === 'open' &&
      (issueInfo.body === null || issueInfo.body === '')
    ) {
      info(`Closing #${issueInfo.number} since it is empty...`)
      changeIssueState(
        owner,
        repo,
        issueInfo.number,
        'closed',
        inputs.close_comment
      )
      return
    } else if (
      issueInfo &&
      issueInfo.state === 'closed' &&
      !(issueInfo.body === null || issueInfo.body === '')
    ) {
      info(`Re-opening #${issueInfo.number} since it is no longer empty...`)
      changeIssueState(
        owner,
        repo,
        issueInfo.number,
        'open',
        inputs.open_comment
      )
      return
    }

    //  Close issues which didn't change the template and re-open again if template is changed.
    if (inputs.check_templates) {
      debug('Retrieve repository issue templates...')
      const templateFiles = await retrieveTemplateFiles()
      const templateStrings = await retrieveTemplateBodies(templateFiles)
      debug(`Template strings: ${inspect(templateStrings)}`)

      debug('Check if issue has changed the template...')
      if (
        issueInfo &&
        issueInfo.state === 'open' &&
        !templateChanged(issueInfo, templateStrings)
      ) {
        info(
          `Closing #${issueInfo.number} since the template was not changed...`
        )
        changeIssueState(
          owner,
          repo,
          issueInfo.number,
          'closed',
          inputs.template_close_comment
        )
        return
      } else if (
        issueInfo &&
        issueInfo.state === 'closed' &&
        templateChanged(issueInfo, templateStrings)
      ) {
        info(`Re-opening #${issueInfo.number} because template was changed...`)
        changeIssueState(
          owner,
          repo,
          issueInfo.number,
          'open',
          inputs.template_open_comment
        )
        return
      }
    }
  } catch (error: unknown) {
    debug(inspect(error))
    if (error instanceof Error) {
      setFailed(error.message)
    }
  }
}

run()
