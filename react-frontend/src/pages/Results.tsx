import React, { useEffect, useRef, useState } from "react";
import {
    HomeSvg,
    LocationSvg,
    TargetSvg,
} from "../components/svgs/ResultsSvgs";
import "leaflet/dist/leaflet.css";
import MyMap from "../components/MyMap";
import { delay } from "../utilities/utilities";

export const Results = ({ list }: { list: any }) => {
    // const list = [
    //     {
    //         driver: {
    //             name: "Daniel",
    //             location: {
    //                 address: "test home",
    //                 lat: -33.7569444,
    //                 lng: 151.0775,
    //             },
    //             destination: {
    //                 address: "test dest",
    //                 lat: -33.8698439,
    //                 lng: 151.2082848,
    //             },
    //         },
    //         passenger: [
    //             {
    //                 name: "Owen",
    //                 location: {
    //                     address: "carlo",
    //                     lat: -33.802949,
    //                     lng: 151.0440587,
    //                 },
    //             },
    //             {
    //                 name: "Ashley",
    //                 location: {
    //                     address: "ermington",
    //                     lat: -33.7744947,
    //                     lng: 151.0475215,
    //                 },
    //             },
    //         ],
    //     },
    //     // {
    //     //     driver: {
    //     //         name: "Brian",
    //     //         location: "test home 2",
    //     //         destination: "edwins house",
    //     //     },
    //     //     passenger: [
    //     //         { name: "Reggie", location: "dundas" },
    //     //         { name: "Aidan", location: "turra" },
    //     //     ],
    //     // },
    // ];
    const [tabSelected, setTabSelected] = useState(0);
    const unselectedTabClassNameString =
        "w-full border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 cursor-pointer";
    const selectedTabClassNameString =
        "w-full text-blue-600 border-b-2 border-blue-600 rounded-t-lg active";

    const [time, setTime] = useState(0);
    const [geoJson, setGeoJson] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const driverList = list[tabSelected];
        var myUrl = "https://api.geoapify.com/v1/routing?mode=drive&waypoints=";

        myUrl += `${driverList.driver.location.lat},${driverList.driver.location.lng}|`;
        driverList.passenger.map((p: any) => {
            myUrl += `${p.location.lat},${p.location.lng}|`;
        });
        myUrl += `${driverList.driver.destination.lat},${driverList.driver.destination.lng}`;
        const apiKey = "&apiKey=c7d60eff83a4416a95ad4a73c50f0a13";
        myUrl += apiKey;
        console.log(myUrl);

        const response = fetch(myUrl, {
            method: "GET",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
        }).then((response) => {
            console.log(response);
            response
                .json()
                .then((data) => {
                    setTime(data.features[0].properties.time);
                    setGeoJson(data);
                })
                .finally(async () => {
                    await delay(1000);
                    setLoading(false);
                });
            // response.json() as Promise<{ data: any }>;
        });
        // .then((data: any) => {
        //     console.log(data);
        //     // setTime(data.features[0].properties.time);
        //     // setGeoJson(data);
        // })
        // .finally(async () => {
        //     await delay(1000);
        //     setLoading(false);
        // });
    }, []);
    return loading ? (
        <div></div>
    ) : (
        <div>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex -mb-px">
                    {list.map((p: any, idx: number) => {
                        return (
                            <li
                                className={
                                    `tab-${idx}` === `tab-${tabSelected}`
                                        ? selectedTabClassNameString
                                        : unselectedTabClassNameString
                                }
                                onClick={() => {
                                    setTabSelected(idx);
                                }}
                            >
                                <a
                                    id={`tab-${idx}`}
                                    className="inline-block p-4 border-b-2 border-transparent rounded-t-lg"
                                >
                                    {p.driver.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="grid grid-cols-2">
                <div className="col-span-1 p-14 text-2xl">
                    <div className="flex">
                        <HomeSvg />
                        <h2>{`${list[tabSelected].driver.name} - ${list[tabSelected].driver.location.address}`}</h2>
                    </div>
                    <div className="h-10 my-3 ml-4 bg-gray-400 w-[1px]"></div>
                    {list[tabSelected].passenger.map((p: any) => {
                        return (
                            <div>
                                <div className="flex">
                                    <TargetSvg />
                                    <h2>{`${p.name} - ${p.location.address}`}</h2>
                                </div>
                                <div className="h-10 my-3 ml-4 bg-gray-400 w-[1px]"></div>
                            </div>
                        );
                    })}
                    <div className="flex">
                        <LocationSvg />
                        <h2>{list[tabSelected].driver.destination.address}</h2>
                    </div>
                    <h2 className="mt-20">{`Total travel time: ${
                        time / 60
                    } mins`}</h2>
                </div>
                <div className="col-span-1">
                    <MyMap
                        geoJson={geoJson}
                        startLat={list[tabSelected].driver.location.lat}
                        startLong={list[tabSelected].driver.location.lng}
                        destLat={list[tabSelected].driver.destination.lat}
                        destLong={list[tabSelected].driver.destination.lng}
                    />
                </div>
            </div>
        </div>
    );
};
