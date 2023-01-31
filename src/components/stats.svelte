<script lang="ts">
    import { stats } from "./stores";
    import { toDayTime, toHoursAndMinutes } from "../logic/time-formatters";
    import CumulatedTimeSvg from "./svg/cumulated-time-svg.svelte";
    import DailyTimeSvg from "./svg/selected-day-time-svg.svelte";
    import MeasureClockSvg from "./svg/measure-clock-svg.svelte";
    import SolovaLogoSvg from "./svg/solova-logo-svg.svelte";
</script>

<aside class="Stats">
    <div class="Stats__CumulatedLeftTime">
        <CumulatedTimeSvg />
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByOverall.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave">{toDayTime($stats.daily.leftTimeByOverall.estimatedLeave)}</span>
    </div>
    <div class="Stats__DailyLeftTime">
        <DailyTimeSvg />
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByDay.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave">{toDayTime($stats.daily.leftTimeByDay.estimatedLeave)}</span>
    </div>
    <div class="Stats__AverageTime">
        <MeasureClockSvg />
        <span>{toHoursAndMinutes($stats.averageTimePerDay)} / {$stats.dayCount}</span>
    </div>
    <div class="Copyright">
        <SolovaLogoSvg />
    </div>
</aside>
