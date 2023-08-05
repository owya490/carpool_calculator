import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { InputForm } from "./pages/InputForm";
import { Navbar } from "./components/Navbar";
import { Results } from "./pages/Results";

function App() {
    return (
        <div className="">
            <Navbar />
            <InputForm />
        </div>
    );
}

export default App;
