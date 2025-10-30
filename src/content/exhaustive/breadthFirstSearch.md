---
type: exhaustive
order: 3
solverKey: breadthFirstSearch
friendlyName: Breadth First Search (BFS)
defaults:
  evaluatingDetailLevel: 2
  maxEvaluatingDetailLevel: 2
---

# Breadth First Search (BFS)

Breadth First Search is an exhaustive search algorithm that explores the solution space level by level. For the Traveling Salesman Problem, it systematically examines all possible tours by expanding nodes in a breadth-first manner using a queue data structure.

## How it works

1. **Initialization**: Start with a queue containing the initial city
2. **Level-by-level exploration**:
   - Dequeue a state from the front of the queue
   - If all cities have been visited, complete the tour and check if it's the best solution
   - Otherwise, add all unvisited cities to the queue
3. **Pruning**: Skip partial paths that are already longer than the current best solution
4. **Termination**: Continue until the queue is empty

## Characteristics

- **Completeness**: Guaranteed to find the optimal solution (if it runs to completion)
- **Time Complexity**: O(n!) where n is the number of cities
- **Space Complexity**: O(n!) due to queue storage
- **Optimality**: Finds the shortest tour when allowed to complete

## Implementation

```javascript
const bfs = async (points, path = [], visited = null) => {
  if (visited === null) {
    const startPoint = points.shift();
    points = new Set(points);
    const queue = [[startPoint], new Set()];

    let bestCost = null;
    let bestPath = null;

    while (queue.length > 0) {
      const [currentPath, currentVisited] = queue.shift();

      const available = setDifference(points, currentVisited);

      if (available.size === 0) {
        const backToStart = [...currentPath, startPoint];
        const cost = pathCost(backToStart);

        if (bestCost === null || cost < bestCost) {
          bestCost = cost;
          bestPath = backToStart;
          self.setBestPath(bestPath, bestCost);
        }
      } else {
        for (const p of available) {
          const newVisited = new Set(currentVisited);
          newVisited.add(p);
          const newPath = [...currentPath, p];
          queue.push([newPath, newVisited]);
        }
      }
    }
    return [bestCost, bestPath];
  }
};
```

## When to use

- Small number of cities (typically < 10)
- When you need a guaranteed optimal solution
- Educational purposes to understand exhaustive search
- Comparing with Depth First Search

## Comparison with DFS

- BFS explores all paths at depth d before exploring depth d+1
- DFS goes as deep as possible before backtracking
- BFS typically uses more memory but finds shorter paths earlier
- Both have the same worst-case time complexity for TSP
