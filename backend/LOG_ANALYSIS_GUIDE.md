# Sample Log Analysis Commands for PreffyVideoFlow

## Quick Reference Commands

### Find All Errors in Last Hour
```bash
# Development
tail -f logs/application.log | grep ERROR

# Production (Cloud Run)
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR AND timestamp>=\"$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)\""
```

### Track Specific User Activity
```bash
# Local logs
grep "\[userId:user123\]" logs/application.log

# Production
gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.userId=\"user123\""
```

### Monitor Request Performance
```bash
# Find requests taking longer than 1 second
grep "Duration: [0-9][0-9][0-9][0-9]ms" logs/application.log

# Average response time analysis
grep "Request completed" logs/application.log | awk '{print $NF}' | sed 's/ms//' | awk '{sum+=$1; count++} END {print "Average:", sum/count "ms"}'
```

### Security Event Monitoring
```bash
# Authentication failures
grep "Authentication failed" logs/application.log

# Access denied attempts
grep "Access denied" logs/application.log

# Production security events
gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.logger=\"com.preffy.videoflow.security\""
```

### Database Query Analysis
```bash
# Slow query detection (when SQL logging is enabled)
grep "org.hibernate.SQL" logs/application.log | grep -E "(select|insert|update|delete)"

# Connection pool monitoring
grep "com.zaxxer.hikari" logs/application.log
```

### Error Investigation Workflow
```bash
# 1. Find correlation ID from error
ERROR_CORRELATION_ID="abc-123-def-456"

# 2. Get full request context
grep "$ERROR_CORRELATION_ID" logs/application.log

# 3. Check related error logs
grep "$ERROR_CORRELATION_ID" logs/error.log
```

## Production Monitoring Scripts

### Daily Log Summary
```bash
#!/bin/bash
# daily-log-summary.sh

DATE=$(date +%Y-%m-%d)
LOG_FILE="/tmp/application.log"

echo "=== Daily Log Summary for $DATE ==="
echo ""

echo "Error Count:"
grep "$DATE" "$LOG_FILE" | grep "ERROR" | wc -l

echo ""
echo "Top 10 Most Frequent Endpoints:"
grep "$DATE" "$LOG_FILE" | grep "Request completed" | awk '{print $6}' | sort | uniq -c | sort -nr | head -10

echo ""
echo "Authentication Events:"
grep "$DATE" "$LOG_FILE" | grep -E "(Authentication successful|Authentication failed)" | wc -l

echo ""
echo "Average Response Time:"
grep "$DATE" "$LOG_FILE" | grep "Request completed" | awk '{print $NF}' | sed 's/ms//' | awk '{sum+=$1; count++} END {print sum/count "ms"}'
```

### Real-time Error Monitoring
```bash
#!/bin/bash
# error-monitor.sh

tail -f /tmp/application.log | while read line; do
    if echo "$line" | grep -q "ERROR"; then
        echo "$(date): ERROR DETECTED"
        echo "$line"
        echo "---"
        
        # Extract correlation ID and find related logs
        CORRELATION_ID=$(echo "$line" | grep -o '\[.*\]' | head -1 | tr -d '[]')
        if [ ! -z "$CORRELATION_ID" ]; then
            echo "Related logs for correlation ID: $CORRELATION_ID"
            grep "$CORRELATION_ID" /tmp/application.log | tail -5
            echo "==="
        fi
    fi
done
```

## Google Cloud Logging Queries

### Application Errors
```sql
resource.type="cloud_run_revision"
resource.labels.service_name="preffy-backend"
severity>=ERROR
timestamp>="2025-06-23T00:00:00Z"
```

### User Activity Tracking
```sql
resource.type="cloud_run_revision"
jsonPayload.userId="user123"
timestamp>="2025-06-23T00:00:00Z"
```

### Performance Analysis
```sql
resource.type="cloud_run_revision"
jsonPayload.logger="com.preffy.videoflow.request"
jsonPayload.message:("Request completed")
timestamp>="2025-06-23T00:00:00Z"
```

### Security Events
```sql
resource.type="cloud_run_revision"
jsonPayload.logger="com.preffy.videoflow.security"
timestamp>="2025-06-23T00:00:00Z"
```

## Log-based Alerting

### Cloud Monitoring Alert Policies

#### High Error Rate Alert
```yaml
displayName: "High Error Rate - PreffyVideoFlow"
conditions:
  - displayName: "Error rate > 5%"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND resource.labels.service_name="preffy-backend" AND severity>=ERROR'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 5
      duration: "300s"
notificationChannels:
  - "projects/preffy-video-platform/notificationChannels/EMAIL_CHANNEL_ID"
```

#### Authentication Failure Alert
```yaml
displayName: "Authentication Failures - PreffyVideoFlow"
conditions:
  - displayName: "Authentication failures > 10 in 5 minutes"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND jsonPayload.message:"Authentication failed"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 10
      duration: "300s"
```

#### Slow Request Alert
```yaml
displayName: "Slow Requests - PreffyVideoFlow"
conditions:
  - displayName: "Request duration > 5 seconds"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND jsonPayload.message:"Request completed" AND jsonPayload.duration>5000'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 1
      duration: "60s"
```

## Log Retention and Cleanup

### Local Development Cleanup
```bash
#!/bin/bash
# cleanup-logs.sh

# Remove logs older than 7 days
find logs/ -name "*.log*" -mtime +7 -delete

# Compress logs older than 1 day
find logs/ -name "*.log" -mtime +1 -exec gzip {} \;
```

### Production Log Management
```bash
# Set log retention in Cloud Logging
gcloud logging sinks create preffy-logs-archive \
    storage.googleapis.com/preffy-logs-archive \
    --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="preffy-backend"'

# Set retention policy (30 days)
gcloud logging buckets update _Default --location=global --retention-days=30
```

## Performance Monitoring

### JVM Memory Monitoring
```bash
# Extract memory usage from health checks
curl -s http://localhost:8080/api/health | jq '.memory'

# Monitor memory trends
while true; do
    echo "$(date): $(curl -s http://localhost:8080/api/health | jq -r '.memory.usedMemoryMB')"
    sleep 60
done
```

### Request Rate Analysis
```bash
# Requests per minute analysis
grep "Request completed" logs/application.log | \
awk '{print $1 " " $2}' | \
cut -c1-16 | \
sort | uniq -c | \
sort -nr
```

## Development Debugging

### Enable Debug Logging for Specific Package
```bash
# Using actuator endpoint
curl -X POST "http://localhost:8080/actuator/loggers/com.preffy.videoflow.service" \
     -H "Content-Type: application/json" \
     -d '{"configuredLevel": "DEBUG"}'

# Reset to default
curl -X POST "http://localhost:8080/actuator/loggers/com.preffy.videoflow.service" \
     -H "Content-Type: application/json" \
     -d '{"configuredLevel": null}'
```

### Trace Specific Request Flow
```bash
# Follow a correlation ID through the entire request lifecycle
CORRELATION_ID="abc-123-def"
grep "$CORRELATION_ID" logs/application.log | sort
```

### Database Query Debugging
```bash
# Enable SQL logging temporarily
curl -X POST "http://localhost:8080/actuator/loggers/org.hibernate.SQL" \
     -H "Content-Type: application/json" \
     -d '{"configuredLevel": "DEBUG"}'

# Enable parameter logging
curl -X POST "http://localhost:8080/actuator/loggers/org.hibernate.type.descriptor.sql.BasicBinder" \
     -H "Content-Type: application/json" \
     -d '{"configuredLevel": "TRACE"}'
```
