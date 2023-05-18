const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

console.info("Prepare commit message")

const options = {
  encoding: 'utf-8',
}
const branchNames = childProcess.execSync('git branch', options)
const branchNameRegex = /^\* ((bugfix|chore|feat(ure)?))\/(I\d{1,5})/m
const branchNameMatch = branchNames.match(branchNameRegex)
const issueId = branchNameMatch?.[4]

if (issueId) {
  const commitMessagePath = path.resolve(__dirname, '../.git/COMMIT_EDITMSG')
  const originalCommitMessage = fs.readFileSync(commitMessagePath, options)
  if (
    !originalCommitMessage.startsWith(issueId) &&
    !originalCommitMessage.startsWith('Merge')
  ) {
    fs.writeFileSync(commitMessagePath, `${issueId} ${originalCommitMessage}`, options)
  }
}
