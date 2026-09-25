import { ESLint } from 'eslint';

async function runLint() {
  try {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(['src/**/*.{js,jsx}']);
    const totalErrors = results.reduce((acc, r) => acc + r.errorCount, 0);
    const totalWarnings = results.reduce((acc, r) => acc + r.warningCount, 0);

    if (totalErrors > 0 || totalWarnings > 0) {
      for (const r of results) {
        if (r.errorCount > 0 || r.warningCount > 0) {
          console.error(`\n${r.filePath}`);
          for (const m of r.messages) {
            console.error(`  Line ${m.line}:${m.column} [${m.ruleId}] ${m.message}`);
          }
        }
      }
      console.error(`\nESLint failed with ${totalErrors} error(s) and ${totalWarnings} warning(s).`);
      process.exit(1);
    } else {
      console.log(`✔ ESLint passed: 0 errors and 0 warnings across ${results.length} files.`);
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal linting error:', err);
    process.exit(1);
  }
}

runLint();
