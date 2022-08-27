/**
 * @ Contains utility functions and classes used in the application.
 */
/* eslint-disable import/first */ // NOTE: Makes sure env variables are loaded first.
import dotenv from 'dotenv'
dotenv.config()

import {getInput, setFailed} from '@actions/core'
import {getOctokit} from '@actions/github'

const GITHUB_TOKEN = getInput('github_token')

// Create octokit client
if (!GITHUB_TOKEN) setFailed('Github token is missing.')
export const octokit = getOctokit(GITHUB_TOKEN)
