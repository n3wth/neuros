#!/usr/bin/env python3
"""
AI Product Manager Agent
Autonomously manages the Neuros product development lifecycle
"""

import os
import json
import time
import schedule
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
import redis
import psycopg2
from github import Github
import openai
from anthropic import Anthropic
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/logs/product_manager.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AIProductManager:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        self.anthropic_client = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        self.github = Github(os.environ['GITHUB_TOKEN'])
        self.repo = self.github.get_repo('n3wth/neuros')
        self.redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
        self.setup_database()
        
    def setup_database(self):
        """Initialize PostgreSQL connection and tables"""
        self.db_conn = psycopg2.connect(
            host='postgres',
            database='neuros_ai',
            user='neuros',
            password=os.environ.get('POSTGRES_PASSWORD', 'neuros123')
        )
        cursor = self.db_conn.cursor()
        
        # Create tables for tracking work
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS product_decisions (
                id SERIAL PRIMARY KEY,
                decision_type VARCHAR(100),
                description TEXT,
                priority INTEGER,
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW(),
                completed_at TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_requests (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                description TEXT,
                user_value INTEGER,
                technical_complexity INTEGER,
                business_impact INTEGER,
                status VARCHAR(50),
                github_issue_id INTEGER,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        self.db_conn.commit()
        cursor.close()
        
    def analyze_user_feedback(self):
        """Analyze GitHub issues, discussions, and metrics to identify improvements"""
        logger.info("Analyzing user feedback and metrics...")
        
        # Get open issues
        issues = self.repo.get_issues(state='open')
        feedback_items = []
        
        for issue in issues[:20]:  # Limit to recent 20
            feedback_items.append({
                'title': issue.title,
                'body': issue.body[:500] if issue.body else '',
                'labels': [label.name for label in issue.labels],
                'comments': issue.comments,
                'created_at': issue.created_at.isoformat()
            })
        
        # Use AI to analyze and prioritize
        analysis_prompt = f"""
        As a Product Manager for Neuros (an AI-powered learning platform), analyze these user feedback items and identify:
        1. Top 3 high-impact improvements
        2. Quick wins (easy to implement, high value)
        3. Strategic long-term opportunities
        
        Feedback: {json.dumps(feedback_items, indent=2)}
        
        Return as JSON with structure:
        {{
            "high_impact": [{{title, description, estimated_impact}}],
            "quick_wins": [{{title, description, estimated_hours}}],
            "strategic": [{{title, description, timeline}}]
        }}
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "You are an expert product manager."},
                     {"role": "user", "content": analysis_prompt}],
            response_format={"type": "json_object"}
        )
        
        analysis = json.loads(response.choices[0].message.content)
        self.create_feature_requests(analysis)
        return analysis
    
    def create_feature_requests(self, analysis: Dict):
        """Convert analysis into actionable feature requests"""
        cursor = self.db_conn.cursor()
        
        # Process high-impact items
        for item in analysis.get('high_impact', []):
            # Check if already exists
            cursor.execute(
                "SELECT id FROM feature_requests WHERE title = %s",
                (item['title'],)
            )
            if not cursor.fetchone():
                # Create GitHub issue
                issue = self.repo.create_issue(
                    title=f"[Feature] {item['title']}",
                    body=f"{item['description']}\n\n**Impact:** {item.get('estimated_impact', 'High')}\n\n*Created by AI Product Manager*",
                    labels=['enhancement', 'ai-generated']
                )
                
                # Store in database
                cursor.execute("""
                    INSERT INTO feature_requests 
                    (title, description, user_value, technical_complexity, business_impact, status, github_issue_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    item['title'],
                    item['description'],
                    8,  # High value
                    5,  # Medium complexity (default)
                    9,  # High business impact
                    'pending',
                    issue.number
                ))
        
        # Process quick wins
        for item in analysis.get('quick_wins', []):
            cursor.execute(
                "SELECT id FROM feature_requests WHERE title = %s",
                (item['title'],)
            )
            if not cursor.fetchone():
                issue = self.repo.create_issue(
                    title=f"[Quick Win] {item['title']}",
                    body=f"{item['description']}\n\n**Estimated Hours:** {item.get('estimated_hours', '2-4')}\n\n*Created by AI Product Manager*",
                    labels=['good first issue', 'quick-win', 'ai-generated']
                )
                
                cursor.execute("""
                    INSERT INTO feature_requests 
                    (title, description, user_value, technical_complexity, business_impact, status, github_issue_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    item['title'],
                    item['description'],
                    7,  # Good value
                    2,  # Low complexity
                    6,  # Medium impact
                    'ready',
                    issue.number
                ))
        
        self.db_conn.commit()
        cursor.close()
        logger.info(f"Created {len(analysis.get('high_impact', [])) + len(analysis.get('quick_wins', []))} feature requests")
    
    def monitor_production(self):
        """Monitor production metrics and identify issues"""
        logger.info("Monitoring production environment...")
        
        # Check production health
        try:
            response = requests.get('https://neuros.newth.ai/api/health', timeout=10)
            health_status = response.json() if response.status_code == 200 else {'status': 'error'}
        except:
            health_status = {'status': 'unreachable'}
        
        # Check for error patterns in logs
        error_patterns = self.analyze_error_logs()
        
        # Performance metrics
        performance_metrics = self.get_performance_metrics()
        
        # AI analysis of health
        health_prompt = f"""
        Analyze the production health of Neuros:
        
        Health Status: {json.dumps(health_status)}
        Error Patterns: {json.dumps(error_patterns)}
        Performance: {json.dumps(performance_metrics)}
        
        Identify:
        1. Critical issues needing immediate attention
        2. Performance optimizations
        3. Stability improvements
        
        Return as JSON with actions to take.
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": health_prompt}],
            response_format={"type": "json_object"}
        )
        
        actions = json.loads(response.choices[0].message.content)
        
        # Create issues for critical problems
        for critical in actions.get('critical_issues', []):
            self.repo.create_issue(
                title=f"[Critical] {critical.get('title', 'Production Issue')}",
                body=critical.get('description', ''),
                labels=['bug', 'critical', 'ai-detected']
            )
        
        return actions
    
    def analyze_error_logs(self) -> List[Dict]:
        """Analyze application error logs"""
        # This would connect to your logging system
        # For now, returning mock data
        return [
            {"error": "Database connection timeout", "count": 3, "last_seen": "2024-01-10T10:00:00Z"},
            {"error": "Rate limit exceeded", "count": 12, "last_seen": "2024-01-10T09:30:00Z"}
        ]
    
    def get_performance_metrics(self) -> Dict:
        """Get application performance metrics"""
        # This would connect to your monitoring system
        return {
            "avg_response_time": "250ms",
            "p99_response_time": "1200ms",
            "error_rate": "0.02%",
            "uptime": "99.9%"
        }
    
    def plan_sprint(self):
        """Plan the next sprint based on priorities"""
        logger.info("Planning next sprint...")
        
        cursor = self.db_conn.cursor()
        
        # Get pending feature requests
        cursor.execute("""
            SELECT id, title, description, user_value, technical_complexity, business_impact
            FROM feature_requests
            WHERE status IN ('pending', 'ready')
            ORDER BY (user_value + business_impact - technical_complexity) DESC
            LIMIT 10
        """)
        
        features = cursor.fetchall()
        
        # Use AI to create sprint plan
        sprint_prompt = f"""
        Create a 2-week sprint plan for the Neuros development team.
        
        Available features (scored by value/complexity):
        {json.dumps([{
            'id': f[0], 'title': f[1], 'description': f[2],
            'user_value': f[3], 'complexity': f[4], 'business_impact': f[5]
        } for f in features], indent=2)}
        
        Consider:
        - Team capacity (assume 2 developers)
        - Balance between features and bug fixes
        - Dependencies between tasks
        
        Return as JSON with daily task assignments.
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": sprint_prompt}],
            response_format={"type": "json_object"}
        )
        
        sprint_plan = json.loads(response.choices[0].message.content)
        
        # Store sprint plan in Redis
        self.redis_client.setex(
            'current_sprint_plan',
            timedelta(days=14),
            json.dumps(sprint_plan)
        )
        
        # Update feature status
        for task in sprint_plan.get('tasks', []):
            if 'feature_id' in task:
                cursor.execute(
                    "UPDATE feature_requests SET status = 'in_sprint' WHERE id = %s",
                    (task['feature_id'],)
                )
        
        self.db_conn.commit()
        cursor.close()
        
        logger.info(f"Sprint planned with {len(sprint_plan.get('tasks', []))} tasks")
        return sprint_plan
    
    def generate_weekly_report(self):
        """Generate weekly progress report"""
        logger.info("Generating weekly report...")
        
        cursor = self.db_conn.cursor()
        
        # Get completed items
        cursor.execute("""
            SELECT COUNT(*) FROM feature_requests 
            WHERE status = 'completed' 
            AND created_at > NOW() - INTERVAL '7 days'
        """)
        completed_count = cursor.fetchone()[0]
        
        # Get in-progress items
        cursor.execute("""
            SELECT title FROM feature_requests 
            WHERE status IN ('in_progress', 'in_sprint')
        """)
        in_progress = cursor.fetchall()
        
        # Generate report using AI
        report_prompt = f"""
        Generate a weekly product update for Neuros:
        
        Completed this week: {completed_count} features
        In progress: {len(in_progress)} items
        
        Create an engaging update that includes:
        1. Key accomplishments
        2. What's coming next
        3. Metrics and KPIs
        4. Call to action for users
        
        Format as markdown.
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": report_prompt}]
        )
        
        report = response.choices[0].message.content
        
        # Create GitHub discussion
        # Note: GitHub API doesn't support discussions directly, so we create an issue
        self.repo.create_issue(
            title=f"Weekly Product Update - {datetime.now().strftime('%Y-%m-%d')}",
            body=report,
            labels=['announcement', 'weekly-update']
        )
        
        cursor.close()
        logger.info("Weekly report generated and posted")
        return report
    
    def run_continuous(self):
        """Main loop for continuous operation"""
        logger.info("AI Product Manager starting continuous operation...")
        
        # Schedule regular tasks
        schedule.every(4).hours.do(self.analyze_user_feedback)
        schedule.every(1).hours.do(self.monitor_production)
        schedule.every().monday.at("09:00").do(self.plan_sprint)
        schedule.every().friday.at("16:00").do(self.generate_weekly_report)
        
        # Run initial tasks
        self.analyze_user_feedback()
        self.monitor_production()
        
        # Keep running
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                time.sleep(300)  # Wait 5 minutes on error

if __name__ == "__main__":
    manager = AIProductManager()
    manager.run_continuous()