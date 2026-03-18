import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button, Flex, Select } from "antd";
import { ExpandOutlined, CompressOutlined } from "@ant-design/icons";
import { useGetActivityStreamQuery } from "@/store";
import type { Activity } from "@/types/Activity";
import Loading from "@/components/Loading";
import type { ActivityStream } from "@/types/ActivityStream";

interface MapAndGraphTabProps {
    item: Activity;
    isFullscreen: boolean;
}

const MapAndGraphTab = ({ item, isFullscreen }: MapAndGraphTabProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    const { data, isLoading } = useGetActivityStreamQuery(
        {
            dbActivityId: item?._id,
            garminActivityId: item?.garminActivityId,
        },
        {
            skip: !item?._id || !item?.garminActivityId,
        },
    );

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsMapFullscreen(isFull);

            setTimeout(() => {
                mapRef.current?.resize();
            }, 200);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
    }, []);

    useEffect(() => {
        if (isFullscreen) {
            mapRef.current?.resize();
        }
    }, [isFullscreen]);

    useEffect(() => {
        if (
            !data?.result ||
            data?.result.length === 0 ||
            !mapContainerRef.current
        )
            return;

        const coordinates = data.result
            .filter(
                (stream: ActivityStream) =>
                    stream.measurements.lng && stream.measurements.lat,
            )
            .map(
                (stream: ActivityStream) =>
                    [stream.measurements.lng, stream.measurements.lat] as [
                        number,
                        number,
                    ],
            );

        if (coordinates.length === 0) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: coordinates[0],
            zoom: 13,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

        setTimeout(() => {
            mapRef.current?.resize();
        }, 200);

        mapRef.current.on("style.load", () => {
            mapRef.current?.addSource("route-data", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: coordinates,
                    },
                },
            });

            mapRef.current?.addLayer({
                id: "route-line",
                type: "line",
                source: "route-data",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#ff4d4f",
                    "line-width": 4,
                    "line-opacity": 0.8,
                },
            });

            const bounds = new mapboxgl.LngLatBounds(
                coordinates[0],
                coordinates[0],
            );
            for (const coord of coordinates) {
                bounds.extend(coord);
            }
            mapRef.current?.fitBounds(bounds, { padding: 50, duration: 1000 });
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [data]);

    const toggleMapFullscreen = () => {
        if (!document.fullscreenElement) {
            wrapperRef.current?.requestFullscreen().catch((err) => {
                console.error(
                    "Error attempting to enable fullscreen mode:",
                    err,
                );
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleStyleChange = (newStyle: string) => {
        if (mapRef.current) {
            mapRef.current.setStyle(newStyle);
        }
    };

    if (isLoading) return <Loading isLoading={isLoading} />;

    if (!data || data.result.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No GPS data for this activity.
            </div>
        );
    }

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "relative",
                width: "100%",
                height: isFullscreen ? "70vh" : "400px",
                backgroundColor: "#FFF",
            }}
        >
            <Flex
                gap={4}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 10,
                }}
            >
                <Select
                    getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                    }
                    defaultValue="mapbox://styles/mapbox/standard"
                    onChange={handleStyleChange}
                    options={[
                        {
                            value: "mapbox://styles/mapbox/standard",
                            label: "Standard",
                        },
                        {
                            value: "mapbox://styles/mapbox/outdoors-v12",
                            label: "Outdoors (Topo)",
                        },
                        {
                            value: "mapbox://styles/mapbox/satellite-streets-v12",
                            label: "Satellite",
                        },
                        {
                            value: "mapbox://styles/mapbox/dark-v11",
                            label: "Dark",
                        },
                    ]}
                />
                <Button
                    icon={
                        isMapFullscreen ? (
                            <CompressOutlined />
                        ) : (
                            <ExpandOutlined />
                        )
                    }
                    onClick={toggleMapFullscreen}
                />
            </Flex>
            <div
                id="map"
                style={{
                    width: "100%",
                    height: isMapFullscreen
                        ? "100%"
                        : isFullscreen
                          ? "60vh"
                          : "400px",
                    borderRadius: isMapFullscreen ? "0px" : "8px",
                    position: "relative",
                    overflow: "hidden",
                }}
                ref={mapContainerRef}
            />
        </div>
    );
};

export default MapAndGraphTab;
