'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'

interface Node extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'concept' | 'skill' | 'topic' | 'user'
  mastery?: number
  connections?: number
  size?: number
}

interface Edge {
  source: string
  target: string
  strength: number
  type: 'prerequisite' | 'related' | 'builds-on' | 'similar'
}

interface KnowledgeGraphProps {
  nodes: Node[]
  edges: Edge[]
  onNodeClick?: (node: Node) => void
  onEdgeClick?: (edge: Edge) => void
  width?: number
  height?: number
  interactive?: boolean
}

export default function KnowledgeGraph({
  nodes,
  edges,
  onNodeClick,
  onEdgeClick,
  width = 800,
  height = 600,
  interactive = true,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [graphStats, setGraphStats] = useState({
    totalNodes: 0,
    totalEdges: 0,
    avgConnections: 0,
    clusters: 0,
  })

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
    const g = svg.append('g')

    // Add zoom capabilities
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    if (interactive) {
      svg.call(zoom)
    }

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Edge>(edges)
        .id((d) => d.id)
        .distance((d) => 100 / d.strength))
      .force('charge', d3.forceManyBody<Node>()
        .strength(-300)
        .distanceMax(250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>()
        .radius((d) => (d.size || 20) + 5))

    // Add gradient definitions for edges
    const defs = svg.append('defs')
    
    // Create gradients for different edge types
    const edgeGradients = [
      { id: 'prerequisite', colors: ['#FF6B6B', '#4ECDC4'] },
      { id: 'related', colors: ['#95E1D3', '#3D5A80'] },
      { id: 'builds-on', colors: ['#FFE66D', '#FF6B6B'] },
      { id: 'similar', colors: ['#A8E6CF', '#7FD8BE'] },
    ]

    edgeGradients.forEach(gradient => {
      const grad = defs.append('linearGradient')
        .attr('id', gradient.id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%')

      grad.append('stop')
        .attr('offset', '0%')
        .style('stop-color', gradient.colors[0])
        .style('stop-opacity', 0.6)

      grad.append('stop')
        .attr('offset', '100%')
        .style('stop-color', gradient.colors[1])
        .style('stop-opacity', 0.6)
    })

    // Add glow filter for nodes
    const filter = defs.append('filter')
      .attr('id', 'glow')

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur')

    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Draw edges
    const link = g.append('g')
      .selectAll<SVGLineElement, d3.SimulationLinkDatum<Node>>('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', (d) => `url(#${d.type})`)
      .attr('stroke-width', (d) => Math.sqrt(d.strength * 5))
      .attr('stroke-linecap', 'round')
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('click', (event: MouseEvent, d: d3.SimulationLinkDatum<Node>) => {
        if (onEdgeClick) onEdgeClick(d as Edge)
      })

    // Draw nodes
    const node = g.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(nodes)
      .enter().append('g')
      .style('cursor', interactive ? 'pointer' : 'default')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add circles for nodes
    node.append('circle')
      .attr('r', (d) => d.size || 20)
      .attr('fill', (d) => {
        const colors: Record<Node['type'], string> = {
          concept: '#4ECDC4',
          skill: '#FF6B6B',
          topic: '#95E1D3',
          user: '#FFE66D',
        }
        return colors[d.type] || '#999'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)')
      .on('mouseover', (event: MouseEvent, d: Node) => {
        setHoveredNode(d)
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .attr('r', (d.size || 20) * 1.2)
      })
      .on('mouseout', (event: MouseEvent, d: Node) => {
        setHoveredNode(null)
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .attr('r', d.size || 20)
      })
      .on('click', (event: MouseEvent, d: Node) => {
        setSelectedNode(d)
        if (onNodeClick) onNodeClick(d)
      })

    // Add mastery indicator
    node.filter((d) => d.mastery !== undefined)
      .append('path')
      .attr('d', d3.arc<unknown, Node>()
        .innerRadius((d) => (d.size || 20) + 3)
        .outerRadius((d) => (d.size || 20) + 6)
        .startAngle(0)
        .endAngle((d) => (d.mastery || 0) * 2 * Math.PI))
      .attr('fill', '#10B981')
      .style('opacity', 0.8)

    // Add labels
    node.append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', (d) => (d.size || 20) + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#333')
      .style('pointer-events', 'none')
      .style('user-select', 'none')

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: d3.SimulationLinkDatum<Node>) => {
          const source = d.source as Node
          return source.x || 0
        })
        .attr('y1', (d: d3.SimulationLinkDatum<Node>) => {
          const source = d.source as Node
          return source.y || 0
        })
        .attr('x2', (d: d3.SimulationLinkDatum<Node>) => {
          const target = d.target as Node
          return target.x || 0
        })
        .attr('y2', (d: d3.SimulationLinkDatum<Node>) => {
          const target = d.target as Node
          return target.y || 0
        })

      node.attr('transform', (d: Node) => `translate(${d.x || 0},${d.y || 0})`)
    })

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Calculate graph statistics
    const avgConnections = edges.length / nodes.length
    const nodeDegrees = new Map<string, number>()
    
    edges.forEach(edge => {
      nodeDegrees.set(edge.source, (nodeDegrees.get(edge.source) || 0) + 1)
      nodeDegrees.set(edge.target, (nodeDegrees.get(edge.target) || 0) + 1)
    })

    // Simple cluster detection (connected components)
    const visited = new Set<string>()
    let clusters = 0
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        clusters++
        const queue = [node.id]
        while (queue.length > 0) {
          const current = queue.shift()!
          if (!visited.has(current)) {
            visited.add(current)
            edges.forEach(edge => {
              if (edge.source === current && !visited.has(edge.target)) {
                queue.push(edge.target)
              }
              if (edge.target === current && !visited.has(edge.source)) {
                queue.push(edge.source)
              }
            })
          }
        }
      }
    })

    setGraphStats({
      totalNodes: nodes.length,
      totalEdges: edges.length,
      avgConnections: Math.round(avgConnections * 10) / 10,
      clusters,
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, width, height, interactive, onNodeClick, onEdgeClick])

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10"
      >
        <h3 className="text-sm font-semibold mb-2">Knowledge Network</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Concepts:</span>
            <span className="font-medium">{graphStats.totalNodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connections:</span>
            <span className="font-medium">{graphStats.totalEdges}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Links:</span>
            <span className="font-medium">{graphStats.avgConnections}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Clusters:</span>
            <span className="font-medium">{graphStats.clusters}</span>
          </div>
        </div>
      </motion.div>

      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10 max-w-xs"
        >
          <h4 className="font-semibold text-sm mb-1">{hoveredNode.label}</h4>
          <p className="text-xs text-gray-600 capitalize">{hoveredNode.type}</p>
          {hoveredNode.mastery !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Mastery</span>
                <span>{Math.round(hoveredNode.mastery * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${hoveredNode.mastery * 100}%` }}
                />
              </div>
            </div>
          )}
          {hoveredNode.connections !== undefined && (
            <p className="text-xs mt-2">
              <span className="font-medium">{hoveredNode.connections}</span> connections
            </p>
          )}
        </motion.div>
      )}

      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white"
      />

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg z-10"
        >
          <p className="text-sm">
            Selected: <span className="font-semibold">{selectedNode.label}</span>
          </p>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Clear selection
          </button>
        </motion.div>
      )}
    </div>
  )
}