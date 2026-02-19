import React, { createContext, useState, useEffect } from "react";
import {
  getAllAnimalTypes,
  getAllGenders,
  getAllPastures,
  getAnimalBreeds,
  getAnimalsByType,
  getBreedingTypes,
  getAnimalLifecycle,
  getVendors
} from "../services";

export const AnimalDropdownContext = createContext();

export const AnimalDropdownProvider = ({ children }) => {

  const [animalTypes, setAnimalTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [breeds, setBreeds] = useState([]);
  const [femaleAnimals, setFemaleAnimals] = useState([]);
  const [maleAnimals, setMaleAnimals] = useState([]);
  const [lifecycles, setLifecycles] = useState([]);
  const [breedingTypes, setBreedingTypes] = useState([]);

  useEffect(() => {
    loadInitialDropdowns();
  }, []);

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // ⭐ Initial Master Load
  const loadInitialDropdowns = async () => {
    try {
      const [typesRes, genderRes, pastureRes, vendorRes] =
        await Promise.all([
          getAllAnimalTypes(),
          getAllGenders(),
          getAllPastures(),
          getVendors()
        ]);

      setAnimalTypes(typesRes?.data || []);
      setGenders(genderRes?.data || []);
      setPastures(pastureRes?.data?.details || []);
      setVendors(vendorRes?.data?.details || []);

    } catch (err) {
      console.log("Initial dropdown load failed", err);
    }
  };

  // ⭐ Breeds
  const loadBreeds = async (type) => {
    const res = await getAnimalBreeds(type);
    setBreeds(res?.data || []);
  };

  // ⭐ Parents
  const loadParentAnimals = async (type) => {
    const femaleRes = await getAnimalsByType({ animalType: type, gender: "Female" });
    const maleRes = await getAnimalsByType({ animalType: type, gender: "Male" });

    setFemaleAnimals(femaleRes?.data?.details || []);
    setMaleAnimals(maleRes?.data?.details || []);
  };

  // ⭐ Lifecycle
  const loadLifecycle = async (gender) => {
    const res = await getAnimalLifecycle(gender);

    const formatted = (res?.data?.details || []).map(item => ({
      ...item,
      event_type: capitalizeFirstLetter(item.event_type)
    }));

    setLifecycles(formatted);
  };

  // ⭐ Breeding Types
  const loadBreedingTypes = async (lifecycle) => {
    const formatted =
      lifecycle.charAt(0).toUpperCase() +
      lifecycle.slice(1).toLowerCase();

    const res = await getBreedingTypes(formatted);
    setBreedingTypes(res?.data || []);
  };

  return (
    <AnimalDropdownContext.Provider
      value={{
        animalTypes,
        genders,
        pastures,
        vendors,
        breeds,
        femaleAnimals,
        maleAnimals,
        lifecycles,
        breedingTypes,
        loadBreeds,
        loadParentAnimals,
        loadLifecycle,
        loadBreedingTypes
      }}
    >
      {children}
    </AnimalDropdownContext.Provider>
  );
};
