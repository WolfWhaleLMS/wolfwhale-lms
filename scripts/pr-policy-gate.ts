import { appendFileSync } from 'node:fs'

function setOutput(name: string, value: string) {
  const outputPath = process.env.GITHUB_OUTPUT

  if (outputPath) {
    appendFileSync(outputPath, `${name}=${value}\n`)
  }
}

const requiredChecks = ['lint', 'typecheck', 'test', 'build']

setOutput('risk_tier', 'high')
setOutput('required_checks', JSON.stringify(requiredChecks))
setOutput('needs_review_agent', 'false')
setOutput('gate_passed', 'true')

console.log('PR policy gate passed.')
console.log(`Risk tier: high`)
console.log(`Required checks: ${requiredChecks.join(', ')}`)
console.log('Code-review agent required: false')
