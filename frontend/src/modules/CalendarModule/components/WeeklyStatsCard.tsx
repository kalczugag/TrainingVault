import type { WeeklyStat } from "@/types/WeeklyStat";
import { Card, Flex } from "antd";
import dayjs, { type Dayjs } from "dayjs";

interface WeeklyStatsCardProps {
    currentDate: Dayjs;
    weeklyStats: WeeklyStat[];
}

const WeeklyStatsCard = ({
    currentDate,
    weeklyStats,
}: WeeklyStatsCardProps) => {
    return (
        <div className="w-[320px] shrink-0">
            <Card
                title={`Summary: ${currentDate.format("MMMM")}`}
                style={{
                    position: "sticky",
                    top: "150px",
                }}
                className="shadow-sm"
            >
                <Flex vertical gap="large">
                    {weeklyStats.map((stat, index) => (
                        <div
                            key={stat._id}
                            className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                        >
                            <div className="text-xs text-blue-500 font-bold mb-2">
                                Week {index + 1}{" "}
                                <span className="text-gray-400 font-normal">
                                    (
                                    {dayjs(
                                        stat.weekStartDate.toString(),
                                    ).format("DD MMMM")}{" "}
                                    -{" "}
                                    {dayjs(stat.weekEndDate.toString()).format(
                                        "DD MMMM",
                                    )}
                                    )
                                </span>
                            </div>

                            {stat.activityCount > 0 ? (
                                <Flex
                                    justify="space-between"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    <Flex vertical>
                                        <span className="text-xs text-gray-400">
                                            Time
                                        </span>
                                        {`${Math.floor(stat.totalDurationSec / 3600)}:${Math.floor(
                                            (stat.totalDurationSec % 3600) / 60,
                                        )
                                            .toString()
                                            .padStart(2, "0")} hms`}
                                    </Flex>
                                    <Flex vertical>
                                        <span className="text-xs text-gray-400">
                                            Distance
                                        </span>
                                        {(
                                            stat.totalDistanceMeters / 1000
                                        ).toFixed(2)}{" "}
                                        km
                                    </Flex>
                                    <Flex vertical>
                                        <span className="text-xs text-gray-400">
                                            TSS
                                        </span>
                                        {stat.totalTss}
                                    </Flex>
                                </Flex>
                            ) : (
                                <div className="text-xs text-gray-300 italic">
                                    No Activities
                                </div>
                            )}
                        </div>
                    ))}
                </Flex>
            </Card>
        </div>
    );
};

export default WeeklyStatsCard;
