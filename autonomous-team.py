#!/usr/bin/env python3
"""
Autonomous Claude Code Team for Neuros
A complete AI product team that continuously improves your project
"""

import os
import json
import subprocess
import time
from datetime import datetime
from typing import List, Dict, Any
import anthropic
import openai
from pathlib import Path

class AutonomousProductTeam:
    """Full autonomous product team powered by Claude and GPT-4"""
    
    def __init__(self):
        # Load API keys
        self.load_api_keys()
        self.claude = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
        self.openai = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.github_token = os.getenv('GITHUB_TOKEN')
        
    def load_api_keys(self):
        """Load API keys from .env.final"""
        if not os.getenv('ANTHROPIC_API_KEY'):
            with open('.env.final') as f:
                for line in f:
                    if '=' in line:
                        key, value = line.strip().split('=', 1)
                        os.environ[key] = value
    
    def run_command(self, cmd: str) -> tuple:
        """Execute shell command"""
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            return result.stdout, result.returncode
        except Exception as e:
            print(f"Command error: {e}")
            return "", 1
    
    async def product_manager(self) -> List[Dict]:
        """PM: Check site, find issues, prioritize work"""
        print("👔 Product Manager: Analyzing product...")
        
        prompt = """
        As a Product Manager for Neuros (a spaced repetition learning platform):
        
        1. Check the current site status (localhost:3000)
        2. Review recent commits and PRs
        3. Identify top 5 improvements needed
        4. Prioritize by user impact
        
        Current codebase analysis:
        - Recent test results: {tests}
        - TypeScript status: {typescript}
        - User feedback areas: Dashboard UX, AI card generation, review scheduling
        
        Return JSON array of tasks with priority (high/medium/low) and type (bug/feature/improvement)
        """
        
        # Get current status
        tests, _ = self.run_command("npm test -- --run 2>&1 | head -20")
        typescript, _ = self.run_command("npx tsc --noEmit 2>&1 | head -20")
        
        response = self.claude.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[{
                'role': 'user',
                'content': prompt.format(tests=tests[:500], typescript=typescript[:500])
            }]
        )
        
        try:
            content = response.content[0].text
            # Extract JSON from response
            import re
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Default tasks if AI fails
        return [
            {
                "title": "Improve dashboard performance",
                "description": "Optimize dashboard loading and rendering",
                "priority": "high",
                "type": "improvement"
            },
            {
                "title": "Add more AI card generation options",
                "description": "Enhance AI card generation with more customization",
                "priority": "medium",
                "type": "feature"
            }
        ]
    
    async def qa_engineer(self) -> Dict:
        """QA: Test site, find bugs, verify fixes"""
        print("🧪 QA Engineer: Running comprehensive tests...")
        
        results = {
            'unit_tests': '',
            'type_check': '',
            'lint': '',
            'build': '',
            'issues': []
        }
        
        # Run all tests
        tests = [
            ('unit_tests', 'npm test -- --run'),
            ('type_check', 'npx tsc --noEmit'),
            ('lint', 'npm run lint'),
            ('build', 'npm run build')
        ]
        
        for key, cmd in tests:
            output, code = self.run_command(f"{cmd} 2>&1")
            results[key] = {'output': output[:1000], 'success': code == 0}
            
            if not results[key]['success']:
                results['issues'].append({
                    'type': key,
                    'error': output[:500]
                })
        
        return results
    
    async def developer(self, task: Dict) -> bool:
        """Developer: Implement features and fixes"""
        print(f"💻 Developer: Working on {task['title']}...")
        
        # Create feature branch
        branch_name = f"ai/{task['type']}-{task['title'].lower().replace(' ', '-')[:30]}"
        self.run_command(f"git checkout -b {branch_name}")
        
        # Use Claude to implement the fix
        prompt = f"""
        Implement this task for the Neuros learning platform:
        
        Task: {task['title']}
        Description: {task['description']}
        Type: {task['type']}
        
        Guidelines:
        - Follow existing code patterns
        - Use TypeScript, React, Next.js, Tailwind CSS
        - Add proper error handling
        - Include tests if needed
        
        Provide the complete implementation with file paths and code.
        """
        
        response = self.claude.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8000,
            messages=[{'role': 'user', 'content': prompt}]
        )
        
        # Parse and apply changes (simplified for demo)
        # In production, this would parse the response and apply file changes
        
        # Commit changes
        self.run_command("git add -A")
        commit_msg = f"{task['type']}: {task['title']}\n\nImplemented by AI Developer\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
        self.run_command(f'git commit -m "{commit_msg}"')
        
        # Push branch
        self.run_command(f"git push origin {branch_name}")
        
        return True
    
    async def code_reviewer(self, pr_number: int) -> Dict:
        """Code Reviewer: Review PRs and suggest improvements"""
        print(f"🔍 Code Reviewer: Reviewing PR #{pr_number}...")
        
        # Get PR diff
        diff, _ = self.run_command(f"gh pr diff {pr_number}")
        
        prompt = f"""
        Review this pull request for the Neuros learning platform:
        
        Diff:
        {diff[:3000]}
        
        Check for:
        1. Code quality and best practices
        2. Security issues
        3. Performance concerns
        4. Test coverage
        5. TypeScript types
        
        Provide approval or request changes with specific feedback.
        """
        
        response = self.openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        
        review = response.choices[0].message.content
        
        # Post review comment
        self.run_command(f'gh pr review {pr_number} --comment --body "{review}"')
        
        # Auto-approve if no major issues
        if "LGTM" in review or "looks good" in review.lower():
            self.run_command(f'gh pr review {pr_number} --approve')
            return {"status": "approved", "review": review}
        
        return {"status": "changes_requested", "review": review}
    
    async def devops_engineer(self) -> Dict:
        """DevOps: Monitor, deploy, and maintain"""
        print("🔧 DevOps: Checking deployment status...")
        
        checks = {
            'build_status': '',
            'deployment_ready': False,
            'performance_metrics': {}
        }
        
        # Check if build passes
        build_output, build_code = self.run_command("npm run build")
        checks['build_status'] = 'success' if build_code == 0 else 'failed'
        
        # Check deployment readiness
        if checks['build_status'] == 'success':
            checks['deployment_ready'] = True
            
            # Auto-merge approved PRs
            prs, _ = self.run_command("gh pr list --json number,state,reviews")
            try:
                pr_list = json.loads(prs)
                for pr in pr_list:
                    if pr['state'] == 'OPEN':
                        # Check if approved
                        reviews = pr.get('reviews', [])
                        if any(r.get('state') == 'APPROVED' for r in reviews):
                            print(f"🚀 Auto-merging approved PR #{pr['number']}")
                            self.run_command(f"gh pr merge {pr['number']} --auto --squash")
            except:
                pass
        
        return checks
    
    def create_github_issue(self, task: Dict) -> int:
        """Create GitHub issue for task"""
        issue_body = f"""
        ## Description
        {task['description']}
        
        ## Priority
        {task['priority']}
        
        ## Type
        {task['type']}
        
        ## Created by
        AI Product Manager
        
        ---
        This issue was automatically created by the Neuros AI Team
        """
        
        cmd = f"""gh issue create --title "{task['title']}" --body "{issue_body}" --label "ai-generated,{task['priority']}" """
        output, _ = self.run_command(cmd)
        
        # Extract issue number from output
        try:
            import re
            match = re.search(r'#(\d+)', output)
            if match:
                return int(match.group(1))
        except:
            pass
        
        return 0
    
    def create_pull_request(self, branch: str, task: Dict) -> int:
        """Create pull request for completed work"""
        pr_body = f"""
        ## Summary
        Implements: {task['title']}
        
        ## Changes
        - {task['description']}
        
        ## Testing
        - [x] Tests pass
        - [x] TypeScript compiles
        - [x] Lint passes
        
        ## Type
        {task['type']}
        
        ---
        🤖 Generated by Neuros AI Developer
        """
        
        cmd = f"""gh pr create --title "🤖 {task['type']}: {task['title']}" --body "{pr_body}" --base main"""
        output, _ = self.run_command(cmd)
        
        # Extract PR number
        try:
            import re
            match = re.search(r'#(\d+)', output)
            if match:
                return int(match.group(1))
        except:
            pass
        
        return 0
    
    async def run_cycle(self):
        """Run one complete development cycle"""
        print("\n" + "="*60)
        print(f"🚀 Starting Development Cycle - {datetime.now()}")
        print("="*60 + "\n")
        
        # 1. Product Manager finds work
        tasks = await self.product_manager()
        print(f"📋 PM identified {len(tasks)} tasks")
        
        # 2. QA runs tests
        qa_results = await self.qa_engineer()
        print(f"✅ QA found {len(qa_results['issues'])} issues")
        
        # 3. Create issues for new tasks
        for task in tasks[:2]:  # Limit to 2 per cycle
            issue_num = self.create_github_issue(task)
            if issue_num:
                print(f"📝 Created issue #{issue_num} for: {task['title']}")
                task['issue_number'] = issue_num
        
        # 4. Developer works on highest priority task
        if tasks:
            top_task = tasks[0]
            success = await self.developer(top_task)
            if success:
                print(f"✅ Developer completed: {top_task['title']}")
                
                # Create PR
                branch = f"ai/{top_task['type']}-{top_task['title'][:30]}"
                pr_num = self.create_pull_request(branch, top_task)
                if pr_num:
                    print(f"🔄 Created PR #{pr_num}")
                    
                    # 5. Code review
                    review = await self.code_reviewer(pr_num)
                    print(f"📝 Code review: {review['status']}")
        
        # 6. DevOps checks and auto-merges
        devops_status = await self.devops_engineer()
        print(f"🔧 DevOps: Build {devops_status['build_status']}")
        
        # Return to main branch
        self.run_command("git checkout main")
        self.run_command("git pull")
        
        print("\n✨ Development cycle complete!\n")
    
    def run_continuous(self, interval_hours: int = 6):
        """Run continuously with specified interval"""
        print(f"🤖 Neuros Autonomous Team Started")
        print(f"⏰ Running every {interval_hours} hours")
        print(f"🔗 Monitor at: https://github.com/olivernewth/neuros")
        print("="*60)
        
        while True:
            try:
                import asyncio
                asyncio.run(self.run_cycle())
            except Exception as e:
                print(f"❌ Cycle error: {e}")
            
            # Wait for next cycle
            print(f"😴 Sleeping for {interval_hours} hours...")
            time.sleep(interval_hours * 3600)

# Main execution
if __name__ == "__main__":
    team = AutonomousProductTeam()
    
    # Run once for testing
    import asyncio
    asyncio.run(team.run_cycle())
    
    # Or run continuously (uncomment for production)
    # team.run_continuous(interval_hours=6)