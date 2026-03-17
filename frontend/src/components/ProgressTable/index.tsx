import React from "react";
import { Col, Row } from "antd";

export type ProgressCellType = "text" | "bar";

export interface ProgressCell {
    type: ProgressCellType;
    value?: React.ReactNode;
    align?: "left" | "center" | "right";
    bold?: boolean;
    color?: string;
    percentage?: number;
    span?: number;
}

export interface ProgressRowData {
    key: string | number;
    cells: ProgressCell[];
}

export interface ProgressTableProps {
    rows: ProgressRowData[];
    columnSpans?: number[];
    defaultBgColor?: string;
}

const ProgressTable = ({
    rows,
    columnSpans = [2, 4, 4, 3, 3, 8],
    defaultBgColor = "#f5f5f5",
}: ProgressTableProps) => {
    return (
        <div style={{ overflowX: "hidden", width: "100%" }}>
            <div style={{ minWidth: "600px" }}>
                {rows.map((row) => (
                    <Row
                        key={row.key}
                        gutter={4}
                        align="middle"
                        style={{ marginBottom: "4px", flexWrap: "nowrap" }}
                    >
                        {row.cells.map((cell, cellIndex) => {
                            const colSpan =
                                cell.span || columnSpans[cellIndex] || 4;

                            if (cell.type === "bar") {
                                return (
                                    <Col key={cellIndex} span={colSpan}>
                                        <div
                                            style={{
                                                paddingLeft: "4px",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${cell.percentage || 0}%`,
                                                    backgroundColor:
                                                        cell.color || "#e4babb",
                                                    height: "40px",
                                                    minWidth:
                                                        cell.percentage &&
                                                        cell.percentage > 0
                                                            ? "2px"
                                                            : "0",
                                                    transition:
                                                        "width 0.3s ease",
                                                }}
                                            />
                                        </div>
                                    </Col>
                                );
                            }

                            return (
                                <Col key={cellIndex} span={colSpan}>
                                    <div
                                        style={{
                                            background: defaultBgColor,
                                            padding:
                                                cell.align === "center"
                                                    ? "10px 0"
                                                    : "10px 12px",
                                            textAlign: cell.align || "left",
                                            fontWeight: cell.bold
                                                ? "bold"
                                                : "normal",
                                            color: cell.color,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {cell.value}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                ))}
            </div>
        </div>
    );
};

export default ProgressTable;
