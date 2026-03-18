import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useGetActivityStreamQuery } from "@/store";
import type { Activity } from "@/types/Activity";
import Loading from "@/components/Loading";
import type { ActivityStream } from "@/types/ActivityStream";

interface MapAndGraphTabProps {
    item: Activity;
}

const MapAndGraphTab = ({ item }: MapAndGraphTabProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

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
            id="map"
            style={{ height: "30vh", borderRadius: "8px", overflow: "hidden" }}
            ref={mapContainerRef}
        />
    );
};

export default MapAndGraphTab;
