import { Car } from "./svgs/Car";

export const Navbar = () => {
    return (
        <nav className="bg-gray-500 top-0 h-14 z-50 w-full flex items-center">
            <div className="font-bold text-2xl text-white ml-4 mr-1">
                Carpool Calculator
            </div>
            <Car />
        </nav>
    );
};
