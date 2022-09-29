<script lang="ts">
    import { stats } from "./stores";
    import { toHoursAndMinutes } from "../logic/time-formatters";
    import CumulatedTimeSvg from "./svg/cumulated-time-svg.svelte";
    import DailyTimeSvg from "./svg/selected-day-time-svg.svelte";
    import MeasureClockSvg from "./svg/measure-clock-svg.svelte";
</script>

<aside class="Stats">
    <div class="Stats__CumulatedLeftTime">
        <CumulatedTimeSvg />
        <span>{toHoursAndMinutes($stats.daily.leftTimeByOverall)}</span>
    </div>
    <div class="Stats__DailyLeftTime">
        <DailyTimeSvg />
        <span>{toHoursAndMinutes($stats.daily.leftTimeByDay)}</span>
    </div>
    <div class="Stats__AverageTime">
        <MeasureClockSvg />
        <span>{toHoursAndMinutes($stats.averageTimePerDay)} / {$stats.dayCount}</span>
    </div>
</aside>
