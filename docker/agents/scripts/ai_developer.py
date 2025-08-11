#!/usr/bin/env python3
"""
AI Developer Agent - The Core Autonomous Development Engine
Leads the development of Neuros with full autonomy
"""

import os
import json
import time
import subprocess
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import redis
import psycopg2
from github import Github
import openai
from anthropic import Anthropic
import ast
import black
import isort
import schedule

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/logs/ai_developer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AIAutonomousDeveloper:
    """
    Autonomous AI Developer that can:
    - Analyze and fix bugs
    - Implement new features
    - Refactor code
    - Write tests
    - Deploy changes
    """
    
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        self.anthropic_client = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        self.github = Github(os.environ['GITHUB_TOKEN'])
        self.repo = self.github.get_repo('n3wth/neuros')
        self.redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
        self.workspace = '/workspace'
        self.setup_database()
        self.setup_git()
        
    def setup_database(self):
        """Initialize database for tracking development work"""
        self.db_conn = psycopg2.connect(
            host='postgres',
            database='neuros_ai',
            user='neuros',
            password=os.environ.get('POSTGRES_PASSWORD', 'neuros123')
        )
        cursor = self.db_conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS development_tasks (
                id SERIAL PRIMARY KEY,
                task_type VARCHAR(50),
                description TEXT,
                status VARCHAR(50),
                github_issue_id INTEGER,
                pull_request_id INTEGER,
                branch_name VARCHAR(100),
                test_results JSONB,
                created_at TIMESTAMP DEFAULT NOW(),
                completed_at TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS code_improvements (
                id SERIAL PRIMARY KEY,
                file_path VARCHAR(255),
                improvement_type VARCHAR(50),
                before_metrics JSONB,
                after_metrics JSONB,
                applied BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        self.db_conn.commit()
        cursor.close()
        
    def setup_git(self):
        """Configure git for autonomous commits"""
        subprocess.run(['git', 'config', '--global', 'user.name', 'AI Developer'], cwd=self.workspace)
        subprocess.run(['git', 'config', '--global', 'user.email', 'ai@neuros.newth.ai'], cwd=self.workspace)
        
    def get_priority_issues(self) -> List[Dict]:
        """Get high-priority issues to work on"""
        issues = self.repo.get_issues(state='open', labels=['bug', 'enhancement', 'ai-approved'])
        priority_issues = []
        
        for issue in issues[:10]:
            # Analyze issue priority using AI
            priority_score = self.calculate_issue_priority(issue)
            priority_issues.append({
                'number': issue.number,
                'title': issue.title,
                'body': issue.body,
                'labels': [l.name for l in issue.labels],
                'priority': priority_score
            })
        
        # Sort by priority
        priority_issues.sort(key=lambda x: x['priority'], reverse=True)
        return priority_issues[:3]  # Work on top 3
        
    def calculate_issue_priority(self, issue) -> int:
        """Calculate priority score for an issue"""
        score = 0
        
        # Bug fixes are high priority
        if any(label.name == 'bug' for label in issue.labels):
            score += 10
            
        # Critical issues are highest priority  
        if any(label.name == 'critical' for label in issue.labels):
            score += 20
            
        # User-reported issues get priority
        if issue.user.login != 'ai-developer':
            score += 5
            
        # Older issues get slight priority
        age_days = (datetime.now() - issue.created_at.replace(tzinfo=None)).days
        score += min(age_days // 7, 5)
        
        return score
        
    def implement_feature(self, issue: Dict) -> bool:
        """Autonomously implement a feature or fix"""
        logger.info(f"Working on issue #{issue['number']}: {issue['title']}")
        
        # Create a new branch
        branch_name = f"ai-fix-{issue['number']}-{datetime.now().strftime('%Y%m%d%H%M')}"
        self.create_branch(branch_name)
        
        # Analyze the issue using AI
        implementation_plan = self.create_implementation_plan(issue)
        
        # Execute the implementation
        success = self.execute_implementation(implementation_plan, issue)
        
        if success:
            # Run tests
            test_results = self.run_tests()
            
            if test_results['passed']:
                # Create pull request
                pr = self.create_pull_request(branch_name, issue)
                
                # Run CI checks
                if self.wait_for_ci(pr):
                    # Auto-merge if all checks pass
                    if os.environ.get('AUTO_MERGE', 'false') == 'true':
                        pr.merge(merge_method='squash')
                        logger.info(f"Successfully merged PR #{pr.number}")
                    return True
                    
        # Clean up on failure
        self.cleanup_branch(branch_name)
        return False
        
    def create_implementation_plan(self, issue: Dict) -> Dict:
        """Use AI to create a detailed implementation plan"""
        
        # Get current codebase context
        codebase_context = self.analyze_codebase_for_issue(issue)
        
        prompt = f"""
        As an expert full-stack developer, create a detailed implementation plan for this issue:
        
        Issue: {issue['title']}
        Description: {issue['body']}
        Labels: {issue['labels']}
        
        Relevant codebase context:
        {json.dumps(codebase_context, indent=2)}
        
        Create a step-by-step implementation plan including:
        1. Files to modify or create
        2. Specific code changes needed
        3. Tests to write
        4. Potential risks or side effects
        
        Return as JSON with structure:
        {{
            "steps": [
                {{
                    "action": "modify|create|delete",
                    "file": "path/to/file",
                    "changes": "description of changes",
                    "code": "actual code to write"
                }}
            ],
            "tests": [
                {{
                    "file": "path/to/test",
                    "description": "what to test",
                    "code": "test code"
                }}
            ],
            "risks": ["list of risks"]
        }}
        """
        
        response = self.anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Parse response
        plan_text = response.content[0].text
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\{[\s\S]*\}', plan_text)
        if json_match:
            return json.loads(json_match.group())
        else:
            return {"steps": [], "tests": [], "risks": []}
            
    def analyze_codebase_for_issue(self, issue: Dict) -> Dict:
        """Analyze relevant parts of codebase for the issue"""
        context = {}
        
        # Search for relevant files based on issue content
        search_terms = self.extract_search_terms(issue)
        
        for term in search_terms:
            # Search for files containing the term
            result = subprocess.run(
                ['grep', '-r', '--include=*.ts', '--include=*.tsx', '--include=*.js', 
                 '--include=*.jsx', '-l', term, self.workspace],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                files = result.stdout.strip().split('\n')[:5]  # Limit to 5 files
                for file in files:
                    if os.path.exists(file):
                        with open(file, 'r') as f:
                            context[file] = f.read()[:1000]  # First 1000 chars
                            
        return context
        
    def extract_search_terms(self, issue: Dict) -> List[str]:
        """Extract search terms from issue"""
        # Use AI to extract relevant search terms
        prompt = f"""
        Extract 3-5 key technical search terms from this issue that would help find relevant code:
        Title: {issue['title']}
        Body: {issue['body'][:500]}
        
        Return as a simple list of terms, one per line.
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        
        terms = response.choices[0].message.content.strip().split('\n')
        return [term.strip() for term in terms if term.strip()]
        
    def execute_implementation(self, plan: Dict, issue: Dict) -> bool:
        """Execute the implementation plan"""
        try:
            # Execute each step
            for step in plan.get('steps', []):
                if step['action'] == 'modify':
                    self.modify_file(step['file'], step['code'])
                elif step['action'] == 'create':
                    self.create_file(step['file'], step['code'])
                elif step['action'] == 'delete':
                    self.delete_file(step['file'])
                    
            # Write tests
            for test in plan.get('tests', []):
                self.create_file(test['file'], test['code'])
                
            # Commit changes
            self.commit_changes(f"Fix: {issue['title']} (#{issue['number']})")
            
            return True
            
        except Exception as e:
            logger.error(f"Implementation failed: {e}")
            return False
            
    def modify_file(self, filepath: str, new_code: str):
        """Modify an existing file with new code"""
        full_path = os.path.join(self.workspace, filepath)
        
        if not os.path.exists(full_path):
            logger.warning(f"File not found: {filepath}")
            return
            
        # Format code based on file extension
        if filepath.endswith('.py'):
            new_code = black.format_str(new_code, mode=black.FileMode())
            new_code = isort.code(new_code)
            
        with open(full_path, 'w') as f:
            f.write(new_code)
            
        logger.info(f"Modified {filepath}")
        
    def create_file(self, filepath: str, code: str):
        """Create a new file"""
        full_path = os.path.join(self.workspace, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Format code
        if filepath.endswith('.py'):
            code = black.format_str(code, mode=black.FileMode())
            code = isort.code(code)
            
        with open(full_path, 'w') as f:
            f.write(code)
            
        logger.info(f"Created {filepath}")
        
    def delete_file(self, filepath: str):
        """Delete a file"""
        full_path = os.path.join(self.workspace, filepath)
        if os.path.exists(full_path):
            os.remove(full_path)
            logger.info(f"Deleted {filepath}")
            
    def run_tests(self) -> Dict:
        """Run the test suite"""
        logger.info("Running tests...")
        
        # Run Next.js tests
        result = subprocess.run(
            ['npm', 'run', 'test'],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        
        # Run type checking
        type_result = subprocess.run(
            ['npm', 'run', 'typecheck'],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        
        # Run linting
        lint_result = subprocess.run(
            ['npm', 'run', 'lint'],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        
        return {
            'passed': result.returncode == 0 and type_result.returncode == 0 and lint_result.returncode == 0,
            'test_output': result.stdout + result.stderr,
            'type_output': type_result.stdout + type_result.stderr,
            'lint_output': lint_result.stdout + lint_result.stderr
        }
        
    def create_branch(self, branch_name: str):
        """Create and checkout a new branch"""
        subprocess.run(['git', 'checkout', 'main'], cwd=self.workspace)
        subprocess.run(['git', 'pull', 'origin', 'main'], cwd=self.workspace)
        subprocess.run(['git', 'checkout', '-b', branch_name], cwd=self.workspace)
        logger.info(f"Created branch {branch_name}")
        
    def commit_changes(self, message: str):
        """Commit all changes"""
        subprocess.run(['git', 'add', '.'], cwd=self.workspace)
        subprocess.run(['git', 'commit', '-m', message], cwd=self.workspace)
        logger.info(f"Committed changes: {message}")
        
    def create_pull_request(self, branch_name: str, issue: Dict):
        """Create a pull request"""
        # Push branch
        subprocess.run(['git', 'push', 'origin', branch_name], cwd=self.workspace)
        
        # Create PR via GitHub API
        pr_body = f"""
        ## Summary
        This PR addresses issue #{issue['number']}: {issue['title']}
        
        ## Changes
        - Implemented fix as described in the issue
        - Added comprehensive tests
        - Verified all tests pass
        
        ## Testing
        - ✅ All unit tests pass
        - ✅ Type checking passes
        - ✅ Linting passes
        
        ## Notes
        This PR was created autonomously by the AI Developer agent.
        
        Closes #{issue['number']}
        """
        
        pr = self.repo.create_pull(
            title=f"Fix: {issue['title']}",
            body=pr_body,
            head=branch_name,
            base='main'
        )
        
        logger.info(f"Created PR #{pr.number}")
        return pr
        
    def wait_for_ci(self, pr, timeout=600) -> bool:
        """Wait for CI checks to complete"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            pr.update()
            
            # Check if all required checks have passed
            commits = pr.get_commits()
            last_commit = commits.reversed[0]
            statuses = last_commit.get_combined_status()
            
            if statuses.state == 'success':
                logger.info("All CI checks passed")
                return True
            elif statuses.state == 'failure':
                logger.error("CI checks failed")
                return False
                
            time.sleep(30)  # Check every 30 seconds
            
        logger.error("CI checks timed out")
        return False
        
    def cleanup_branch(self, branch_name: str):
        """Clean up failed branch"""
        subprocess.run(['git', 'checkout', 'main'], cwd=self.workspace)
        subprocess.run(['git', 'branch', '-D', branch_name], cwd=self.workspace)
        logger.info(f"Cleaned up branch {branch_name}")
        
    def continuous_improvement(self):
        """Continuously analyze and improve the codebase"""
        logger.info("Starting continuous improvement cycle...")
        
        while True:
            try:
                # Get priority issues
                issues = self.get_priority_issues()
                
                if issues:
                    # Work on highest priority issue
                    issue = issues[0]
                    success = self.implement_feature(issue)
                    
                    if success:
                        logger.info(f"Successfully implemented issue #{issue['number']}")
                        # Mark in database
                        self.record_task_completion(issue)
                    else:
                        logger.error(f"Failed to implement issue #{issue['number']}")
                        
                else:
                    # No issues, look for code improvements
                    self.find_and_apply_improvements()
                    
                # Take a break before next cycle
                time.sleep(300)  # 5 minutes
                
            except Exception as e:
                logger.error(f"Error in continuous improvement: {e}")
                time.sleep(600)  # 10 minutes on error
                
    def find_and_apply_improvements(self):
        """Find opportunities for code improvement"""
        logger.info("Looking for code improvement opportunities...")
        
        # Analyze code quality metrics
        metrics = self.analyze_code_quality()
        
        # Use AI to suggest improvements
        improvements = self.suggest_improvements(metrics)
        
        # Apply high-value improvements
        for improvement in improvements[:1]:  # Apply one at a time
            self.apply_improvement(improvement)
            
    def analyze_code_quality(self) -> Dict:
        """Analyze overall code quality"""
        # Run complexity analysis
        complexity_result = subprocess.run(
            ['npx', 'code-complexity', 'src/', '--format', 'json'],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        
        # Get test coverage
        coverage_result = subprocess.run(
            ['npm', 'run', 'test:coverage'],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        
        return {
            'complexity': complexity_result.stdout,
            'coverage': coverage_result.stdout,
            'timestamp': datetime.now().isoformat()
        }
        
    def suggest_improvements(self, metrics: Dict) -> List[Dict]:
        """Use AI to suggest code improvements"""
        prompt = f"""
        Analyze these code quality metrics and suggest 3 high-impact improvements:
        
        Metrics:
        {json.dumps(metrics, indent=2)}
        
        Focus on:
        1. Performance optimizations
        2. Code maintainability
        3. Test coverage gaps
        4. Security improvements
        
        Return as JSON array with structure:
        [{{
            "type": "performance|maintainability|testing|security",
            "file": "path/to/file",
            "description": "what to improve",
            "implementation": "how to implement"
        }}]
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content).get('improvements', [])
        
    def apply_improvement(self, improvement: Dict):
        """Apply a code improvement"""
        logger.info(f"Applying improvement: {improvement['description']}")
        
        # Create branch
        branch_name = f"ai-improve-{improvement['type']}-{datetime.now().strftime('%Y%m%d%H%M')}"
        self.create_branch(branch_name)
        
        # Implement the improvement
        # This would use AI to generate the actual code changes
        # For now, logging the intention
        logger.info(f"Would implement: {improvement['implementation']}")
        
        # Record in database
        cursor = self.db_conn.cursor()
        cursor.execute("""
            INSERT INTO code_improvements (file_path, improvement_type, before_metrics, applied)
            VALUES (%s, %s, %s, %s)
        """, (improvement['file'], improvement['type'], json.dumps(improvement), False))
        self.db_conn.commit()
        cursor.close()
        
    def record_task_completion(self, issue: Dict):
        """Record completed task in database"""
        cursor = self.db_conn.cursor()
        cursor.execute("""
            INSERT INTO development_tasks (task_type, description, status, github_issue_id, completed_at)
            VALUES (%s, %s, %s, %s, NOW())
        """, ('issue', issue['title'], 'completed', issue['number']))
        self.db_conn.commit()
        cursor.close()
        
    def run(self):
        """Main entry point"""
        logger.info("AI Developer Agent starting...")
        
        # Start continuous improvement
        self.continuous_improvement()

if __name__ == "__main__":
    developer = AIAutonomousDeveloper()
    developer.run()