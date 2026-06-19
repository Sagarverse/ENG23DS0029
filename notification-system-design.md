# Notification System Design

## Stage 1: Priority Inbox

### 1. Priority Computation Formula
To determine the importance of notifications, we employ a composite priority score combining type-based weight and timestamp recency:

$$\text{PriorityScore}(N) = W_{\text{type}}(N.\text{Type}) \times 10^{10} + \text{Timestamp}_{\text{unix}}(N.\text{Timestamp})$$

Where:
- **Type Weights ($W_{\text{type}}$):**
  - `Placement` = 3
  - `Result` = 2
  - `Event` = 1
- **Recency ($Timestamp_{\text{unix}}$):** The Unix epoch timestamp (seconds since Jan 1, 1970).

By scaling the weight component by a factor larger than any reasonable epoch timestamp (e.g., $10^{10}$), we ensure that notifications are strictly partitioned by type priority first (Placement > Result > Event), and then ordered by recency within each partition.

---

### 2. Continuous Ingestion & Real-Time Flow
For continuous notification ingestion (e.g., via WebSockets or SSE):
- As a new notification $N$ is received, the client/server calculates its `PriorityScore`.
- If the notification is marked **Unread**, it becomes a candidate for the Priority Inbox.
- Read notifications are dynamically excluded.

---

### 3. Efficient Top-N Maintenance (No Full Scan)
To maintain the top $n$ notifications without scanning or sorting the entire dataset of size $M$ (which costs $O(M \log M)$):
- **Min-Heap (Priority Queue):** We maintain a Min-Heap of maximum size $n$.
- **Algorithm:**
  1. For each incoming or fetched notification $N$:
     - Push $N$ into the Min-Heap.
     - If the size of the heap exceeds $n$, pop the element with the lowest priority score.
  2. This guarantees that the heap always contains the top $n$ highest priority items.
- **Complexity:**
  - Processing $M$ notifications: $O(M \log n)$. Since $n \ll M$ (e.g., $n = 10$), this is highly performant and requires minimal memory footprint.
