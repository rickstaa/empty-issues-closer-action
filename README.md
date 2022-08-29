<p align="center">
  <a href="https://github.com/rickstaa/empty-issues-closer-action/actions"><img alt="typescript-action status" src="https://github.com/rickstaa/empty-issues-closer-action/workflows/build-test/badge.svg"></a>
</p>

# Empty Issues Closer action

A [GitHub Action](https://github.com/features/actions) that closes empty issues or issues that contain an unchanged template.

-   Closes issues with an empty issue body.
-   Re-opens non-empty issues.
-   Closes issues which do not fill in the issue template.
-   Re-opens issues in which the issue template was filled in.

## Table of content

-   [Table of content](#table-of-content)
-   [Examples](#examples)
    -   [Empty issue closed](#empty-issue-closed)
    -   [Empty issue re-opened](#empty-issue-re-opened)
    -   [Template issue not filled in](#template-issue-not-filled-in)
    -   [Template issue re-opened](#template-issue-re-opened)
    -   [Pre-requisites](#pre-requisites)
    -   [Inputs](#inputs)
    -   [Outputs](#outputs)
    -   [Examples workflow - Close empty issues and unfiled templates](#examples-workflow---close-empty-issues-and-unfiled-templates)
-   [Contributing](#contributing)

## Examples

### Empty issue closed

### Empty issue re-opened

### Template issue not filled in

### Template issue re-opened

### Pre-requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#examples-workflow---create-dashboard-and-label-top-issues-bugs-features-and-pull-requests) is available below. For more information, reference the GitHub Help Documentation for [creating a workflow file](https://docs.github.com/en/actions/using-workflows#creating-a-workflow-file).

### Inputs

Various inputs are defined in [action.yml](action.yml) to let you configure the action:

| Name                     | Description                                                                                       | Default                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `github_token`           | Token used for authorizing interactions with the repository. Typically the `GITHUB_TOKEN` secret. | N/A                                                                                                                                 |
| `close_comment`          | Comment posted when a github issues is closed because it is empty.                                | Closing this issue because it appears to be empty. Please update the issue for it to be reopened.                                   |
| `open_comment`           | Comment posted when a github issues is reopened because it is no longer empty.                    | Reopening this issue because the author provided more information.                                                                  |
| `check_templates`        | Whether to also check for issues with unchanged issue templates.                                  | `false`                                                                                                                             |
| `template_close_comment` | Comment posted when a template issue is closed.                                                   | Closing this issue since the issue template was not filled in. Please provide us with more information to have this issue reopened. |
| `template_open_comment`  | Comment posted when a template issue is reopened.                                                 | Reopening this issue because the author provided more information.                                                                  |

### Outputs

This action currently does not have any outputs.

### Examples workflow - Close empty issues and unfiled templates

The following example uses the [issue](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) event to run the empty-issues-closer-action every time a issue is `opened`, `reopened` or `edited` with all features enabled.

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
    name: Close empty issues.
    runs-on: ubuntu-latest
    steps:
    - name: Run empty issues closer action
      uses: rickstaa/empty-issues-closer-action@v1
      env:
        github_token: ${{ secrets.GITHUB_TOKEN }}
      with:
        close_comment: Closing this issue because it appears to be empty. Please update the issue for it to be reopened.
        open_comment: Reopening this issue because the author provided more information.
        check_templates: false
        template_close_comment: Closing this issue since the issue template was not filled in. Please provide us with more information to have this issue reopened.
        template_open_comment: Reopening this issue because the author provided more information.
```

## Contributing

Feel free to open an issue if you have ideas on how to make this GitHub action better or if you want to report a bug! All contributions are welcome. :rocket: Please consult the [contribution guidelines](CONTRIBUTING.md) for more information.
