# Timeasr data management

Timeasr data is stored locally in the browser. Log data stored in event logs and calculated based on this log information.

## Log data (IndexedDB database)

**Table**: timelog
| name | type |
|------|------|
| tlId | string/uuid |
| type | enum:['STRT', 'STOP'] |
| recTime | number/epoch |
| taskType | string |

**Table**: workdays
| name | type | notes |
|------|------|-------|
| wdId | number/{yyyyMMdd} |
| workload | number | daily workload time length in milliseconds |

*Daily workload* stored in `workdays` table. Every workday's workload is set by default copied from the previous workday. Non-workday workloads are 0. Expected workload of a period is calculated based on summary of these workloads.

**Table**: balance
| name | type | notes |
|------|------|-------|
| bId  | string/uuid |
| amount | number | deviation in milliseconds |
| comment | string |

## Calculations

### Actual balance

Outcomes:
- summary per taskType
- full summary

Order log entries by recTime, then summarize on a taskType basis. All start stops the previous (active) start. Stop closes the summary.
Add signed summary of balance values to the full summary.

### Number of workdays

Count workday entries.

## Cleanup

On first measure change of a day a cleanup task has been started.

1. This should calculate summary of balance older than 90 days. This summary will be saved to balance as rollingBalance.
1. Older balances are deleted.
1. Older workday entries are deleted.
1. Calculation is re-called.


