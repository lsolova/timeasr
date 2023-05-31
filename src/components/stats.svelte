<script lang="ts">
    import { ACCEPTED_TIME_KEY_SET } from "../constants";
    import { CurrentTime } from "../logic/current-time";
    import { stats } from "./stores";
    import { toDayTime, toFormattedDate, toHoursAndMinutes } from "../logic/time-formatters";
    import { wrapInCatch } from "../logic/error-notification";
    import CumulatedTimeSvg from "./svg/cumulated-time-svg.svelte";
    import CurrentTimeSvg from "./svg/current-time-svg.svelte";
    import DailyTimeSvg from "./svg/day-time-svg.svelte";
    import MeasureClockSvg from "./svg/measure-clock-svg.svelte";
    import ShowTasksButton from "./svg/show-tasks-button.svelte";
    import SolovaLogoSvg from "./svg/solova-logo-svg.svelte";
    import Tooltip from "./tooltip.svelte";

    let currentTimeRealtimeClass = "realtime";
    let currentTimeEditableClass = "";

    const onCurrentTimeClick = () => {
        currentTimeEditableClass = "Stats__CurrentTime--editable";
        setTimeout(() => {
            const timeField = document.getElementById("Stats__CurrentTime__Field") as HTMLInputElement;
            timeField.value = toDayTime(CurrentTime.get());
            timeField.focus();
        }, 0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        if (!ACCEPTED_TIME_KEY_SET.includes(key)) {
            currentTimeEditableClass = "";
            const timeString = (document.getElementById("Stats__CurrentTime__Field") as HTMLInputElement)?.value;
            if (key !== "Escape") {
                wrapInCatch(() => CurrentTime.set(timeString));
            }
        }
    };
    stats.subscribe((stat) => {
        currentTimeRealtimeClass = stat.currentInfo.edited ? "edited" : "realtime";
    });
</script>

<aside class="Stats">
    <div class="Stats__CumulatedLeftTime" aria-details="Time left based on cumulated worktime">
        <Tooltip>
            <CumulatedTimeSvg slot="trigger" />
            <p slot="tooltip">Remaining worktime, calculated including overtimes</p>
        </Tooltip>
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByOverall.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave additionalInfo"
            >{toDayTime($stats.daily.leftTimeByOverall.estimatedLeave)}</span
        >
    </div>
    <div class="Stats__DailyLeftTime" aria-details="Time left based on today's worktime">
        <Tooltip>
            <DailyTimeSvg slot="trigger" />
            <p slot="tooltip">Remaining worktime, calculated from daily workload</p>
        </Tooltip>
        <span class="Stats__Item__Remaining">{toHoursAndMinutes($stats.daily.leftTimeByDay.remaining)}</span>
        <span class="Stats__Item__EstimatedLeave additionalInfo"
            >{toDayTime($stats.daily.leftTimeByDay.estimatedLeave)}</span
        >
    </div>
    <div class="Stats__AverageTime" aria-details="Average time for workday count">
        <Tooltip>
            <MeasureClockSvg slot="trigger" />
            <p slot="tooltip">Average time per workday</p>
        </Tooltip>
        <span>{toHoursAndMinutes($stats.averageTimePerDay)} / {$stats.dayCount}</span>
    </div>
    <div
        class={`Stats__CurrentTime Stats__CurrentTime--${currentTimeRealtimeClass} ${currentTimeEditableClass}`}
        on:click={onCurrentTimeClick}
        on:keypress={() => {
            // Do nothing
        }}
        aria-details="Current time, click to change"
    >
        <Tooltip>
            <CurrentTimeSvg slot="trigger" />
            <svelte:fragment slot="tooltip">
                <p>By clicking the time it can be changed. Set current time and Enter. Press Escape to cancel.</p>
                <p>If time would be a future time, then it would be taken as yesterday's time.</p>
                <p>Time will reset in 5 minutes. It can be reset by clearing the field and pressing Enter.</p>
            </svelte:fragment>
        </Tooltip>
        <span>{toDayTime($stats.currentInfo.time)}</span>
        <input
            id="Stats__CurrentTime__Field"
            value={toDayTime($stats.currentInfo.time)}
            type="text"
            on:keydown={onKeyDown}
            on:blur={() => (currentTimeEditableClass = "")}
        />
        <span class="additionalInfo">{toFormattedDate($stats.currentInfo.time)}</span>
    </div>
    <div class="Stats__Actions">
        <ShowTasksButton />
        <div class="Copyright">
            <SolovaLogoSvg />
        </div>
    </div>
</aside>
