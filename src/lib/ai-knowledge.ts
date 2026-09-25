/**
 * CampusPilot AI - Comprehensive Domain Knowledge Base & Reasoning Engine
 * Grounded in Computer Science, Machine Learning, Cloud Architecture, and Software Engineering.
 */

export interface KnowledgeTopic {
  keywords: string[];
  title: string;
  category: string;
  summary: string;
  explanation: string;
  codeSnippet?: string;
  keyPoints: string[];
  recommendedCourse: string;
}

export const CS_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // --- PYTHON & BACKEND ENGINEERING ---
  {
    keywords: ['python', 'async', 'await', 'asyncio', 'event loop', 'coroutine'],
    title: 'Asynchronous Programming in Python (AsyncIO)',
    category: 'Programming & Backend',
    summary: 'Single-threaded cooperative multitasking using an event loop to handle concurrent I/O operations efficiently.',
    explanation: 'Python uses cooperative multitasking with `asyncio`. Instead of preemptive OS threads that carry high context-switching overhead, coroutines yield control via `await` whenever an I/O operation (database query, network call) blocks, allowing other coroutines to execute in the interim.',
    codeSnippet: `import asyncio

async def fetch_competency_telemetry(user_id: str):
    print(f"Fetching metrics for user {user_id}...")
    await asyncio.sleep(1.0)  # Simulates asynchronous network/DB latency
    return {"user_id": user_id, "score": 94.5}

async def main():
    # Execute multiple asynchronous tasks concurrently
    users = ["user_1", "user_2", "user_3"]
    results = await asyncio.gather(*(fetch_competency_telemetry(u) for u in users))
    print("Telemetry gathered:", results)

asyncio.run(main())`,
    keyPoints: [
      'Single-threaded event loop eliminates thread lock contention (GIL).',
      'Always use `await` on non-blocking async libraries (like `httpx`, `asyncpg`, `aiofiles`).',
      'CPU-bound tasks should use `ProcessPoolExecutor`, not `asyncio`.'
    ],
    recommendedCourse: 'Advanced Python for Production Engineering & Microservices'
  },
  {
    keywords: ['metaclass', 'decorators', 'dunder', 'generator', 'yield', 'decorator'],
    title: 'Advanced Python: Decorators, Generators & Metaprogramming',
    category: 'Programming & Backend',
    summary: 'Higher-order functions, memory-efficient iterators, and class construction metaprogramming.',
    explanation: 'Decorators wrap functions to extend behavior (timing, caching, authorization) without modifying the original code. Generators use the `yield` statement to produce items lazily on demand, keeping memory footprint O(1) regardless of dataset scale.',
    codeSnippet: `import time
from functools import wraps

def audit_execution_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        print(f"[{func.__name__}] executed in {duration:.2f}ms")
        return result
    return wrapper

# Memory-efficient streaming generator
def stream_large_dataset(chunk_size=1000):
    for i in range(0, 1_000_000, chunk_size):
        yield [x for x in range(i, i + chunk_size)]`,
    keyPoints: [
      '`functools.wraps` preserves docstrings and function signatures in decorators.',
      'Generators enable processing multi-gigabyte telemetry datasets with minimal RAM.',
      'Metaclasses inherit from `type` and control class validation during module load.'
    ],
    recommendedCourse: 'Advanced Python for Production Engineering & Microservices'
  },

  // --- DATABASES & POSTGRESQL ---
  {
    keywords: ['postgres', 'postgresql', 'database', 'b-tree', 'gin', 'index', 'indexing', 'btree'],
    title: 'PostgreSQL Indexing: B-Tree vs. GIN Indexes',
    category: 'Databases & Storage',
    summary: 'Optimizing query throughput using appropriate index architectures for scalar values vs composite data structures.',
    explanation: 'PostgreSQL provides multiple index mechanisms. **B-Tree** (Balanced Tree) is the default and optimal for scalar, equality, and range comparisons (`=`, `<`, `>`, `BETWEEN`). **GIN** (Generalized Inverted Index) is designed for composite and multi-element types like JSONB, arrays, and full-text search, mapping elements to row IDs.',
    codeSnippet: `-- Standard B-Tree index for scalar lookups and ranges
CREATE INDEX idx_enrollments_progress ON course_enrollments(progress);

-- Composite B-Tree index for multi-column filtering
CREATE INDEX idx_attempts_user_assessment ON assessment_attempts(trainee_id, assessment_id);

-- GIN index for full-text search or JSONB telemetry
CREATE INDEX idx_courses_skills_gin ON courses USING gin(to_tsvector('english', target_skills));

-- Check execution plan performance
EXPLAIN ANALYZE SELECT * FROM courses WHERE target_skills ILIKE '%python%';`,
    keyPoints: [
      'B-Tree indexes maintain sorted order with logarithmic O(log N) lookup complexity.',
      'GIN indexes have higher update costs but deliver sub-millisecond search across complex JSONB/arrays.',
      'Always run `EXPLAIN ANALYZE` to verify index scans vs sequential table scans.'
    ],
    recommendedCourse: 'Advanced Python for Production Engineering & Microservices'
  },
  {
    keywords: ['acid', 'transaction', 'isolation', 'deadlock', 'wal', 'foreign key'],
    title: 'Database Transactions & ACID Isolation Levels',
    category: 'Databases & Storage',
    summary: 'Atomicity, Consistency, Isolation, and Durability guarantees in relational databases.',
    explanation: 'PostgreSQL relies on Multiversion Concurrency Control (MVCC) to ensure ACID compliance. Readers never block writers, and writers never block readers. Isolation levels range from Read Committed (default) to Serializable (preventing write skew and phantom reads).',
    codeSnippet: `-- Safe transaction with atomic commit
BEGIN;
  UPDATE trainee_competencies 
  SET current_level = current_level + 1 
  WHERE trainee_id = 'user-123' AND competency_id = 'comp-456';

  INSERT INTO notifications (user_id, title, message, type)
  VALUES ('user-123', 'Competency Level Upgraded', 'Verified Level 3/5 achieved.', 'ALERT');
COMMIT;`,
    keyPoints: [
      'Write-Ahead Logging (WAL) ensures durability across server crashes.',
      'Use `SELECT ... FOR UPDATE` when executing conditional balance/state updates to prevent race conditions.',
      'Connection pooling (e.g., PgBouncer) prevents backend connection exhaustion.'
    ],
    recommendedCourse: 'Cloud Architecture & Enterprise Microservices'
  },

  // --- MACHINE LEARNING & NEURAL NETWORKS ---
  {
    keywords: ['machine learning', 'ml', 'backprop', 'backpropagation', 'gradient descent', 'loss', 'optimizer'],
    title: 'Gradient Descent Optimization & Backpropagation',
    category: 'Artificial Intelligence',
    summary: 'Mathematical formulation of reverse-mode automatic differentiation and iterative weight optimization.',
    explanation: 'Backpropagation computes the partial derivatives of the loss function \\(L\\) with respect to all trainable weights \\(W\\) using the chain rule of calculus. Gradient descent updates parameters in the direction opposite to the gradient to minimize empirical loss.',
    codeSnippet: `import torch
import torch.nn as nn

# Define a 2-layer Neural Network in PyTorch
class CapacityPredictor(nn.Module):
    def __init__(self, input_dim=8, hidden_dim=32, output_dim=1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

model = CapacityPredictor()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.MSELoss()`,
    keyPoints: [
      'Chain rule enables reverse propagation of error signals without recomputing intermediate values.',
      'Adam optimizer combines Momentum (exponential moving average of gradients) and RMSProp (moving average of squared gradients).',
      'Batch normalization and residual connections prevent vanishing gradients in deep networks.'
    ],
    recommendedCourse: 'Machine Learning & Neural Systems Mastery'
  },
  {
    keywords: ['overfitting', 'regularization', 'bias variance', 'l1', 'l2', 'dropout'],
    title: 'Addressing Overfitting: Bias-Variance Tradeoff & Regularization',
    category: 'Artificial Intelligence',
    summary: 'Techniques to improve model generalization on unseen validation and production data.',
    explanation: 'Overfitting occurs when a high-capacity model memorizes training noise rather than capturing the underlying distribution. Techniques like L2 weight decay, L1 sparsity penalties, Dropout, Early Stopping, and Data Augmentation constrain parameter capacity to ensure strong generalizability.',
    codeSnippet: `# Scikit-Learn Regularization Pipeline
from sklearn.linear_model import Ridge, Lasso
from sklearn.model_selection import cross_val_score

# Ridge (L2 penalty) prevents extreme weight magnitudes
ridge = Ridge(alpha=1.0)
# Lasso (L1 penalty) drives redundant weights to exactly zero
lasso = Lasso(alpha=0.1)

# PyTorch Dropout layer
dropout = nn.Dropout(p=0.3)  # Zeroes 30% of activations randomly during training`,
    keyPoints: [
      'High Bias = Underfitting (model too simplistic). High Variance = Overfitting (model over-parameterized).',
      'L2 Regularization shrinks weights quadratically; L1 promotes sparse feature selection.',
      'Always split into Train, Validation, and Test sets using stratified sampling.'
    ],
    recommendedCourse: 'Machine Learning & Neural Systems Mastery'
  },

  // --- CLOUD, DOCKER & MICROSERVICES ---
  {
    keywords: ['docker', 'container', 'dockerfile', 'kubernetes', 'k8s', 'microservices'],
    title: 'Containerization with Docker & Microservices Architecture',
    category: 'Cloud & Infrastructure',
    summary: 'Packaging applications into immutable OCI-compliant runtime containers and decoupling enterprise services.',
    explanation: 'Docker isolates process runtimes using Linux namespaces (PID, NET, MNT) and cgroups (CPU, RAM limits). Multi-stage Docker builds separate build dependencies from the final minimal production image (using Alpine or Distroless), reducing attack surface and image size.',
    codeSnippet: `# Multi-stage production Dockerfile for Next.js / Node
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
    keyPoints: [
      'Containers share the host kernel while maintaining strict namespace process isolation.',
      'Decouple microservices using asynchronous message brokers (RabbitMQ/Kafka) to prevent cascading failures.',
      'Kubernetes Deployments manage horizontal pod autoscaling (HPA) and zero-downtime rolling updates.'
    ],
    recommendedCourse: 'Cloud Architecture & Enterprise Microservices'
  },
  {
    keywords: ['rest', 'api', 'http', 'grpc', 'graphql', 'authentication', 'jwt'],
    title: 'RESTful API Design & Stateless JWT Authentication',
    category: 'Software Architecture',
    summary: 'Standards for building robust, scalable HTTP APIs with JSON Web Token verification.',
    explanation: 'REST APIs enforce stateless communication using standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with appropriate status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`). Stateless JWT tokens allow distributed horizontal scaling without shared session stores.',
    codeSnippet: `// Example Secure JWT Verification Handler
import jwt from 'jsonwebtoken';

export function verifyAuthToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or malformed Authorization header', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { user: payload, status: 200 };
  } catch (err) {
    return { error: 'Invalid or expired token', status: 403 };
  }
}`,
    keyPoints: [
      'Always hash passwords with salt rounds (Bcrypt, Argon2) before persistence.',
      'Keep JWT payload compact: store user ID, role, and expiration timestamp.',
      'Implement idempotent API methods (GET, PUT, DELETE) to protect against duplicate network retries.'
    ],
    recommendedCourse: 'Cloud Architecture & Enterprise Microservices'
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    keywords: ['dsa', 'algorithm', 'binary search', 'big o', 'complexity', 'hash map', 'tree', 'graph'],
    title: 'Data Structures & Algorithmic Complexity (Big-O)',
    category: 'Computer Science Fundamentals',
    summary: 'Time and space complexity analysis across foundational computer science structures.',
    explanation: 'Algorithmic efficiency is measured via asymptotic Big-O notation. Hash tables offer O(1) average lookup and insertion. Balanced search trees (AVL, Red-Black) provide O(log N) guarantees. Binary search requires a sorted array and halves the search space each iteration.',
    codeSnippet: `// Classic Binary Search implementation in TypeScript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1; // Element not found
}`,
    keyPoints: [
      'Array lookup: O(1) by index, O(N) by value. Hash Map: O(1) average lookup.',
      'Binary Search: O(log N) time, O(1) auxiliary space.',
      'Dynamic Programming breaks problems into overlapping subproblems with memoization.'
    ],
    recommendedCourse: 'Advanced Python for Production Engineering & Microservices'
  }
];

/**
 * Searches knowledge base for closest technical topics based on semantic keywords.
 */
export function findMatchingKnowledge(query: string): KnowledgeTopic | null {
  const normalized = query.toLowerCase();
  let bestMatch: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of CS_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  return maxScore >= 2 ? bestMatch : null;
}
