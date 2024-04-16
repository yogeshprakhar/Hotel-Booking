import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-sky-900 rounded-xl shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row flex-1 p-2 items-center rounded-lg bg-white">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="Wherre are you going"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex rounded-lg bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event?.target.value))}
          />
        </label>
        <label className="items-center flex">
          Children:
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event?.target.value))}
          />
        </label>
      </div>
      <div className="flex">
        <h5 className="rounded-l-lg bg-white pl-3 p-2 focus:outline-none">
          Check In -
        </h5>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="check-in Date"
          className="w-36 rounded-r-lg bg-white p-2 focus:outline-none"
        />
      </div>

      <div className="flex ">
        <h5 className="rounded-l-lg bg-white pl-4 p-2 focus:outline-none">
          Check out -
        </h5>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="check-in Date"
          className="w-36 rounded-r-lg bg-white p-2 focus:outline-none"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-2/3 bg-indigo-600 h-full rounded-lg p-2 font-bold text-xl hover:bg-indigo-400 text-white">
          Search
        </button>
        <button className="w-1/3 bg-lime-700 h-full p-2 rounded-lg font-bold text-xl hover:bg-lime-600 text-white">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
