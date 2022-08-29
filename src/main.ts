/**
 * @file Main action file.
 */
/* eslint-disable import/first */ // NOTE: Makes sure env variables are loaded first.
import dotenv from 'dotenv'
dotenv.config()

import {debug, getInput, info, setFailed, warning} from '@actions/core'
import {context} from '@actions/github'
import {inspect} from 'util'
import {
  changedEmptyBody,
  changedEmptyTemplate,
  changeIssueState,
  fetchIssueInfo,
  getRepoInfo,
  isEmptyTemplate,
  retrieveTemplateBodies,
  retrieveTemplateFiles,
  str2bool
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
      template_open_comment: getInput('template_open_comment'),
      dry_run: str2bool(getInput('dry_run'))
    }
    debug(`Inputs: ${inspect(inputs)}`)

    debug('Fetching repo info from context...')
    debug(`Context: ${inspect(context)}`)
    debug(`Changes: ${inspect(context.payload.changes)}`)
    const {owner, repo} = getRepoInfo(context)
    debug(`Repo info: ${inspect({owner, repo})}`)

    debug('Check if action was trigger by issues event...')
    const eventName = context.eventName
    const eventType = context.payload.action
    if (eventName !== 'issues') {
      setFailed('This action can only be run by issues event.')
      if (!['opened', 'reopened', 'edited'].includes(eventType || '')) {
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
      if (!inputs.dry_run) {
        changeIssueState(
          owner,
          repo,
          issueInfo.number,
          'closed',
          inputs.close_comment
        )
      } else {
        warning('DRY_RUN is enabled, skipping closing of issue.')
      }
      return
    } else if (
      issueInfo &&
      issueInfo.state === 'closed' &&
      eventType === 'edited' &&
      changedEmptyBody(context) &&
      !(issueInfo.body === null || issueInfo.body === '')
    ) {
      info(`Reopening #${issueInfo.number} since it is no longer empty...`)
      if (!inputs.dry_run) {
        changeIssueState(
          owner,
          repo,
          issueInfo.number,
          'open',
          inputs.open_comment
        )
      } else {
        warning('DRY_RUN is enabled, skipping reopening of issue.')
      }
      return
    }

    //  Close issues which didn't change the template and re-open again if template is changed.
    if (inputs.check_templates) {
      debug('Retrieve repository issue templates...')
      const templateFiles = await retrieveTemplateFiles()
      debug(`Template files: ${inspect(templateFiles)}`)
      const templateStrings = await retrieveTemplateBodies(templateFiles)
      debug(`Template strings: ${inspect(templateStrings)}`)

      debug('Check if user has changed the issue template...')
      if (
        issueInfo &&
        issueInfo.body &&
        issueInfo.state === 'open' &&
        isEmptyTemplate(issueInfo.body, templateStrings)
      ) {
        info(
          `Closing #${issueInfo.number} since the template was not changed...`
        )
        if (!inputs.dry_run) {
          changeIssueState(
            owner,
            repo,
            issueInfo.number,
            'closed',
            inputs.template_close_comment
          )
        } else {
          warning('DRY_RUN is enabled, skipping closing of issue.')
        }
        return
      } else if (
        issueInfo &&
        issueInfo.body &&
        issueInfo.state === 'closed' &&
        eventType === 'edited' &&
        changedEmptyTemplate(context, templateStrings) &&
        !isEmptyTemplate(issueInfo.body, templateStrings)
      ) {
        info(`Reopening #${issueInfo.number} because template was changed...`)
        if (!inputs.dry_run) {
          changeIssueState(
            owner,
            repo,
            issueInfo.number,
            'open',
            inputs.template_open_comment
          )
        } else {
          warning('DRY_RUN is enabled, skipping reopening of issue.')
        }
        return
      }
    }
    info('No action taken...')
    return
  } catch (error: unknown) {
    debug(inspect(error))
    if (error instanceof Error) {
      setFailed(error.message)
    }
  }
}

run()
