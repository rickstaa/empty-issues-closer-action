<p align="center">
  <a href="https://github.com/rickstaa/empty-issues-closer-action/actions"><img alt="typescript-action status" src="https://github.com/rickstaa/empty-issues-closer-action/workflows/build-test/badge.svg"></a>
</p>

# Empty Issues Closer action

A [GitHub Action](https://github.com/features/actions) that automatically closes empty issues or issues which contain an unchanged (markdown) template.

-   Closes issues with an empty issue body.
-   Reopens non-empty issues.
-   Closes issues which do not fill in the (markdown) issue template.
-   Reopens issues in which the (markdown) issue template was filled in.

## Table of content

- [Table of content](#table-of-content)
- [Examples](#examples)
  - [Empty issue closed](#empty-issue-closed)
  - [Non-empty issue re-opened](#non-empty-issue-re-opened)
- [Pre-requisites](#pre-requisites)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Examples workflow - Close empty issues](#examples-workflow---close-empty-issues)
- [Examples workflow - Close empty issues and templates](#examples-workflow---close-empty-issues-and-templates)
- [FAQ](#faq)
  - [How does this differ from the 'blank_issues_enabled' key in the template chooser config](#how-does-this-differ-from-the-blank_issues_enabled-key-in-the-template-chooser-config)
- [Contributing](#contributing)

## Examples

### Empty issue closed

![image](https://user-images.githubusercontent.com/17570430/187256477-10148629-787e-4433-a0b7-c1225a48e7e6.png)

### Non-empty issue re-opened

![image](https://user-images.githubusercontent.com/17570430/187256667-5ae14567-a618-48c6-8195-eb9b240a19b7.png)

## Pre-requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#examples-workflow---close-empty-issues-and-unfiled-templates) is available below. For more information, reference the GitHub Help Documentation for [creating a workflow file](https://docs.github.com/en/actions/using-workflows#creating-a-workflow-file).

## Inputs

Various inputs are defined in [action.yml](action.yml) to let you configure the action:

| Name                     | Description                                                                                       | Default                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `github_token`           | Token used for authorizing interactions with the repository. Typically the `GITHUB_TOKEN` secret. | N/A                                                                                                                                 |
| `close_comment`          | Comment posted when a GitHub issue is closed because it is empty.                                 | Closing this issue because it appears to be empty. Please update the issue for it to be reopened.                                   |
| `open_comment`           | Comment posted when a GitHub issue is reopened because it is no longer empty.                     | Reopening this issue because the author provided more information.                                                                  |
| `check_templates`        | Whether to also check for issues with unchanged issue templates.                                  | `false`                                                                                                                             |
| `template_close_comment` | Comment posted when a template issue is closed.                                                   | Closing this issue since the issue template was not filled in. Please provide us with more information to have this issue reopened. |
| `template_open_comment`  | Comment posted when a template issue is reopened.                                                 | Reopening this issue because the author provided more information.                                                                  |
| `dry_run`                | Run the action without actually closing/opening the issues.                                       | `false`                                                                                                                             |

> The action looks for markdown templates in the `.github/ISSUE_TEMPLATE` folder (see <https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository>). Please ensure that you added your templates to this folder for the `check_templates` action to work. This action only checks [markdown based issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/manually-creating-a-single-issue-template-for-your-repository#adding-an-issue-template) since for YAML based GitHub form schema templates GitHub provides the `validations` property which can be used to prevent empty form templates from being submitted.

## Outputs

This action currently does not have any outputs.

## Examples workflow - Close empty issues

The following example uses the [issue](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) event to run the empty-issues-closer-action every time an issue is `opened``, `reopened` or `edited` to close empty issues.

```yaml
name: Close empty issues
on:
  issues:
    types:
      - reopened
      - opened
      - edited

jobs:
  closeEmptyIssues:
    name: Close empty issues
    runs-on: ubuntu-latest
    steps:
    - name: Run empty issues closer action
      uses: rickstaa/empty-issues-closer-action@v1
      env:
        github_token: ${{ secrets.GITHUB_TOKEN }}
      with:
        close_comment: Closing this issue because it appears to be empty. Please update the issue for it to be reopened.
        open_comment: Reopening this issue because the author provided more information.
```

## Examples workflow - Close empty issues and templates

The following example uses the [issue](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) event to run the empty-issues-closer-action every time an issue is `opened`, `reopened` or `edited` with all features enabled.

```yaml
name: Close empty issues and templates
on:
  issues:
    types:
      - reopened
      - opened
      - edited

jobs:
  closeEmptyIssuesAndTemplates:
    name: Close empty issues and templates
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3 # NOTE: Retrieve issue templates.
    - name: Run empty issues closer action
      uses: rickstaa/empty-issues-closer-action@v1
      env:
        github_token: ${{ secrets.GITHUB_TOKEN }}
      with:
        close_comment: Closing this issue because it appears to be empty. Please update the issue for it to be reopened.
        open_comment: Reopening this issue because the author provided more information.
        check_templates: true
        template_close_comment: Closing this issue since the issue template was not filled in. Please provide us with more information to have this issue reopened.
        template_open_comment: Reopening this issue because the author provided more information.
```

> Please make sure that you use the [actions/checkout](https://github.com/actions/checkout) action to checkout the repository when you want to use the `check_templates` option.

## FAQ

### How does this differ from the 'blank_issues_enabled' key in the template chooser config

As of [October 28, 2019](https://github.blog/changelog/2019-10-28-new-issue-template-configuration-options/), users can use a template configuration file to configure the issue templates. The `blank_issues_enabled` option allows you to show or hide the 'Open a blank issue' choice when users select the 'New issue' button in your repository.

![Open a black issue](https://user-images.githubusercontent.com/17570430/194772445-0490b3a9-c431-4b47-93b3-3d1e4fc3b4db.png)

This option, however, doesn't prevent users from creating empty issues using the `/issues/new` path. This GitHub action automatically closes empty issues or issues with an unchanged template.

### How to prevent empty YAML-based templates from being submitted

For issue templates that are written in YAML (i.e. GitHub form schema templates), GitHub provides the `validations` property, which can be used to prevent empty templates from being submitted (see [the GitHub documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms) for more information).

## Contributing

Feel free to open an issue if you have ideas on how to make this GitHub action better or if you want to report a bug! All contributions are welcome. :rocket: Please consult the [contribution guidelines](CONTRIBUTING.md) for more information.
