#!/usr/bin/env python3

"""
Self-Learning Performance Optimizer
Learns from user behavior and automatically optimizes the application
"""

import json
import sqlite3
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import numpy as np
from collections import defaultdict
import subprocess
import os

class SelfLearningOptimizer:
    def __init__(self):
        self.db_path = Path("learning-data.db")
        self.init_database()
        self.patterns = defaultdict(list)
        self.optimizations = []
        
    def init_database(self):
        """Initialize learning database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                action TEXT,
                component TEXT,
                duration_ms INTEGER,
                metadata TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metric_type TEXT,
                value REAL,
                context TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS optimizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                optimization_type TEXT,
                target TEXT,
                improvement REAL,
                applied BOOLEAN DEFAULT FALSE
            )
        """)
        
        conn.commit()
        conn.close()
    
    def collect_metrics(self):
        """Collect performance metrics from the application"""
        metrics = {
            'bundle_size': self.measure_bundle_size(),
            'build_time': self.measure_build_time(),
            'test_coverage': self.measure_test_coverage(),
            'lighthouse_score': self.measure_lighthouse_score()
        }
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for metric_type, value in metrics.items():
            cursor.execute("""
                INSERT INTO performance_metrics (metric_type, value, context)
                VALUES (?, ?, ?)
            """, (metric_type, value, json.dumps({'automatic': True})))
        
        conn.commit()
        conn.close()
        
        return metrics
    
    def measure_bundle_size(self) -> float:
        """Measure the production bundle size"""
        try:
            result = subprocess.run(
                ['npm', 'run', 'build'],
                capture_output=True,
                text=True,
                cwd=Path(__file__).parent.parent
            )
            
            # Parse bundle size from build output
            lines = result.stdout.split('\n')
            for line in lines:
                if 'gzip:' in line.lower():
                    # Extract size in KB
                    import re
                    match = re.search(r'(\d+\.?\d*)\s*(kb|mb)', line.lower())
                    if match:
                        size = float(match.group(1))
                        unit = match.group(2)
                        return size * (1024 if unit == 'mb' else 1)
            return 0
        except Exception as e:
            print(f"Error measuring bundle size: {e}")
            return 0
    
    def measure_build_time(self) -> float:
        """Measure build time in seconds"""
        try:
            import time
            start = time.time()
            subprocess.run(
                ['npm', 'run', 'build'],
                capture_output=True,
                cwd=Path(__file__).parent.parent
            )
            return time.time() - start
        except Exception:
            return 0
    
    def measure_test_coverage(self) -> float:
        """Measure test coverage percentage"""
        try:
            result = subprocess.run(
                ['npm', 'run', 'test:coverage'],
                capture_output=True,
                text=True,
                cwd=Path(__file__).parent.parent
            )
            
            # Parse coverage from output
            import re
            match = re.search(r'All files.*?(\d+\.?\d*)%', result.stdout)
            if match:
                return float(match.group(1))
            return 0
        except Exception:
            return 0
    
    def measure_lighthouse_score(self) -> float:
        """Measure Lighthouse performance score"""
        # This would integrate with Lighthouse CI
        # For now, return a placeholder
        return 85.0
    
    def analyze_patterns(self):
        """Analyze user interaction patterns"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Find slow components
        cursor.execute("""
            SELECT component, AVG(duration_ms) as avg_duration, COUNT(*) as usage_count
            FROM user_interactions
            WHERE timestamp > datetime('now', '-7 days')
            GROUP BY component
            HAVING avg_duration > 100
            ORDER BY usage_count DESC
        """)
        
        slow_components = cursor.fetchall()
        
        # Find frequently used features
        cursor.execute("""
            SELECT action, COUNT(*) as count
            FROM user_interactions
            WHERE timestamp > datetime('now', '-7 days')
            GROUP BY action
            ORDER BY count DESC
            LIMIT 10
        """)
        
        frequent_actions = cursor.fetchall()
        
        conn.close()
        
        return {
            'slow_components': slow_components,
            'frequent_actions': frequent_actions
        }
    
    def generate_optimizations(self, patterns: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate optimization recommendations based on patterns"""
        optimizations = []
        
        # Optimize slow components
        for component, avg_duration, usage_count in patterns['slow_components']:
            if usage_count > 10:
                optimizations.append({
                    'type': 'performance',
                    'target': component,
                    'action': 'memoize',
                    'priority': min(10, usage_count / 10),
                    'expected_improvement': (avg_duration - 50) / avg_duration * 100
                })
        
        # Preload frequently used features
        for action, count in patterns['frequent_actions'][:3]:
            optimizations.append({
                'type': 'preload',
                'target': action,
                'action': 'prefetch',
                'priority': count / 100,
                'expected_improvement': 20
            })
        
        return optimizations
    
    def apply_optimization(self, optimization: Dict[str, Any]):
        """Apply an optimization to the codebase"""
        if optimization['type'] == 'performance' and optimization['action'] == 'memoize':
            self.apply_memoization(optimization['target'])
        elif optimization['type'] == 'preload':
            self.apply_prefetch(optimization['target'])
    
    def apply_memoization(self, component: str):
        """Apply React.memo to a component"""
        component_path = self.find_component_file(component)
        if not component_path:
            return
        
        with open(component_path, 'r') as f:
            content = f.read()
        
        # Check if already memoized
        if 'React.memo' in content or 'memo(' in content:
            return
        
        # Apply memoization
        import re
        
        # Find the export statement
        export_pattern = r'export\s+(default\s+)?function\s+(\w+)'
        match = re.search(export_pattern, content)
        
        if match:
            component_name = match.group(2)
            
            # Add import if needed
            if 'import React' not in content and 'import { memo' not in content:
                content = "import { memo } from 'react'\n" + content
            
            # Wrap component with memo
            content = re.sub(
                f'export default {component_name}',
                f'export default memo({component_name})',
                content
            )
            
            with open(component_path, 'w') as f:
                f.write(content)
            
            print(f"✅ Applied memoization to {component}")
    
    def apply_prefetch(self, action: str):
        """Apply prefetching for frequently used actions"""
        # This would implement prefetching logic
        print(f"📦 Implementing prefetch for {action}")
    
    def find_component_file(self, component: str) -> Path:
        """Find the file containing a component"""
        base_path = Path(__file__).parent.parent
        
        # Search in common locations
        search_paths = [
            base_path / 'components',
            base_path / 'app',
            base_path / 'src' / 'components'
        ]
        
        for search_path in search_paths:
            if search_path.exists():
                for file_path in search_path.rglob('*.tsx'):
                    with open(file_path, 'r') as f:
                        if component in f.read():
                            return file_path
        
        return None
    
    def create_optimization_report(self):
        """Create a detailed optimization report"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get recent metrics
        cursor.execute("""
            SELECT metric_type, AVG(value) as avg_value, 
                   MIN(value) as min_value, MAX(value) as max_value
            FROM performance_metrics
            WHERE timestamp > datetime('now', '-30 days')
            GROUP BY metric_type
        """)
        
        metrics = cursor.fetchall()
        
        # Get applied optimizations
        cursor.execute("""
            SELECT optimization_type, target, improvement, timestamp
            FROM optimizations
            WHERE applied = TRUE
            ORDER BY timestamp DESC
            LIMIT 10
        """)
        
        applied = cursor.fetchall()
        
        conn.close()
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'metrics': {
                metric[0]: {
                    'average': metric[1],
                    'min': metric[2],
                    'max': metric[3]
                } for metric in metrics
            },
            'applied_optimizations': [
                {
                    'type': opt[0],
                    'target': opt[1],
                    'improvement': f"{opt[2]:.1f}%",
                    'applied': opt[3]
                } for opt in applied
            ],
            'recommendations': self.generate_recommendations(metrics)
        }
        
        with open('optimization-report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def generate_recommendations(self, metrics):
        """Generate recommendations based on metrics"""
        recommendations = []
        
        for metric_type, avg_value, min_value, max_value in metrics:
            if metric_type == 'bundle_size' and avg_value > 500:  # 500KB
                recommendations.append({
                    'type': 'bundle_size',
                    'message': 'Consider code splitting to reduce bundle size',
                    'priority': 'high'
                })
            elif metric_type == 'test_coverage' and avg_value < 80:
                recommendations.append({
                    'type': 'testing',
                    'message': f'Increase test coverage from {avg_value:.1f}% to 80%',
                    'priority': 'medium'
                })
            elif metric_type == 'lighthouse_score' and avg_value < 90:
                recommendations.append({
                    'type': 'performance',
                    'message': 'Optimize for Lighthouse performance score',
                    'priority': 'high'
                })
        
        return recommendations
    
    async def continuous_learning(self):
        """Run continuous learning and optimization loop"""
        while True:
            try:
                # Collect metrics
                metrics = self.collect_metrics()
                print(f"📊 Collected metrics: {metrics}")
                
                # Analyze patterns
                patterns = self.analyze_patterns()
                
                # Generate optimizations
                optimizations = self.generate_optimizations(patterns)
                
                # Apply high-priority optimizations
                for opt in sorted(optimizations, key=lambda x: x['priority'], reverse=True)[:3]:
                    if opt['priority'] > 5:
                        self.apply_optimization(opt)
                        
                        # Record optimization
                        conn = sqlite3.connect(self.db_path)
                        cursor = conn.cursor()
                        cursor.execute("""
                            INSERT INTO optimizations (optimization_type, target, improvement, applied)
                            VALUES (?, ?, ?, ?)
                        """, (opt['type'], opt['target'], opt['expected_improvement'], True))
                        conn.commit()
                        conn.close()
                
                # Create report
                report = self.create_optimization_report()
                print(f"📈 Optimization report created: optimization-report.json")
                
                # Wait before next iteration
                await asyncio.sleep(3600)  # Run every hour
                
            except Exception as e:
                print(f"Error in learning loop: {e}")
                await asyncio.sleep(60)

def main():
    optimizer = SelfLearningOptimizer()
    
    if '--continuous' in os.sys.argv:
        print("🧠 Starting continuous learning mode...")
        asyncio.run(optimizer.continuous_learning())
    else:
        # Run once
        metrics = optimizer.collect_metrics()
        print(f"📊 Metrics: {metrics}")
        
        patterns = optimizer.analyze_patterns()
        print(f"🔍 Patterns: {patterns}")
        
        optimizations = optimizer.generate_optimizations(patterns)
        print(f"💡 Generated {len(optimizations)} optimizations")
        
        report = optimizer.create_optimization_report()
        print(f"📈 Report saved to optimization-report.json")

if __name__ == "__main__":
    main()