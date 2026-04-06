import dayjs, { Dayjs } from "dayjs";
import { Button, Card, Dropdown, type MenuProps } from "antd";
import {
    CopyOutlined,
    DeleteOutlined,
    MenuOutlined,
    PlusOutlined,
    ScissorOutlined,
    SnippetsOutlined,
    SplitCellsOutlined,
} from "@ant-design/icons";
import ActivityModal from "@/modules/ActivityModule";
import type { Activity } from "@/types/Activity";
import PlannedActivityModule from "@/modules/PlannedActivityModule";

interface CellItemProps {
    value: dayjs.Dayjs;
    listData: Activity[];
    selectedDate: string | null;
    currentMonth: Dayjs;
    setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const CellItem = ({
    value,
    listData,
    selectedDate,
    currentMonth,
    setSelectedDate,
}: CellItemProps) => {
    const currentDate = value.format("YYYY-MM-DD");
    const dateFormatLong = value.format("dddd, MMMM DD YYYY");

    const isActualMonth = value.isSame(currentMonth, "month");
    const isToday = value.isSame(dayjs(), "day");
    const isSelected = selectedDate === currentDate;

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "Add",
            icon: <PlusOutlined />,
            onClick: () => {
                alert("clicked 1");
            },
        },
        {
            key: "2",
            label: "Cut",
            icon: <ScissorOutlined />,
            onClick: () => {
                alert("clicked 2");
            },
        },
        {
            key: "3",
            label: "Copy",
            icon: <CopyOutlined />,
            onClick: () => {
                alert("clicked 3");
            },
        },
        {
            key: "4",
            label: "Paste",
            icon: <SnippetsOutlined />,
            disabled: true,
            onClick: () => {
                alert("clicked 4");
            },
        },
        {
            key: "5",
            label: "Shift",
            icon: <SplitCellsOutlined />,
            onClick: () => {
                alert("clicked 5");
            },
        },
        {
            type: "divider",
        },
        {
            key: "6",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
                alert("clicked 6");
            },
        },
    ];

    return (
        <div
            id={`day-${currentDate}`}
            className="relative h-full flex flex-col min-h-35 group cursor-default"
            onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(isSelected ? null : currentDate);
            }}
        >
            {isSelected && (
                <div className="absolute inset-0 bg-blue-100 opacity-30 z-10 pointer-events-none" />
            )}
            <Card
                size="small"
                title={
                    <span
                        className={`text-sm font-medium ${isToday ? "text-blue-600" : isActualMonth ? "text-gray-700" : "text-gray-300"}`}
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     setSelectedDate(isSelected ? null : currentDate);
                        // }}
                    >
                        {isToday && "Today "} {value.format("DD")}
                    </span>
                }
                className="group cursor-default shadow-none"
                extra={
                    <div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown trigger={["click"]} menu={{ items }}>
                            <Button
                                icon={
                                    <MenuOutlined
                                        style={{
                                            color: isToday
                                                ? "#1840EC"
                                                : "#9ca3af",
                                            fontSize: "12px",
                                        }}
                                    />
                                }
                                size="small"
                                type="text"
                            />
                        </Dropdown>
                    </div>
                }
                styles={{
                    root: {
                        borderRadius: 0,
                        border: "none",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    },
                    header: {
                        background: "transparent",
                        border: "none",
                        padding: "4px 8px",
                        minHeight: "unset",
                    },
                    body: {
                        padding: "2px 6px 6px 6px",
                        flex: 1,
                    },
                }}
            >
                <ul className="flex flex-col gap-1.5">
                    {listData?.map((item) => (
                        <ActivityModal key={item._id} item={item} />
                    ))}
                    <PlannedActivityModule date={dateFormatLong} />
                </ul>
            </Card>
        </div>
    );
};

export default CellItem;
