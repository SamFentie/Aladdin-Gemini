import "./styles.css";
import React, { useEffect, useState } from "react";
import Select from "react-select";

export const CountrySelect = ({setGrades,countries,setCountries,selectedCountry,setSelectedCountry}) => {
  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      const url=`http://127.0.0.1:5000/grades/${selectedCountry["value"]}`
            fetch(url).then(response=>response.json()).then(data=>{setGrades(data["grades"])}) 
      });
  }, []);
  return (
    <Select
      options={countries}
      value={selectedCountry}
      onChange={(selectedOption) =>{ setSelectedCountry(selectedOption)}}
    />
  );
};
