/* eslint-disable no-restricted-globals */
import makeSolver from "../makeSolver";
import { pathCost } from "../cost";

import {
  EVALUATING_PATH_COLOR,
  EVALUATING_SEGMENT_COLOR
} from "../../constants";

const setDifference = (setA, setB) => {
  const ret = new Set(setA);
  setB.forEach(p => {
    ret.delete(p);
  });
  return ret;
};

const bfs = async (points, path = [], visited = null) => {
  const MAX_QUEUE_SIZE = 100000;
  const MAX_ITERATIONS = 50000;

  if (visited === null) {
    if (points.length > 8) {
      console.warn(
        `BFS with ${points.length} points may be very slow. Recommended: ≤8 points.`
      );
    }

    const startPoint = points.shift();
    points = new Set(points);

    // Queue stores: [currentPath, visitedSet]
    const queue = [[[startPoint], new Set()]];

    let bestCost = null;
    let bestPath = null;
    let overallBest = null;
    let iterations = 0;

    while (queue.length > 0 && iterations < MAX_ITERATIONS) {
      iterations++;

      if (queue.length > MAX_QUEUE_SIZE) {
        console.warn(`BFS queue exceeded ${MAX_QUEUE_SIZE}. Terminating.`);
        break;
      }

      const [currentPath, currentVisited] = queue.shift();

      // VISUALISASI - tampilkan path yang sedang dievaluasi
      self.setEvaluatingPaths(
        () => ({
          paths: [
            {
              path: currentPath.slice(0, currentPath.length - 1),
              color: EVALUATING_SEGMENT_COLOR
            },
            {
              path: currentPath.slice(Math.max(0, currentPath.length - 2)),
              color: EVALUATING_PATH_COLOR
            }
          ]
        }),
        2
      );
      await self.sleep();

      const available = setDifference(points, currentVisited);

      if (available.size === 0) {
        // Path complete - return to start
        const backToStart = [...currentPath, startPoint];
        const cost = pathCost(backToStart);

        self.setEvaluatingPath(
          () => ({
            path: { path: backToStart, color: EVALUATING_SEGMENT_COLOR }
          }),
          cost
        );
        await self.sleep();

        if (bestCost === null || cost < bestCost) {
          bestCost = cost;
          bestPath = backToStart;

          if (overallBest === null || bestCost < overallBest) {
            overallBest = bestCost;
            self.setBestPath(bestPath, bestCost);
          }
        }
      } else {
        // Add all available next cities to queue
        for (const p of available) {
          const newVisited = new Set(currentVisited);
          newVisited.add(p);
          const newPath = [...currentPath, p];

          // Pruning: skip if current partial path is already too expensive
          const currentCost = pathCost(newPath);
          if (bestCost === null || currentCost < bestCost) {
            queue.push([newPath, newVisited]);
          }
        }
      }

      // Update status di setiap iterasi untuk feedback
      self.setEvaluatingPath(
        () => ({
          path: { path: currentPath, color: EVALUATING_SEGMENT_COLOR }
        }),
        2
      );
      await self.sleep();
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn(`BFS max iterations reached (${MAX_ITERATIONS}).`);
    }

    return [bestCost, bestPath];
  }
};

makeSolver(bfs);
