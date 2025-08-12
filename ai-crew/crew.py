#!/usr/bin/env python3
"""
Autonomous Development Crew for Neuros
This runs continuously to improve the codebase
"""

import os
import subprocess
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

from crewai import Agent, Crew, Process, Task
from crewai_tools import FileReadTool, FileWriteTool, DirectoryReadTool
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Initialize models
gpt4 = ChatOpenAI(model="gpt-4o", api_key=OPENAI_API_KEY)
claude = ChatAnthropic(model="claude-3-5-sonnet-20241022", api_key=ANTHROPIC_API_KEY)

# Tools
file_read = FileReadTool()
file_write = FileWriteTool()
directory_read = DirectoryReadTool()

class NeurosDevCrew:
    """Autonomous development crew for the Neuros project"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        
    def code_analyzer(self) -> Agent:
        return Agent(
            role="Senior Code Analyst",
            goal="Analyze the Neuros codebase to identify bugs, performance issues, and improvement opportunities",
            backstory="""You are an expert code analyst with 15 years of experience in 
            TypeScript, React, and Next.js applications. You specialize in finding subtle bugs,
            performance bottlenecks, and architectural improvements. You have a keen eye for
            code quality and best practices.""",
            verbose=True,
            allow_delegation=True,
            llm=claude,
            tools=[file_read, directory_read]
        )
    
    def developer(self) -> Agent:
        return Agent(
            role="Full Stack Developer", 
            goal="Implement improvements and fixes for the Neuros learning platform",
            backstory="""You are a skilled full-stack developer specializing in Next.js, 
            TypeScript, and Supabase. You write clean, efficient, and well-tested code.
            You follow the existing code patterns and conventions in the project.""",
            verbose=True,
            allow_delegation=False,
            llm=gpt4,
            tools=[file_read, file_write]
        )
    
    def qa_engineer(self) -> Agent:
        return Agent(
            role="QA Engineer",
            goal="Write tests and ensure code quality for all changes",
            backstory="""You are a meticulous QA engineer who ensures all code changes
            are properly tested. You write comprehensive tests using Vitest and Playwright,
            and you verify that all changes maintain backward compatibility.""",
            verbose=True,
            allow_delegation=False,
            llm=claude,
            tools=[file_read, file_write]
        )
    
    def product_manager(self) -> Agent:
        return Agent(
            role="Product Manager",
            goal="Prioritize improvements based on user impact and business value",
            backstory="""You are a product manager for the Neuros learning platform.
            You understand spaced repetition, learning science, and user needs.
            You prioritize work that improves the learning experience and platform reliability.""",
            verbose=True,
            allow_delegation=True,
            llm=gpt4
        )
    
    def analyze_task(self) -> Task:
        return Task(
            description="""
            Analyze the Neuros codebase and identify the top 5 most important improvements:
            1. Check for failing tests by reading test files
            2. Look for TypeScript errors in the codebase
            3. Identify components lacking proper error handling
            4. Find opportunities for performance optimization
            5. Detect code duplication or architectural issues
            
            Focus on the core learning features:
            - Card creation and AI generation
            - Spaced repetition algorithm
            - Dashboard and review system
            - User authentication flow
            
            Output a prioritized list of improvements with specific file locations.
            """,
            expected_output="A detailed analysis report with 5 prioritized improvements",
            agent=self.code_analyzer()
        )
    
    def prioritize_task(self) -> Task:
        return Task(
            description="""
            Review the analysis and prioritize the improvements based on:
            1. User impact - How many users will benefit?
            2. Business value - Does it improve core learning features?
            3. Technical debt - Will it prevent future issues?
            4. Implementation effort - Can it be done in a few hours?
            
            Select the TOP 3 improvements to implement in this session.
            """,
            expected_output="A prioritized list of 3 improvements to implement",
            agent=self.product_manager()
        )
    
    def implement_task(self) -> Task:
        return Task(
            description="""
            Implement the top 3 prioritized improvements:
            1. Read the relevant files carefully
            2. Make the necessary code changes following existing patterns
            3. Ensure TypeScript types are correct
            4. Add proper error handling
            5. Follow the project's code style (Tailwind, shadcn/ui)
            
            For each change:
            - Explain what you're fixing and why
            - Show the before and after code
            - Ensure no breaking changes
            """,
            expected_output="Code changes implemented in the relevant files",
            agent=self.developer()
        )
    
    def test_task(self) -> Task:
        return Task(
            description="""
            Write tests for the implemented changes:
            1. Add unit tests using Vitest for new functions
            2. Add component tests for UI changes
            3. Ensure existing tests still pass
            4. Verify TypeScript compilation succeeds
            
            Test files should be co-located with source files.
            Follow the existing test patterns in the project.
            """,
            expected_output="Test files created or updated with comprehensive test coverage",
            agent=self.qa_engineer()
        )
    
    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.code_analyzer(),
                self.product_manager(),
                self.developer(),
                self.qa_engineer()
            ],
            tasks=[
                self.analyze_task(),
                self.prioritize_task(),
                self.implement_task(),
                self.test_task()
            ],
            process=Process.sequential,
            verbose=True
        )
    
    def run(self):
        """Execute the crew and create a pull request with changes"""
        print(f"🚀 Starting Neuros Dev Crew at {datetime.now()}")
        
        # Create a new branch
        branch_name = f"ai/improvements-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        subprocess.run(["git", "checkout", "-b", branch_name], cwd=self.project_root)
        
        try:
            # Run the crew
            result = self.crew().kickoff()
            print(f"✅ Crew completed: {result}")
            
            # Run tests
            print("🧪 Running tests...")
            test_result = subprocess.run(
                ["npm", "test"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            if test_result.returncode == 0:
                print("✅ All tests passed!")
                
                # Commit changes
                subprocess.run(["git", "add", "-A"], cwd=self.project_root)
                subprocess.run([
                    "git", "commit", "-m", 
                    f"feat: AI improvements - {datetime.now().strftime('%Y-%m-%d')}\n\n{result.raw[:500]}"
                ], cwd=self.project_root)
                
                # Push branch
                subprocess.run(["git", "push", "origin", branch_name], cwd=self.project_root)
                
                print(f"✅ Pushed branch: {branch_name}")
                print("📝 Create a pull request at: https://github.com/olivernewth/neuros/compare")
            else:
                print("❌ Tests failed, not committing changes")
                print(test_result.stdout)
                print(test_result.stderr)
                
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            # Return to main branch
            subprocess.run(["git", "checkout", "main"], cwd=self.project_root)

if __name__ == "__main__":
    crew = NeurosDevCrew()
    crew.run()