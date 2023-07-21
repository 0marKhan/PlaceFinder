import React from "react";

const FormBody = (props) => {
  return (
    <form
      className="mx-4 lg:flex lg:justify-center"
      onSubmit={props.submitHandler}
    >
      <div className="lg:flex lg:flex-col lg:items-center">
        <div className="group mt-8 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 ">
          <input
            className="w-full h-full outline-none"
            type="text"
            placeholder="Country"
            onChange={props.enteredCountryHandler}
          />
        </div>
      </div>
      <div className="lg:flex lg:flex-col lg:items-center">
        <div className="group mt-4 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 lg:mt-8 lg:ml-6">
          <input
            className="w-full h-full outline-none"
            type="text"
            placeholder="City"
            onChange={props.enteredCityHandler}
          />
        </div>
      </div>
      <div className="lg:flex lg:flex-col lg:items-center">
        <div className="group mt-4 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 lg:mt-8 lg:ml-6 ">
          <select
            value={props.selectedValue}
            onChange={props.handleSelectionChange}
            className="w-full h-full outline-none"
          >
            <option value="">Select an option</option>
            {props.selectOptions.map((selected) => (
              <option key={selected.value} value={selected.value}>
                {selected.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="mt-6 w-full h-10 rounded-xl text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-900 lg:w-32 lg:mt-8 lg:ml-6"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default FormBody;
