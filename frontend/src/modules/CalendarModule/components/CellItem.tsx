import dayjs from "dayjs";
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

interface CellItemProps {
    value: dayjs.Dayjs;
    listData: Activity[];
    selectedDate: string | null;
    setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const CellItem = ({
    value,
    listData,
    selectedDate,
    setSelectedDate,
}: CellItemProps) => {
    const currentDate = value.format("YYYY-MM-DD");

    const isActualMonth = value.isSame(dayjs(), "month");
    const isActualWeek = value.isSame(dayjs(), "isoWeek");
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
        <div className="relative h-full">
            {isSelected && (
                <div
                    className="absolute inset-0 z-1 bg-[#9dbeff] w-full h-full opacity-50"
                    onClick={() => setSelectedDate(null)}
                />
            )}
            <Card
                size="small"
                title={
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(isSelected ? null : currentDate);
                        }}
                    >
                        {isToday && "Today"} {value.format("DD")}
                    </div>
                }
                className="group cursor-default"
                extra={
                    <div
                        className="opacity-0  group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown trigger={["click"]} menu={{ items }}>
                            <Button
                                icon={
                                    <MenuOutlined
                                        style={{
                                            color: isToday ? "#FFF" : undefined,
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
                        backgroundColor: "#FFF",
                        textAlign: "left",
                        border: "none",
                        borderTop: "1px groove",
                        borderRight: "1px groove",
                        borderRadius: 0,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    },
                    header: {
                        background:
                            isActualWeek && isToday
                                ? "#1840EC"
                                : isActualWeek
                                  ? "#EAECF2"
                                  : "transparent",
                        color:
                            isActualWeek && isToday
                                ? "#FFF"
                                : isActualMonth
                                  ? "#061a5a"
                                  : "#C3C9D7",
                        fontWeight: 300,
                        fontSize: "12px",
                        borderRadius: 0,
                        border: "none",
                        minHeight: "unset",
                    },
                    body: {
                        borderRadius: 0,
                        border: "none",
                        padding: "8px",
                        flex: 1,
                        minHeight: "100px",
                    },
                }}
            >
                <ul className="group">
                    {listData?.map((item) => (
                        <ActivityModal key={item._id} item={item} />
                    ))}
                    <Button
                        type="text"
                        color="default"
                        variant="outlined"
                        className="w-full opacity-0  group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <PlusOutlined />
                    </Button>
                </ul>
            </Card>
        </div>
    );
};

export default CellItem;
