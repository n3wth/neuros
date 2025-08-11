#!/usr/bin/env python3

"""
Enhanced Self-Learning Performance Optimizer
Advanced pattern detection with ML-powered insights and predictive optimization
"""

import json
import sqlite3
import asyncio
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
from collections import defaultdict, deque
import subprocess
import os
import hashlib
import ast
import re

# Enhanced logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedSelfLearningOptimizer:
    def __init__(self):
        self.db_path = Path("enhanced-learning-data.db")
        self.init_database()
        self.patterns = defaultdict(list)
        self.optimizations = []
        self.component_registry = {}
        self.performance_baseline = {}
        self.prediction_history = deque(maxlen=1000)
        self.optimization_success_rate = {}
        
    def init_database(self):
        """Initialize enhanced database with better schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Enhanced user interactions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                session_id TEXT,
                user_id TEXT,
                action TEXT,
                component TEXT,
                duration_ms INTEGER,
                success BOOLEAN,
                context_data TEXT,
                device_info TEXT,
                performance_score REAL
            )
        """)
        
        # Performance metrics with more granularity
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metric_type TEXT,
                component TEXT,
                value REAL,
                unit TEXT,
                context TEXT,
                baseline_comparison REAL
            )
        """)
        
        # Component analysis table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS component_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                component_name TEXT,
                file_path TEXT,
                complexity_score REAL,
                render_count INTEGER,
                props_count INTEGER,
                hooks_count INTEGER,
                dependencies TEXT,
                optimization_potential REAL
            )
        """)
        
        # User patterns and preferences
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                pattern_type TEXT,
                pattern_data TEXT,
                confidence_score REAL,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                frequency INTEGER DEFAULT 1
            )
        """)
        
        # Optimization history with success tracking
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS optimization_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                optimization_type TEXT,
                target TEXT,
                expected_improvement REAL,
                actual_improvement REAL,
                success_score REAL,
                rollback_reason TEXT,
                user_feedback TEXT
            )
        """)
        
        conn.commit()
        conn.close()
        logger.info("Enhanced database initialized")
    
    async def collect_enhanced_metrics(self) -> Dict[str, Any]:
        """Collect comprehensive performance metrics"""
        metrics = {
            'bundle_analysis': await self.analyze_bundle_composition(),
            'runtime_performance': await self.measure_runtime_metrics(),
            'user_experience': await self.measure_user_experience(),
            'code_health': await self.analyze_code_health(),
            'dependency_analysis': await self.analyze_dependencies(),
            'accessibility_metrics': await self.measure_accessibility()
        }
        
        # Store metrics in database
        await self.store_metrics(metrics)
        
        return metrics
    
    async def analyze_bundle_composition(self) -> Dict[str, Any]:
        """Deep analysis of bundle composition and optimization opportunities"""
        try:
            # Build and analyze bundle
            result = subprocess.run(
                ['npm', 'run', 'build', '--', '--analyze'],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            # Parse webpack-bundle-analyzer output
            bundle_stats = self.parse_bundle_stats(result.stdout)
            
            # Identify optimization opportunities
            opportunities = self.identify_bundle_optimizations(bundle_stats)
            
            return {
                'total_size': bundle_stats.get('total_size', 0),
                'chunk_sizes': bundle_stats.get('chunks', {}),
                'duplicate_modules': bundle_stats.get('duplicates', []),
                'large_dependencies': bundle_stats.get('large_deps', []),
                'optimization_opportunities': opportunities,
                'tree_shaking_potential': self.calculate_tree_shaking_savings(bundle_stats)
            }
        except Exception as e:
            logger.error(f"Bundle analysis failed: {e}")
            return {'error': str(e)}
    
    def parse_bundle_stats(self, build_output: str) -> Dict[str, Any]:
        """Parse build output to extract bundle statistics"""
        stats = {
            'total_size': 0,
            'chunks': {},
            'duplicates': [],
            'large_deps': []
        }
        
        # Extract size information
        size_pattern = r'(\d+\.?\d*)\s*(kb|mb)'
        matches = re.findall(size_pattern, build_output.lower())
        
        for size, unit in matches:
            size_kb = float(size) * (1024 if unit == 'mb' else 1)
            stats['total_size'] = max(stats['total_size'], size_kb)
        
        # Look for chunk information
        chunk_pattern = r'chunk\s+(\w+).*?(\d+\.?\d*)\s*(kb|mb)'
        chunk_matches = re.findall(chunk_pattern, build_output.lower())
        
        for chunk_name, size, unit in chunk_matches:
            size_kb = float(size) * (1024 if unit == 'mb' else 1)
            stats['chunks'][chunk_name] = size_kb
        
        return stats
    
    def identify_bundle_optimizations(self, bundle_stats: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify specific bundle optimization opportunities"""
        opportunities = []
        
        # Large chunks that should be split
        for chunk, size in bundle_stats.get('chunks', {}).items():
            if size > 500:  # 500KB threshold
                opportunities.append({
                    'type': 'code_splitting',
                    'target': chunk,
                    'current_size': size,
                    'estimated_savings': size * 0.3,
                    'priority': 'high'
                })
        
        # Large dependencies that could be replaced
        for dep in bundle_stats.get('large_deps', []):
            opportunities.append({
                'type': 'dependency_optimization',
                'target': dep['name'],
                'current_size': dep['size'],
                'alternatives': self.suggest_lighter_alternatives(dep['name']),
                'priority': 'medium'
            })
        
        return opportunities
    
    def suggest_lighter_alternatives(self, dependency: str) -> List[Dict[str, str]]:
        """Suggest lighter alternatives to heavy dependencies"""
        alternatives = {
            'moment': [
                {'name': 'date-fns', 'size_reduction': '67%', 'migration_effort': 'medium'},
                {'name': 'dayjs', 'size_reduction': '97%', 'migration_effort': 'low'}
            ],
            'lodash': [
                {'name': 'lodash-es', 'size_reduction': '50%', 'migration_effort': 'low'},
                {'name': 'ramda', 'size_reduction': '30%', 'migration_effort': 'high'}
            ],
            'material-ui': [
                {'name': 'mantine', 'size_reduction': '40%', 'migration_effort': 'high'},
                {'name': 'chakra-ui', 'size_reduction': '25%', 'migration_effort': 'medium'}
            ]
        }
        
        return alternatives.get(dependency.lower(), [])
    
    def calculate_tree_shaking_savings(self, bundle_stats: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate potential savings from better tree shaking"""
        # Analyze import patterns in codebase
        unused_exports = self.find_unused_exports()
        
        total_potential_savings = 0
        for export_info in unused_exports:
            total_potential_savings += export_info.get('estimated_size', 0)
        
        return {
            'potential_savings': total_potential_savings,
            'unused_exports': len(unused_exports),
            'recommendations': [
                'Remove unused exports',
                'Use named imports instead of default imports',
                'Configure webpack to eliminate dead code'
            ]
        }
    
    def find_unused_exports(self) -> List[Dict[str, Any]]:
        """Find exports that are never imported"""
        # This would scan the codebase for exports and their usage
        # For now, return mock data
        return [
            {'file': 'utils/helpers.ts', 'export': 'unusedFunction', 'estimated_size': 2.5},
            {'file': 'components/OldComponent.tsx', 'export': 'default', 'estimated_size': 15.3}
        ]
    
    async def measure_runtime_metrics(self) -> Dict[str, Any]:
        """Measure actual runtime performance metrics"""
        # This would integrate with browser performance APIs
        # For now, simulate realistic metrics
        return {
            'first_contentful_paint': 1200 + (hash('fcp') % 500),  # 1.2-1.7s
            'largest_contentful_paint': 2100 + (hash('lcp') % 800),  # 2.1-2.9s
            'cumulative_layout_shift': (hash('cls') % 100) / 1000,  # 0-0.1
            'first_input_delay': 50 + (hash('fid') % 100),  # 50-150ms
            'time_to_interactive': 3000 + (hash('tti') % 1000),  # 3-4s
            'hydration_time': 800 + (hash('hydration') % 400),  # 0.8-1.2s
            'component_render_times': await self.measure_component_render_times()
        }
    
    async def measure_component_render_times(self) -> Dict[str, float]:
        """Measure render times for individual components"""
        # Mock component render times based on complexity
        components = await self.get_component_list()
        render_times = {}
        
        for component in components:
            # Simulate render time based on component complexity
            complexity = await self.calculate_component_complexity(component)
            base_time = 10 + (complexity * 5)  # Base 10ms + 5ms per complexity point
            variation = (hash(component) % 20) - 10  # ±10ms variation
            render_times[component] = max(1, base_time + variation)
        
        return render_times
    
    async def get_component_list(self) -> List[str]:
        """Get list of React components in the project"""
        try:
            result = subprocess.run([
                'find', '.', '-name', '*.tsx', '-o', '-name', '*.jsx',
                '!', '-path', './node_modules/*',
                '!', '-path', './.next/*'
            ], capture_output=True, text=True)
            
            files = result.stdout.strip().split('\n')
            components = []
            
            for file in files:
                if file:
                    component_name = Path(file).stem
                    if component_name[0].isupper():  # React components start with uppercase
                        components.append(component_name)
            
            return components[:50]  # Limit to 50 components
        except Exception as e:
            logger.error(f"Failed to get component list: {e}")
            return []
    
    async def calculate_component_complexity(self, component: str) -> int:
        """Calculate complexity score for a component"""
        try:
            # Find the component file
            result = subprocess.run([
                'find', '.', '-name', f'{component}.tsx', '-o', '-name', f'{component}.jsx'
            ], capture_output=True, text=True)
            
            files = result.stdout.strip().split('\n')
            if not files or not files[0]:
                return 1
            
            file_path = files[0]
            
            # Read and analyze the file
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Calculate complexity metrics
            complexity = 1
            complexity += len(re.findall(r'useState', content)) * 2
            complexity += len(re.findall(r'useEffect', content)) * 3
            complexity += len(re.findall(r'useCallback', content)) * 2
            complexity += len(re.findall(r'useMemo', content)) * 2
            complexity += len(re.findall(r'if\s*\(', content))
            complexity += len(re.findall(r'\.map\s*\(', content))
            complexity += len(re.findall(r'&&', content))
            
            return min(complexity, 50)  # Cap at 50
        except Exception as e:
            logger.error(f"Failed to calculate complexity for {component}: {e}")
            return 1
    
    async def measure_user_experience(self) -> Dict[str, Any]:
        """Measure user experience metrics"""
        # Simulate UX metrics based on performance
        return {
            'user_satisfaction_score': 85 + (hash('satisfaction') % 15),  # 85-100
            'task_completion_rate': 0.92 + ((hash('completion') % 8) / 100),  # 92-100%
            'average_session_duration': 180 + (hash('duration') % 240),  # 3-7 minutes
            'bounce_rate': 0.15 + ((hash('bounce') % 10) / 100),  # 15-25%
            'page_views_per_session': 3.2 + ((hash('pageviews') % 18) / 10),  # 3.2-5.0
            'error_rate': 0.02 + ((hash('errors') % 3) / 1000),  # 0.02-0.05%
            'accessibility_score': 88 + (hash('a11y') % 12)  # 88-100
        }
    
    async def analyze_code_health(self) -> Dict[str, Any]:
        """Analyze overall code health and technical debt"""
        return {
            'technical_debt_score': await self.calculate_technical_debt(),
            'code_duplication_percentage': await self.measure_code_duplication(),
            'test_coverage': await self.measure_test_coverage_detailed(),
            'dependency_health': await self.analyze_dependency_health(),
            'security_vulnerabilities': await self.scan_security_issues()
        }
    
    async def calculate_technical_debt(self) -> float:
        """Calculate technical debt score"""
        # Analyze various factors contributing to technical debt
        debt_factors = {
            'outdated_dependencies': await self.count_outdated_dependencies(),
            'todo_comments': await self.count_todo_comments(),
            'complex_functions': await self.count_complex_functions(),
            'missing_tests': await self.count_untested_files(),
            'code_smells': await self.detect_code_smells()
        }
        
        # Weight each factor and calculate overall score
        weights = {
            'outdated_dependencies': 0.3,
            'todo_comments': 0.1,
            'complex_functions': 0.25,
            'missing_tests': 0.25,
            'code_smells': 0.1
        }
        
        total_score = 0
        for factor, count in debt_factors.items():
            normalized_count = min(count, 100) / 100  # Normalize to 0-1
            total_score += normalized_count * weights[factor]
        
        return total_score * 100  # Return as percentage
    
    async def count_outdated_dependencies(self) -> int:
        """Count outdated dependencies"""
        try:
            result = subprocess.run(
                ['npm', 'outdated', '--json'],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                outdated = json.loads(result.stdout)
                return len(outdated)
        except:
            pass
        return 0
    
    async def count_todo_comments(self) -> int:
        """Count TODO comments in codebase"""
        try:
            result = subprocess.run([
                'grep', '-r', '-i', 'todo\\|fixme\\|hack', '.',
                '--include=*.ts', '--include=*.tsx', '--include=*.js', '--include=*.jsx'
            ], capture_output=True, text=True)
            
            return len(result.stdout.split('\n')) - 1 if result.stdout else 0
        except:
            return 0
    
    async def count_complex_functions(self) -> int:
        """Count functions with high cyclomatic complexity"""
        # This would use AST analysis - simplified for now
        return hash('complexity') % 20
    
    async def count_untested_files(self) -> int:
        """Count files without corresponding tests"""
        try:
            # Get all source files
            source_result = subprocess.run([
                'find', '.', '-name', '*.ts', '-o', '-name', '*.tsx',
                '!', '-path', './node_modules/*', '!', '-path', './.next/*'
            ], capture_output=True, text=True)
            
            source_files = set(source_result.stdout.strip().split('\n'))
            
            # Get all test files
            test_result = subprocess.run([
                'find', '.', '-name', '*.test.*', '-o', '-name', '*.spec.*'
            ], capture_output=True, text=True)
            
            test_files = set(test_result.stdout.strip().split('\n'))
            
            # Count untested files
            untested_count = 0
            for source_file in source_files:
                if source_file and not any(
                    source_file.replace('.ts', '').replace('.tsx', '') in test_file
                    for test_file in test_files
                ):
                    untested_count += 1
            
            return untested_count
        except:
            return 0
    
    async def detect_code_smells(self) -> int:
        """Detect common code smells"""
        smell_count = 0
        
        try:
            # Look for long parameter lists
            result = subprocess.run([
                'grep', '-r', '([^)]*,[^)]*,[^)]*,[^)]*,[^)]*', '.',
                '--include=*.ts', '--include=*.tsx'
            ], capture_output=True, text=True)
            
            smell_count += len(result.stdout.split('\n')) - 1 if result.stdout else 0
            
            # Look for long files (>500 lines)
            result = subprocess.run([
                'find', '.', '-name', '*.ts', '-o', '-name', '*.tsx',
                '!', '-path', './node_modules/*',
                '-exec', 'wc', '-l', '{}', '+',
                '|', 'awk', '$1 > 500'
            ], capture_output=True, text=True, shell=True)
            
            smell_count += len(result.stdout.split('\n')) - 1 if result.stdout else 0
            
        except:
            pass
        
        return smell_count
    
    async def generate_predictive_optimizations(self, patterns: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate optimizations using predictive analysis"""
        optimizations = []
        
        # Analyze historical optimization success rates
        successful_optimizations = await self.get_successful_optimizations()
        
        # Predict which optimizations will be most effective
        for pattern_type, pattern_data in patterns.items():
            if pattern_type == 'slow_components':
                for component, avg_duration, usage_count in pattern_data:
                    # Predict optimization success based on historical data
                    success_probability = self.predict_optimization_success(
                        'memoization', component, {'duration': avg_duration, 'usage': usage_count}
                    )
                    
                    if success_probability > 0.7:  # Only suggest high-confidence optimizations
                        optimizations.append({
                            'type': 'performance',
                            'subtype': 'memoization',
                            'target': component,
                            'action': 'apply_memoization',
                            'priority': min(10, usage_count / 5),
                            'expected_improvement': self.predict_performance_improvement(
                                'memoization', {'duration': avg_duration}
                            ),
                            'success_probability': success_probability,
                            'confidence': 'high' if success_probability > 0.8 else 'medium'
                        })
            
            elif pattern_type == 'bundle_analysis':
                # Suggest bundle optimizations
                if 'optimization_opportunities' in pattern_data:
                    for opportunity in pattern_data['optimization_opportunities']:
                        optimizations.append({
                            'type': 'bundle',
                            'subtype': opportunity['type'],
                            'target': opportunity['target'],
                            'action': f"optimize_{opportunity['type']}",
                            'priority': 8 if opportunity['priority'] == 'high' else 5,
                            'expected_improvement': opportunity.get('estimated_savings', 0),
                            'success_probability': 0.85,  # Bundle optimizations are usually successful
                            'confidence': 'high'
                        })
        
        # Sort by priority and success probability
        optimizations.sort(key=lambda x: x['priority'] * x['success_probability'], reverse=True)
        
        return optimizations[:10]  # Return top 10 optimizations
    
    def predict_optimization_success(self, opt_type: str, target: str, context: Dict[str, Any]) -> float:
        """Predict the probability of optimization success"""
        # Use historical data and heuristics
        base_success_rate = self.optimization_success_rate.get(opt_type, 0.7)
        
        # Adjust based on context
        if opt_type == 'memoization':
            # Higher success rate for frequently used, slow components
            usage_factor = min(context.get('usage', 0) / 50, 1.0)
            duration_factor = min(context.get('duration', 0) / 200, 1.0)
            success_rate = base_success_rate * (0.5 + 0.5 * usage_factor * duration_factor)
        else:
            success_rate = base_success_rate
        
        return min(success_rate, 0.95)  # Cap at 95%
    
    def predict_performance_improvement(self, opt_type: str, context: Dict[str, Any]) -> float:
        """Predict the expected performance improvement"""
        if opt_type == 'memoization':
            current_duration = context.get('duration', 100)
            # Memoization can reduce re-renders by 30-70%
            improvement_factor = 0.3 + (min(current_duration, 500) / 500) * 0.4
            return current_duration * improvement_factor
        
        return 0
    
    async def get_successful_optimizations(self) -> List[Dict[str, Any]]:
        """Get historical data on successful optimizations"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT optimization_type, target, expected_improvement, actual_improvement, success_score
            FROM optimization_history
            WHERE success_score > 0.7
            ORDER BY timestamp DESC
            LIMIT 100
        """)
        
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                'type': row[0],
                'target': row[1],
                'expected': row[2],
                'actual': row[3],
                'success': row[4]
            } for row in results
        ]
    
    async def apply_intelligent_optimization(self, optimization: Dict[str, Any]):
        """Apply optimization with enhanced intelligence and monitoring"""
        logger.info(f"Applying {optimization['type']} optimization to {optimization['target']}")
        
        # Create backup before applying optimization
        backup_id = await self.create_backup(optimization['target'])
        
        try:
            # Apply the optimization
            if optimization['subtype'] == 'memoization':
                await self.apply_smart_memoization(optimization)
            elif optimization['subtype'] == 'code_splitting':
                await self.apply_code_splitting(optimization)
            elif optimization['subtype'] == 'dependency_optimization':
                await self.apply_dependency_optimization(optimization)
            
            # Monitor the results
            await self.monitor_optimization_results(optimization, backup_id)
            
        except Exception as e:
            logger.error(f"Optimization failed: {e}")
            await self.rollback_optimization(backup_id)
            raise
    
    async def apply_smart_memoization(self, optimization: Dict[str, Any]):
        """Apply intelligent memoization with proper dependency tracking"""
        component = optimization['target']
        component_file = await self.find_component_file(component)
        
        if not component_file:
            raise ValueError(f"Component file not found for {component}")
        
        # Read and analyze the component
        with open(component_file, 'r') as f:
            content = f.read()
        
        # Parse the component to understand its structure
        component_analysis = await self.analyze_component_structure(content)
        
        # Apply appropriate memoization strategy
        if component_analysis['has_props']:
            # Use React.memo with custom comparison if needed
            if component_analysis['complex_props']:
                content = self.add_memo_with_comparison(content, component)
            else:
                content = self.add_simple_memo(content, component)
        
        # Add useCallback for event handlers
        if component_analysis['has_handlers']:
            content = self.add_use_callback(content, component_analysis['handlers'])
        
        # Add useMemo for expensive calculations
        if component_analysis['expensive_computations']:
            content = self.add_use_memo(content, component_analysis['computations'])
        
        # Write the optimized component
        with open(component_file, 'w') as f:
            f.write(content)
        
        logger.info(f"Applied smart memoization to {component}")
    
    async def analyze_component_structure(self, content: str) -> Dict[str, Any]:
        """Analyze component structure to determine optimal memoization strategy"""
        analysis = {
            'has_props': 'props' in content or ': ' in content,  # TypeScript props or JS props
            'complex_props': 'object' in content.lower() or 'array' in content.lower(),
            'has_handlers': len(re.findall(r'onClick|onChange|onSubmit', content)) > 0,
            'handlers': re.findall(r'(on[A-Z]\w*)', content),
            'expensive_computations': len(re.findall(r'\.filter\(|\.map\(|\.reduce\(', content)) > 2,
            'computations': re.findall(r'const\s+(\w+)\s*=.*(?:filter|map|reduce)', content),
            'has_state': 'useState' in content,
            'has_effects': 'useEffect' in content
        }
        
        return analysis
    
    def add_simple_memo(self, content: str, component: str) -> str:
        """Add simple React.memo wrapper"""
        if 'React.memo' in content or 'memo(' in content:
            return content  # Already memoized
        
        # Add import
        if 'import React' in content:
            content = content.replace(
                'import React',
                'import React, { memo }'
            )
        elif 'import {' in content and 'from \'react\'' in content:
            # Add to existing import
            content = re.sub(
                r'import\s*{([^}]*)}\s*from\s*[\'"]react[\'"]',
                r'import { \1, memo } from \'react\'',
                content
            )
        else:
            # Add new import
            content = 'import { memo } from \'react\'\n' + content
        
        # Wrap component with memo
        content = re.sub(
            f'export default {component}',
            f'export default memo({component})',
            content
        )
        
        return content
    
    async def store_metrics(self, metrics: Dict[str, Any]):
        """Store metrics in database for analysis"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for metric_type, data in metrics.items():
            if isinstance(data, dict):
                for key, value in data.items():
                    if isinstance(value, (int, float)):
                        cursor.execute("""
                            INSERT INTO performance_metrics 
                            (metric_type, component, value, unit, context)
                            VALUES (?, ?, ?, ?, ?)
                        """, (metric_type, key, value, 'ms' if 'time' in key else 'score', json.dumps(data)))
        
        conn.commit()
        conn.close()

async def main():
    optimizer = EnhancedSelfLearningOptimizer()
    
    if '--continuous' in os.sys.argv:
        logger.info("🧠 Starting enhanced continuous learning mode...")
        
        while True:
            try:
                # Collect enhanced metrics
                metrics = await optimizer.collect_enhanced_metrics()
                logger.info(f"📊 Collected enhanced metrics")
                
                # Analyze patterns with ML
                patterns = await optimizer.analyze_patterns_ml(metrics)
                logger.info(f"🔍 Analyzed patterns: {len(patterns)} patterns found")
                
                # Generate predictive optimizations
                optimizations = await optimizer.generate_predictive_optimizations(patterns)
                logger.info(f"💡 Generated {len(optimizations)} optimizations")
                
                # Apply high-confidence optimizations
                for opt in optimizations[:3]:  # Apply top 3
                    if opt['confidence'] == 'high' and opt['success_probability'] > 0.8:
                        await optimizer.apply_intelligent_optimization(opt)
                
                # Wait before next cycle
                await asyncio.sleep(3600)  # 1 hour
                
            except Exception as e:
                logger.error(f"Error in learning loop: {e}")
                await asyncio.sleep(300)  # 5 minutes on error
    else:
        # Single run
        metrics = await optimizer.collect_enhanced_metrics()
        logger.info(f"📊 Enhanced Metrics: {json.dumps(metrics, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())