import { Space, Typography } from "antd";
import { Line, type LineConfig } from "@ant-design/charts";
import type { Activity } from "@/types/Activity";
import ProgressTable, {
    type ProgressRowData,
} from "@/components/ProgressTable";
import { FTP } from "@/constants/user";
import { calculateCogganPowerZones } from "@/utils/powerZones";
import dayjs from "dayjs";

const { Title } = Typography;

interface PowerTabProps {
    item: Activity;
    isFullscreen: boolean;
}

const PowerTab = ({ item, isFullscreen }: PowerTabProps) => {
    const powerZones = calculateCogganPowerZones(FTP);
    const powerZonesSec = item.summary.timeInZones.power;
    const powerCurve = item.summary.powerCurve;
    const totalDuration = item.durationSec;

    const zoneConfigs = [
        {
            label: "Z7",
            name: "Neuromuscular",
            range: powerZones[0].rangeStr,
            color: "#643559",
        },
        {
            label: "Z6",
            name: "Anaerobic",
            range: powerZones[1].rangeStr,
            color: "#7A416D",
        },
        {
            label: "Z5",
            name: "VO2Max",
            range: powerZones[2].rangeStr,
            color: "#914D80",
        },
        {
            label: "Z4",
            name: "Threshold",
            range: powerZones[3].rangeStr,
            color: "#A75994",
        },
        {
            label: "Z3",
            name: "Tempo",
            range: powerZones[4].rangeStr,
            color: "#BE85B1",
        },
        {
            label: "Z2",
            name: "Endurance",
            range: powerZones[5].rangeStr,
            color: "#D6B2CD",
        },
        {
            label: "Z1",
            name: "Recovery",
            range: powerZones[6].rangeStr,
            color: "#EDDEEA",
        },
    ];

    const tableRows: ProgressRowData[] = zoneConfigs.map((zone, index) => {
        const zoneValueSec = powerZonesSec[6 - index];

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

    const data = [
        { time: "1s", value: powerCurve.p1s },
        { time: "2s", value: powerCurve.p2s },
        { time: "5s", value: powerCurve.p5s },
        { time: "10s", value: powerCurve.p10s },
        { time: "20s", value: powerCurve.p20s },
        { time: "30s", value: powerCurve.p30s },
        { time: "1m", value: powerCurve.p60s },
        { time: "2m", value: powerCurve.p120s },
        { time: "5m", value: powerCurve.p300s },
        { time: "10m", value: powerCurve.p600s },
        { time: "20m", value: powerCurve.p1200s },
        { time: "30m", value: powerCurve.p1800s },
        { time: "1h", value: powerCurve.p3600s },
    ];

    const config: LineConfig = {
        data,
        xField: "time",
        yField: "value",
        shapeField: "smooth",
        scale: {
            y: {
                domainMin: 0,
            },
        },
        axis: {
            y: {
                title: "Power",
            },
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        tooltip: {
            title: (datum) => datum.time,
            items: [
                (datum) => ({
                    name: "Avg Power",
                    value: `${datum.value} W`,
                    color: "#903678",
                }),
            ],
        },
        style: {
            lineWidth: 2,
            stroke: "#903678",
        },
    };

    return (
        <>
            <Title level={4}>Zone Distibution</Title>
            <Space
                orientation={isFullscreen ? "horizontal" : "vertical"}
                align={isFullscreen ? "start" : undefined}
                size={12}
                style={{ width: "100%" }}
            >
                <ProgressTable rows={tableRows} />
                <Line {...config} />
            </Space>
        </>
    );
};

export default PowerTab;
