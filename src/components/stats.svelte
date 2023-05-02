<script lang="ts">
    import { ACCEPTED_TIME_KEY_SET } from "../constants";
    import { CurrentTime } from "../logic/current-time";
    import { stats } from "./stores";
    import { toDayTime, toHoursAndMinutes } from "../logic/time-formatters";
    import CumulatedTimeSvg from "./svg/cumulated-time-svg.svelte";
    import DailyTimeSvg from "./svg/selected-day-time-svg.svelte";
    import MeasureClockSvg from "./svg/measure-clock-svg.svelte";
    import SolovaLogoSvg from "./svg/solova-logo-svg.svelte";

    let currentTimeRealtimeClass = "realtime"
    let currentTimeEditableClass = ""

    const onCurrentTimeClick = () => {
        currentTimeEditableClass = "Stats__CurrentTime--editable"
        setTimeout(() => {
            const timeField = document.getElementById("Stats__CurrentTime__Field") as HTMLInputElement;
            timeField.value = toDayTime(CurrentTime.get());
            timeField.focus();
        }, 0)
    }
    const onKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        if (!ACCEPTED_TIME_KEY_SET.includes(key)) {
            currentTimeEditableClass = "";
            const timeString = (document.getElementById("Stats__CurrentTime__Field") as HTMLInputElement)?.value;
            if (key !== "Escape") {
                CurrentTime.set(timeString);
            }
        }
    }
    stats.subscribe((stat) => {
        currentTimeRealtimeClass = stat.currentInfo.edited ? "edited" : "realtime"
    })
</script>

<aside class="Stats">
    <div class="Stats__CumulatedLeftTime" title="Time left based on cumulated worktime">
        <CumulatedTimeSvg />
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByOverall.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave">{toDayTime($stats.daily.leftTimeByOverall.estimatedLeave)}</span>
    </div>
    <div class="Stats__DailyLeftTime"  title="Time left based on today's worktime">
        <DailyTimeSvg />
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByDay.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave">{toDayTime($stats.daily.leftTimeByDay.estimatedLeave)}</span>
    </div>
    <div class="Stats__AverageTime"  title="Average time for workday count">
        <MeasureClockSvg />
        <span>{toHoursAndMinutes($stats.averageTimePerDay)} / {$stats.dayCount}</span>
    </div>
    <div class={`Stats__CurrentTime Stats__CurrentTime--${currentTimeRealtimeClass} ${currentTimeEditableClass}`} on:click={onCurrentTimeClick}  title="Current time, click to change">
        <span>{toDayTime($stats.currentInfo.time)}</span>
        <input id="Stats__CurrentTime__Field" value={toDayTime($stats.currentInfo.time)} type="text" on:keydown={onKeyDown} title="Set current time and Enter. Or Escape to cancel changes."/>
    </div>
    <div class="Copyright">
        <SolovaLogoSvg />
    </div>
</aside>
