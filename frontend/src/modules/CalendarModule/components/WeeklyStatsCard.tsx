import type { WeeklyStat } from "@/types/WeeklyStat";

interface WeeklyStatsCardProps {
    summary: WeeklyStat | null;
}

const showStat = (value: number) => Math.trunc(value) || 0;

const WeeklyStatsCard = ({ summary }: WeeklyStatsCardProps) => {
    if (!summary)
        return (
            <div className="p-4 text-gray-300 text-xs text-center h-full">
                No data
            </div>
        );

    const hours = Math.floor(summary.totalDurationSec / 3600);
    const minutes = Math.floor((summary.totalDurationSec % 3600) / 60);

    return (
        <div className="h-full bg-white p-4 text-xs flex flex-col font-sans min-h-35">
            <div className="flex justify-between mb-4 text-center text-gray-400">
                <div>
                    <div className="uppercase tracking-wider mb-1">Fitness</div>
                    <div className="text-gray-800 font-medium">
                        {showStat(summary.endingCtl)}{" "}
                        <span className="text-gray-400">CTL</span>
                    </div>
                </div>
                <div>
                    <div className="uppercase tracking-wider mb-1">Fatigue</div>
                    <div className="text-gray-800 font-medium">
                        {showStat(summary.endingAtl)}{" "}
                        <span className="text-gray-400">ATL</span>
                    </div>
                </div>
                <div>
                    <div className="uppercase tracking-wider mb-1">Form</div>
                    <div
                        className={`font-medium ${summary.endingTsb > 0 ? "text-green-500" : summary.endingTsb < -10 ? "text-red-500" : "text-gray-800"}`}
                    >
                        {summary.endingTsb > 0
                            ? `+${showStat(summary.endingTsb)}`
                            : showStat(summary.endingTsb)}{" "}
                        <span className="text-gray-400">TSB</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-auto pt-3">
                <div className="flex justify-end items-baseline gap-2">
                    <span className="text-gray-400 mr-auto">Duration</span>
                    <span className="font-semibold text-sm text-gray-800">
                        {hours}:{minutes}
                    </span>
                    <span className="text-[10px] text-gray-400">hms</span>
                </div>
                <div className="flex justify-end items-baseline gap-2">
                    <span className="text-gray-400 mr-auto">Distance</span>
                    <span className="font-semibold text-sm text-gray-800">
                        {(summary.totalDistanceMeters / 1000).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-400">km</span>
                </div>
                <div className="flex justify-end items-baseline gap-2">
                    <span className="text-gray-400 mr-auto">TSS</span>
                    <span className="font-semibold text-sm text-gray-800">
                        {summary.totalTss || 0}
                    </span>
                    <span className="text-[10px] text-gray-400">TSS</span>
                </div>
                <div className="flex justify-end items-baseline gap-2">
                    <span className="text-gray-400 mr-auto">Work</span>
                    <span className="font-semibold text-sm text-gray-800">
                        {summary.totalWorkKj || 0}
                    </span>
                    <span className="text-[10px] text-gray-400">kJ</span>
                </div>
            </div>
        </div>
    );
};

export default WeeklyStatsCard;
