#!/usr/bin/env python3
"""
Simple Autonomous Improvement Script for Neuros
Runs locally, finds issues, and creates GitHub PRs
"""

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Check for API keys
if not os.getenv('OPENAI_API_KEY'):
    print("Loading API keys from .env.final...")
    with open('.env.final') as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

def run_command(cmd):
    """Run shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout, result.returncode
    except Exception as e:
        print(f"Error running command: {e}")
        return "", 1

def find_issues():
    """Find issues in the codebase"""
    issues = []
    
    # Check for TypeScript errors
    print("🔍 Checking for TypeScript errors...")
    output, code = run_command("npx tsc --noEmit 2>&1 | head -20")
    if code != 0 and output:
        issues.append({
            'type': 'typescript',
            'description': 'TypeScript compilation errors',
            'details': output[:500]
        })
    
    # Check for failing tests
    print("🧪 Checking for test failures...")
    output, code = run_command("npm test -- --run 2>&1 | head -20")
    if "FAIL" in output or "Error" in output:
        issues.append({
            'type': 'test',
            'description': 'Failing tests detected',
            'details': output[:500]
        })
    
    # Check for ESLint issues
    print("📝 Checking for linting issues...")
    output, code = run_command("npm run lint 2>&1 | head -20")
    if code != 0 and output:
        issues.append({
            'type': 'lint',
            'description': 'ESLint violations',
            'details': output[:500]
        })
    
    return issues

def create_fix_branch():
    """Create a new branch for fixes"""
    branch_name = f"ai/fix-{datetime.now().strftime('%Y%m%d-%H%M')}"
    run_command(f"git checkout -b {branch_name}")
    return branch_name

def apply_simple_fixes(issues):
    """Apply simple automatic fixes"""
    fixes_applied = []
    
    for issue in issues:
        if issue['type'] == 'lint':
            print("🔧 Attempting to auto-fix linting issues...")
            output, code = run_command("npm run lint -- --fix")
            if code == 0:
                fixes_applied.append("Fixed linting issues")
        
        # Add more simple fixes here as needed
    
    return fixes_applied

def create_pr(branch_name, issues, fixes):
    """Create a pull request with the fixes"""
    # Commit changes
    run_command("git add -A")
    
    commit_msg = f"fix: AI-powered improvements - {datetime.now().strftime('%Y-%m-%d')}"
    if fixes:
        commit_msg += f"\n\n- {chr(10).join(fixes)}"
    
    run_command(f'git commit -m "{commit_msg}"')
    
    # Push branch
    run_command(f"git push origin {branch_name}")
    
    # Create PR using GitHub CLI
    pr_body = "## 🤖 AI-Powered Improvements\n\n"
    pr_body += "This PR was automatically generated to fix issues in the codebase.\n\n"
    
    if issues:
        pr_body += "### Issues Found:\n"
        for issue in issues:
            pr_body += f"- **{issue['type']}**: {issue['description']}\n"
    
    if fixes:
        pr_body += "\n### Fixes Applied:\n"
        for fix in fixes:
            pr_body += f"- ✅ {fix}\n"
    
    pr_cmd = f"""gh pr create --title "🤖 AI Improvements" --body "{pr_body}" --base main"""
    output, code = run_command(pr_cmd)
    
    if code == 0:
        print(f"✅ Pull request created: {output}")
    else:
        print(f"❌ Failed to create PR. Push successful, create manually at:")
        print(f"   https://github.com/olivernewth/neuros/compare/{branch_name}")

def main():
    print("🚀 Neuros AI Improvement System")
    print("================================\n")
    
    # Find issues
    issues = find_issues()
    
    if not issues:
        print("✅ No issues found! Codebase is looking good.")
        return
    
    print(f"\n📋 Found {len(issues)} issue(s) to address")
    
    # Create branch
    branch_name = create_fix_branch()
    print(f"🌿 Created branch: {branch_name}")
    
    # Apply fixes
    fixes = apply_simple_fixes(issues)
    
    if fixes:
        print(f"\n✅ Applied {len(fixes)} fix(es)")
        
        # Create PR
        create_pr(branch_name, issues, fixes)
    else:
        print("\n⚠️ No automatic fixes available. Manual intervention needed.")
        print("Issues found:")
        for issue in issues:
            print(f"  - {issue['type']}: {issue['description']}")
    
    # Return to main branch
    run_command("git checkout main")
    
    print("\n✨ Done! Check for PRs at: https://github.com/olivernewth/neuros/pulls")

if __name__ == "__main__":
    main()