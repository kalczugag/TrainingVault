import { Space, Typography } from "antd";
import type { Activity } from "@/types/Activity";
import ProgressTable, {
    type ProgressRowData,
    type ProgressTableProps,
} from "@/components/ProgressTable";
import dayjs from "dayjs";

const { Title } = Typography;

interface HrTabProps {
    item: Activity;
    isFullscreen: boolean;
}

const HrTab = ({ item, isFullscreen }: HrTabProps) => {
    const hrZones = item.summary.timeInZones.hr;
    const totalDuration = item.durationSec;

    const zoneConfigs = [
        { label: "Z5", name: "Anaerobic", range: "> 186", color: "#B40312" },
        {
            label: "Z4",
            name: "Threshold",
            range: "171 - 185",
            color: "#FB0017",
        },
        { label: "Z3", name: "Tempo", range: "156 - 170", color: "#D9A7A8" },
        {
            label: "Z2",
            name: "Endurance",
            range: "142 - 155",
            color: "#E5C1C1",
        },
        { label: "Z1", name: "Recovery", range: "< 141", color: "#E7D9DA" },
    ];

    const tableRows: ProgressRowData[] = zoneConfigs.map((zone, index) => {
        const zoneValueSec = hrZones[4 - index];

        const percentage = Number(
            (totalDuration > 0
                ? (zoneValueSec / totalDuration) * 100
                : 0
            ).toFixed(1),
        );
        const formattedTime =
            zoneValueSec > 0
                ? dayjs
                      .duration(zoneValueSec, "seconds")
                      .format(zoneValueSec >= 3600 ? "H:mm:ss" : "m:ss")
                : "0s";

        return {
            key: zone.label,
            cells: [
                {
                    type: "text",
                    value: zone.label,
                    align: "center",
                    bold: true,
                },
                { type: "text", value: zone.name },
                { type: "text", value: zone.range },
                {
                    type: "text",
                    value: formattedTime,
                    align: "center",
                    bold: true,
                },
                {
                    type: "text",
                    value: `${percentage}%`,
                    align: "center",
                    bold: true,
                },
                { type: "bar", percentage, color: zone.color },
            ],
        };
    });

    return (
        <>
            <Title level={4}>Heart Rate Analysis</Title>
            <Space
                orientation={isFullscreen ? "horizontal" : "vertical"}
                align={isFullscreen ? "start" : undefined}
                size={12}
                style={{ width: "100%" }}
            >
                <ProgressTable rows={tableRows} />
            </Space>
        </>
    );
};

export default HrTab;
