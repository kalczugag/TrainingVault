import dayjs from "dayjs";
import { Card, Flex } from "antd";
import { bike } from "@/style/images/activityIcons";
import type { Activity } from "@/types/Activity";

interface ActivityCardProps {
    item: Activity;
    showModal: () => void;
}

const ActivityCard = ({ item, showModal }: ActivityCardProps) => {
    return (
        <li
            onClick={showModal}
            style={{ marginBottom: "8px", cursor: "pointer" }}
        >
            <Card size="small">
                <Card.Meta
                    title={
                        item.sportType === "cycling" && (
                            <Flex vertical gap={4}>
                                <img
                                    alt="bike icon"
                                    src={bike}
                                    className="w-6"
                                />
                                <span className="text-xs">{item.title}</span>
                            </Flex>
                        )
                    }
                />
                <Flex vertical style={{ marginTop: "10px" }}>
                    <span>
                        {dayjs
                            .duration(item.durationSec, "seconds")
                            .format("HH:mm:ss")}
                    </span>
                    <span>{(item.distanceMeters / 1000).toFixed(1)} km</span>
                    <span>{item.summary.tss} TSS</span>
                </Flex>
            </Card>
        </li>
    );
};

export default ActivityCard;
