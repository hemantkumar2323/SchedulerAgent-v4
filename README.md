=== README.md ===
```markdown
# SchedulerAgent

Handles scheduling and publishing of approved scripts with cooldown and slot optimization.

## Endpoints

-   `POST /api/schedulePost` → queue a script for future posting
-   `POST /api/publishNow` → publish immediately

## Configuration

-   `config/platform-rules.json`:  Platform-specific rules (cooldowns, max posts).
-   `config/slot-allocation.json`:  Available posting slots.
-   `config/post-timing-performance.json`: Best times to post for each platform.

## Data

-   `queue/post-queue.json`:  Queue of scheduled posts.
-   `data/published/history.json`: History of published posts.
