import { Flex } from "antd";
import type { Activity } from "@/types/Activity";

interface HrTabProps {
    item: Activity;
}

const HrTab = ({ item }: HrTabProps) => {
    return <Flex justify="space-between"></Flex>;
};

export default HrTab;
