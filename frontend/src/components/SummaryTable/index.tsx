import { Col, Input, Row } from "antd";
import React from "react";

export type CellType = "input" | "readonly" | "text" | "empty" | "disabled";

export interface TableCell {
    type: CellType;
    value?: string | number;
    placeholder?: string;
    isBlue?: boolean;
    unit?: string;
    span?: number;
    align?: "left" | "center" | "right";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TableRowData {
    key: string | number;
    cells: TableCell[];
}

export interface SummaryTableProps {
    header: string[];
    rows: TableRowData[];
    columnSpans?: number[];
}

const SummaryTable = ({
    header,
    rows,
    columnSpans = [8, 7, 7, 2],
}: SummaryTableProps) => {
    const renderCellContent = (cell: TableCell) => {
        switch (cell.type) {
            case "input":
                return (
                    <Input
                        size="small"
                        value={cell.value}
                        placeholder={cell.placeholder}
                        onChange={cell.onChange}
                        style={{ textAlign: "center", width: "100%" }}
                    />
                );

            case "readonly":
                return (
                    <Input
                        size="small"
                        readOnly
                        value={cell.value}
                        style={{
                            textAlign: "center",
                            width: "100%",
                            backgroundColor: "#fafafa",
                            color: "#333",
                        }}
                    />
                );

            case "disabled":
                return (
                    <Input
                        size="small"
                        disabled
                        value={cell.value}
                        placeholder={cell.placeholder}
                        style={{ textAlign: "center", width: "100%" }}
                    />
                );

            case "text":
                return (
                    <span
                        style={{
                            fontSize: "13px",
                            color: cell.isBlue
                                ? "#1677ff"
                                : cell.unit
                                  ? "#666"
                                  : "#333",
                            textDecoration: cell.isBlue
                                ? "underline dashed 1px"
                                : "none",
                            textUnderlineOffset: "4px",
                            textWrap: cell.unit ? "nowrap" : "wrap",
                        }}
                    >
                        {cell.value}
                    </span>
                );

            case "empty":

            default:
                return null;
        }
    };

    return (
        <div className="flex-1">
            {header.length > 0 && (
                <Row gutter={12} align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={columnSpans[0] || 8}></Col>
                    {header.map((label, index) => (
                        <Col
                            span={columnSpans[index + 1] || 7}
                            key={index}
                            className="text-center text-xs font-medium text-gray-600"
                        >
                            {label}
                        </Col>
                    ))}
                    {columnSpans.length > header.length + 1 && (
                        <Col span={columnSpans[columnSpans.length - 1]}></Col>
                    )}
                </Row>
            )}
            {rows.map((row) => (
                <Row
                    key={row.key}
                    gutter={12}
                    align="middle"
                    style={{ marginBottom: "8px" }}
                >
                    {row.cells.map((cell, cellIndex) => {
                        const colSpan =
                            cell.span || columnSpans[cellIndex] || 4;

                        let textAlign = cell.align;
                        if (!textAlign) {
                            if (cellIndex === 0) textAlign = "right";
                            else if (
                                cellIndex === row.cells.length - 1 &&
                                cell.type === "text"
                            )
                                textAlign = "left";
                            else textAlign = "center";
                        }

                        return (
                            <Col
                                key={cellIndex}
                                span={colSpan}
                                style={{ textAlign: textAlign as any }}
                            >
                                {renderCellContent(cell)}
                            </Col>
                        );
                    })}
                </Row>
            ))}
        </div>
    );
};

export default SummaryTable;
