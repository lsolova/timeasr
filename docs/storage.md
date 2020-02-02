# Timeasr data management

Timeasr data is stored locally in the browser.

## Log format (database)

Timestamp is a minute level epoch (minutes since 1 January 1970.)

| Timestamp    | Type  | Value regex       | Example        | Notes         |
|--------------|-------|-------------------|----------------|---------------|
| 201911231515 | TIMER | (start\|stop)     | start          |               |
| 201911231515 | BLNC  | (+-)?\d{3,4}( .+) | +200 Overtime  |               |
| 201911231515 | SET   | \w*(:[\w\d]*)?    | workload:800   | user settings |
| 201911231515 | WDY   |                   |                | workday entry |

### Settings

User can set up behavior and calculation base.

| Name     | Value regex   | Note              |
|----------|---------------|-------------------|
| workload | \d*           | Stored in minutes |

## Calculations

### Actual balance

Collect start-stop pairs and calculate summary of pair time difference.
Add signed summary of BLNC (balance) values.

### Number of workdays

Count WDY (workday) entries with value.

## Cleanup

On first measure change of a day a cleanup task has been started.

1. This should calculate summary of balance older than 90 days. This summary will be saved to BLNC as rollingBalance.
1. Older WDY entries are removed.
1. Older SET entries are moved to the beginning of the calculation period.
1. Calculation is called.


