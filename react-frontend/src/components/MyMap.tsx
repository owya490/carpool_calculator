import React, { useEffect, useRef } from "react";
import { Map } from "maplibre-gl";
import json from "./../resources/geoJson.json";

const MyMap = ({
    geoJson,
    startLat,
    startLong,
    destLat,
    destLong,
}: {
    geoJson: any;
    startLat: number;
    startLong: number;
    destLat: number;
    destLong: number;
}) => {
    // function getBoundsZoomLevel(bounds: any, mapDim: any) {
    //     var WORLD_DIM = { height: 256, width: 256 };
    //     var ZOOM_MAX = 21;

    //     function latRad(lat: any) {
    //         var sin = Math.sin((lat * Math.PI) / 180);
    //         var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    //         return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    //     }

    //     function zoom(mapPx: any, worldPx: any, fraction: any) {
    //         return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    //     }

    //     var ne = bounds.getNorthEast();
    //     var sw = bounds.getSouthWest();

    //     var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    //     var lngDiff = ne.lng() - sw.lng();
    //     var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

    //     var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    //     var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    //     return Math.min(latZoom, lngZoom, ZOOM_MAX);
    // }

    const mapContainer = useRef(null);

    useEffect(() => {
        // This API key is for use only in stackblitz.com
        // Get your Geoapify API key on https://www.geoapify.com/get-started-with-maps-api
        // The Geoapify service is free for small projects and the development phase.
        const myAPIKey = "c7d60eff83a4416a95ad4a73c50f0a13";

        // const mapStyle =
        //     "https://maps.geoapify.com/v1/styles/dark-matter/style.json";

        const mapStyle =
            "https://maps.geoapify.com/v1/styles/osm-carto/style.json";

        const initialState = {
            lng: 0,
            lat: 0,
            zoom: 6,
        };

        const map = new Map({
            container: "map-container",
            style: `${mapStyle}?apiKey=${myAPIKey}`,
            // style: "https://demotiles.maplibre.org/style.json",
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });
        map.on("load", function () {
            map.addSource("my-route", {
                type: "geojson",
                data: geoJson,
            });
            map.addLayer({
                id: "my-route-layer",
                type: "line",
                source: "my-route", // <= the same source id
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "#6084eb",
                    "line-width": 8,
                },
            });
        });
        map.fitBounds([
            [startLong, startLat],
            [destLong, destLat],
        ]);
    }, [mapContainer]);

    return (
        <div
            id="map-container"
            style={{ height: "100%", width: "200" }}
            ref={mapContainer}
        ></div>
    );
};

export default MyMap;
