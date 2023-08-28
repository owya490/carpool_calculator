import React from "react";
import { useState } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { delay } from "../utilities/utilities";
import {
    GeoapifyGeocoderAutocomplete,
    GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";
import "./../css/inputForm.css";
import { Results } from "./Results";

export const InputForm = () => {
    interface Person {
        name: string;
        location: string;
        isDriver: boolean;
        seats: number;
        destination: string;
    }
    const initialPeopleValue: Person[] = [];

    const [people, setPeople] = useState(initialPeopleValue);

    const [showResults, setShowResults] = useState(false);
    const [resultList, setResultList] = useState([]);

    return showResults ? (
        <Results list={resultList} />
    ) : (
        <div className="grid grid-cols-5 w-full">
            <div className="col-span-2 p-14">
                <h1 className="m-4 text-3xl font-bold">Add Person</h1>
                <Formik
                    initialValues={{
                        name: "",
                        location: "",
                        isDriver: false,
                        seats: 0,
                        destination: "",
                    }}
                    onSubmit={(values: Person, { resetForm }) => {
                        values.location = eval(
                            'document.getElementById("1").getElementsByClassName("geoapify-autocomplete-input")[0].value'
                        );
                        if (values.isDriver) {
                            values.destination = eval(
                                'document.getElementById("2").getElementsByClassName("geoapify-autocomplete-input")[0].value'
                            );
                            eval(
                                'document.getElementById("2").getElementsByClassName("geoapify-close-button")[0].click()'
                            );
                        }
                        setPeople([...people, values]);

                        resetForm();
                        eval(
                            'document.getElementById("1").getElementsByClassName("geoapify-close-button")[0].click()'
                        );
                    }}
                >
                    {({ values }) => (
                        <Form>
                            <div className="m-4">
                                <label className="block mb-2 pl-1 text-sm font-medium text-gray-900">
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Daniel Wang"
                                    required
                                />
                            </div>
                            <div id="1" className="m-4">
                                <label className="block mb-2 pl-1 text-sm font-medium text-gray-900">
                                    Location
                                </label>
                                <GeoapifyContext apiKey="84bc898d2c2645ddbeea44bc53a6fe5e">
                                    <GeoapifyGeocoderAutocomplete />
                                </GeoapifyContext>
                                {/* <Field
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Carlingford NSW"
                                        required
                                    /> */}
                            </div>
                            <div className="flex items-center m-4">
                                <Field
                                    id="isDriver"
                                    name="isDriver"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-900">
                                    Am I a driver?
                                </label>
                            </div>
                            {values.isDriver && (
                                <div>
                                    <div className="m-4">
                                        <label className="block mb-2 pl-1 text-sm font-medium text-gray-900">
                                            Seats (including yourself)
                                        </label>
                                        <Field
                                            type="text"
                                            id="seats"
                                            name="seats"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                                            required
                                        />
                                    </div>
                                    <div id="2" className="m-4">
                                        <label className="block mb-2 pl-1 text-sm font-medium text-gray-900">
                                            Destination
                                        </label>
                                        {/* <input
                                                type="text"
                                                id="destination"
                                                name="destination"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="Sydney NSW"
                                                required
                                            /> */}
                                        <GeoapifyContext apiKey="84bc898d2c2645ddbeea44bc53a6fe5e">
                                            <GeoapifyGeocoderAutocomplete />
                                        </GeoapifyContext>
                                    </div>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="text-blue-700 m-4 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            >
                                Add Person
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="col-span-3 p-14">
                <h1 className="my-4 text-3xl font-bold">Added People Table</h1>
                <div className="relative overflow-x-auto rounded-lg my-4 border-black border-[1px]">
                    <table className="w-full text-sm text-left text-gray-500 table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Driver?
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Destination
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Seats
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {people.length === 0 ? (
                                <tr className="bg-white border-b">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        Empty...
                                    </th>
                                    <td className="px-6 py-4"></td>
                                    <td className="px-6 py-4"></td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ) : (
                                people.map((p) => {
                                    return (
                                        <tr className="bg-white border-b">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                            >
                                                {p.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {p.location}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.isDriver ? "✔️" : "✖"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.destination}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.seats}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <button
                    type="submit"
                    className="text-green-700 w-full hover:text-white border border-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={async () => {
                        const payload = {
                            drivers: people.filter((element) => {
                                return element.isDriver;
                            }),
                            passengers: people.filter((element) => {
                                return !element.isDriver;
                            }),
                        };
                        console.log(payload);
                        const response = await fetch(
                            "https://49uj7z39jc.execute-api.ap-southeast-2.amazonaws.com/prod/",
                            {
                                method: "POST",
                                body: JSON.stringify(payload),
                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded; charset=UTF-8",
                                },
                            }
                        );
                        const responseJson = await response.json();
                        setResultList(responseJson.body);
                        document
                            .getElementById("submission-pill")!
                            .classList.replace("opacity-0", "opacity-100");
                        await delay(4000);
                        document
                            .getElementById("submission-pill")!
                            .classList.replace("opacity-100", "opacity-0");
                        await delay(1000);
                        setShowResults(true);
                    }}
                >
                    Submit
                </button>
            </div>
            <span
                id="submission-pill"
                className="absolute bottom-10 right-10 bg-green-100 text-green-800 text-lg font-medium mr-2 px-4 py-1.5 rounded-full transition-all opacity-0"
            >
                Submitted
            </span>
        </div>
    );
};
