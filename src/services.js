import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL;

export const Login=async (data)=>{
    return await axios.post(`${API_URL}/userLogin`,data);
}

export const registerUser=async (data)=>{
    return await axios.post(`${API_URL}/userRegister`,data);
}

export const getEmployees=async(params)=>{
    return await axios.get(`${API_URL}/getAllEmployeeData`,{params})
}

export const updateEmployee = async(data) => {
  return await axios.post(`${API_URL}/updateEmployee`, data);
};

export const addEmployee=async (data)=>{
    return await axios.post(`${API_URL}/addEmployee`,data)
}

export const getAllAnimals = async (params) => {
  return await axios.get(`${API_URL}/getallAnimal`,{params});
};

export const addAnimal = async(data)=>{
  return await axios.post(`${API_URL}/animalRegister`,data)
}

export const createPasture= async(data)=>{
  return await axios.post(`${API_URL}/createPasture`,data)
}

export const getAllPastures= async ()=>{
  return await axios.get(`${API_URL}/getAllPastures`)
}

export const updatePastures= async(data)=>{
return await axios.post(`${API_URL}/updatePasture`,data);
}

export const deletePasture=async(data)=>{
  return await axios.post(`${API_URL}/deletePasture`,data)
}

export const getMedicines = async () => {
  return await axios.get(
    `${API_URL}/getallMedicine?stock_level=in&category=Hormone`
  );
};

export const getStockLogs = async(medicineId) => {
  return await axios.get(
    `${API_URL}/medicine/stock-logs?medicine_id=${medicineId}`
  );
}


export const getAllMedicines = async (params = {}) => {
  return await axios.get(`${API_URL}/getallMedicine`, {
    params,
  });
};

export const getMedicineCategories = async () => {
  return await axios.get(`${API_URL}/medicine/categories`);
};
export const addMedicineCategory=async(data)=>{
  return await axios.post(`${API_URL}/medicine/category`,data)
}
export const updateMedicineCategory=async(data)=>{
  return await axios.post(`${API_URL}/medicine/category/update`,data);
}
export const deleteMedicineCategory=async(data)=>{
  return await axios.post(`${API_URL}/medicine/category/delete`,data);
}
export const addMedicine= async(data)=>{
  return await axios.post(`${API_URL}/medicineRegister`,data)
}
export const getVendors=async()=>{
  return await axios.get(`${API_URL}/getAllVendors`);
}
export const addVendor=async(data)=>{
  return await axios.post(`${API_URL}/vendorRegistration`,data);
}

export const deleteVendor=async(data)=>{
  return await axios.post(`${API_URL}/deleteVendor`,data)
}

export const updateVendor=async(data)=>{
  return await axios.post(`${API_URL}/updateVendor`,data)
}
export const getUnits=async()=>{
  return await axios.get(`${API_URL}/medicine/units`);
}
export const addUnit=async(data)=>{
  return await axios.post(`${API_URL}/medicine/unit`,data);
}
export const updateUnit=async(data)=>{
  return await axios.post(`${API_URL}/medicine/unit/update`,data);
}
export const deleteUnit=async(data)=>{
  return await axios.post(`${API_URL}/medicine/unit/delete`,data);
}

export const getConsumption = async (animalTag) => {
  return await axios.get(`${API_URL}/medicine/consumption`, {
    params: animalTag ? { animal_tag: animalTag } : {}
  });
};

export const addConsumption=async(data)=>{
  return await axios.post(`${API_URL}/medicine/consume`,data);
}

export const getHeatRecordsByAnimalTag = async(tagNo) => {
  return await axios.get(
    `${API_URL}/getAllHeatRecordsByAnimalTag`,
    {
      params: {
        animalTagNo: tagNo
      }
    }
  );
};

export const addHeatRecord=async(data)=>{
  return await axios.post(`${API_URL}/createHeatRecord`,data);
}

export const deleteHeatRecord=async(data)=>{
  return await axios.post(`${API_URL}/deleteHeatRecord`,data)
}

export const getAnimalByTagNo = async(tagNo) => {
  return await axios.get(`${API_URL}/getAnimalByTagNo`, {
    params: { tagNo },
  });
}
export const getBreedingRecordsByAnimalTag = async(tagNo) =>{
  return await axios.get(`${API_URL}/getBreedingRecordsByAnimalTag/${tagNo}`);
}


export const createBreedingRecord = async (data) => {
  return await axios.post(`${API_URL}/createBreedingRecord`, data);
};
export const deleteBreedingRecord=async(data)=>{
  return await axios.post(`${API_URL}/deleteBreedingRecord`,data)
}

export const getAllPregnancyRecords=async(tagNo)=>{
  return await axios.get(`${API_URL}/getPregnancyRecordsByAnimalTag`,
    {
      params: {
        animalTagNo: tagNo
      }
    }
  );
}
export const addPregnancyRecord=async(data)=>{
  return await axios.post(`${API_URL}/createPregnancyRecord`,data);
}
// services.js
export const deletePregnancyRecord = async(data) => {  // correct spelling
  return await axios.post(`${API_URL}/deletePregnancyRecord`, data);
}

export const getVaccinesByAnimalId = async(animalId) => {
  return await axios.get(`${API_URL}/getVaccineByAnimalId`, {
    params: { animalId },
  });
};

export const getAllVaccines=async()=>{
  return await axios.get(`${API_URL}/getAllVaccine`);
}
export const getMilkingDataByAnimalTagNo = async (tagNo, startDate, endDate) => {
  return await axios.get(`${API_URL}/getMilkingDataByAnimalTagNo`, {
    params: {
      animalTagNo: tagNo,
      startDate,
      endDate
    }
  });
};

export const getCalvesByParentTag = async (parentTagNo) => {
  return await axios.get(
    `${API_URL}/getCalvesByParentTag/${parentTagNo}`
  );
};

export const addCalf = async (data) => {
  return await axios.post(`${API_URL}/recordCalving`, data);
};

export const getGroups=async(params)=>{
  return await axios.get(`${API_URL}/getAllGroups`,{params})
}
export const getGroupDetailsById=async(groupId)=>{
  return await axios.get(`${API_URL}/getGroupDetails`,{
    params:{groupId},
  });
}
export const addAnimalsToGroup = async (data) => {
  return await axios.post(`${API_URL}/addAnimalsToGroup`, data);
};
export const assignEmployeeToGroup = async (data) => {
  return await axios.post(
    `${API_URL}/assignEmployeeToGroup`,
    data
  );
};

export const unAssignEmployeeToGroup=async(data)=>{
  return await axios.post(`${API_URL}/unassignEmployeeToGroup`,data);
}
export const createGroup = async (data) => {

  return await axios.post(`${API_URL}/createGroup`, data);
};

// Get all group types
export const getAllGroupTypes = async () => {
  return await axios.get(`${API_URL}/getAllGroupTypes`);
};

export const getMilkingSummaryByGroup = async (groupId) => {
 
    return await axios.get(`${API_URL}/getMilkingSummaryByGroup`, {
      params: { groupId }}
    );
  }

  export const upsertMilkingRecord = async (data) => {
  return await axios.post(
    `${API_URL}/upsertMilkingRecord`,
    data
  );
};

export const getFodderStatus=async()=>{
  return await axios.get(`${API_URL}/fodder/stats`);
}

export const getLowStockFodder = async (threshold = 100) => {
  return await axios.get(`${API_URL}/fodder/low-stock?minThreshold=${threshold}`);
};

export const getConsumptionStats=async()=>{
  return await axios.get(`${API_URL}/fodder/consumption-status`)
}

export const addFodderData=async(data)=>{
  return await axios.post(`${API_URL}/addFodderData`,data);
}

export const addFodderType=async(data)=>{
  return await axios.post(`${API_URL}/addFodderType`,data);
}

export const getFodderTypes=async()=>{
  return await axios.get(`${API_URL}/getFodderTypes`)
}
export const deleteFodderType=async(data)=>{
  return await axios.post(`${API_URL}/deleteFodderType`,data);
}

export const getAllVendors=async()=>{
  return await axios.get(`${API_URL}/getAllVendors`)
}
export const getFodderData=async()=>{
  return await axios.get(`${API_URL}/getFodderData`)
}

export const timeSlotList = async (data) => {
  return await axios.post(`${API_URL}/time-slot/list`, data);
};
export const addTimeSlot=async(data)=>{
  return await axios.post(`${API_URL}/time-slot/create`, data);
}
export const deleteTimeSlot=async(data)=>{
  return await axios.post(`${API_URL}/time-slot/delete`,data);
}

export const updateTimeSlot=async(data)=>{
  return await axios.post(`${API_URL}/time-slot/update`,data);
}

export const addDailyConsumption=async(data)=>{
  return await axios.post(`${API_URL}/add-daily-consumption`,data)
}

export const getConsumptionReports=async()=>{
  return await axios.get(`${API_URL}/reports/consumption/by-animal-tag`)
}

export const getMilkingReportByGroup = async (groupId, startDate, endDate) => {
 
   return await axios.get(
      `${API_URL}/getMilkingSummaryByGroup`,
      {
        params: { groupId, startDate, endDate },
      });
   
    }

    // Get all dropdown data

export const getAllAnimalTypes= async()=>{
  return await axios.get(`${API_URL}/dropdown/getAnimalTypes`);
}

export const addAnimalType=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/addAnimalType`,data);
}

export const deleteAnimalType=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/deleteAnimalType`,data);
}

export const getAllGenders= async()=>{
  return await axios.get(`${API_URL}/dropdown/getGenders`)
}

export const addGender=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/addGender`,data);
}

export const deleteGender=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/deleteGender`,data);
}

export const getAnimalBreeds = async (animalType) => {
  return await axios.get(
    `${API_URL}/dropdown/getAnimalBreeds?animal_type=${animalType}`
  );
};

export const addAnimalBreed = async (data) => {
  return await axios.post(`${API_URL}/dropdown/addAnimalBreed`, data);
};

export const deleteAnimalBreed = async (data) => {
  return await axios.post(`${API_URL}/dropdown/deleteAnimalBreed`, data);
};


export const getBreedingTypes=async(lifecycle)=>{
  return await axios.get(`${API_URL}/dropdown/getBreedingTypes`,{params:{lifecycle}});
}

export const addBreedingType=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/addBreedingType`,data);
}

export const deleteBreedingType=async(data)=>{
  return await axios.post(`${API_URL}/dropdown/deleteBreedingType`,data);
}

export const getAnimalLifecycle = async (gender) => {
  return await axios.get(`${API_URL}/getAnimalLifecycle`, {
    params: { gender },
  });
};


export const addAnimalLifecycle= async(data)=>{
  return await axios.post(`${API_URL}//addAnimalLifecycle`,data);
}

export const deleteAnimalLifecycle=async(data)=>{
  return await axios.post(`${API_URL}/deleteAnimalLifecycle`,data);
}

export const getEmployeeDropdown = async (type) => {
  return await axios.get(
    `${API_URL}/dropdown/getEmployeeDropdown?type=${type}`
  );
};

/* ADD */
export const addEmployeeDropdown = async (data) => {
  return await axios.post(
    `${API_URL}/dropdown/addEmployeeDropdown`,
    data
  );
};

export const deleteEmployeeDropdown = async (data) => {
  return await axios.post(
    `${API_URL}/dropdown/deleteEmployeeDropdown`,
    data
  );
}

export const getAllGroupsTypes=async()=>{
  return await axios.get(`${API_URL}/getAllGroupTypes`);
}

export const addGroupType=async(data)=>{
  return await axios.post(`${API_URL}/createGroupType`,data);
}

export const deleteGroupType=async(data)=>{
  return await axios.post(`${API_URL}/deleteGroupType`,data);
}

export const getVaccineTypes=async()=>{
  return await axios.get(`${API_URL}/vaccine/types`);
}

export const addVaccineType=async(data)=>{
  return await axios.post(`${API_URL}/vaccine/type`,data)
}
export const deleteVaccineType=async(data)=>{
 return await axios.post(`${API_URL}/vaccine/type/delete`,data);
}

export const getheatScoreLists=async()=>{
  return await axios.get(`${API_URL}/heat-score/list`);

}

export const addHeatScoreList=async(data)=>{
  return await axios.post(`${API_URL}/heat-score/create`,data);
}

export const deleteScoreList=async(data)=>{
  return await axios.post(`${API_URL}/heat-score/delete`,data);
}

export const addMedicineList=async(data)=>{
  return await axios.post(`${API_URL}/medicineName/create`,data);
}

export const getMedicineList=async()=>{
  return await axios.get(`${API_URL}/medicineName/list`);
}

export const deleteMedicineList=async(data)=>{
  return await axios.post(`${API_URL}/medicineName/delete`,data);
}

export const updateMedicineList= async(data)=>{
  return await axios.post(`${API_URL}/medicineName/update`,data);
}

export const getPregnancyList =async()=>{
  return await axios.get(`${API_URL}/pregnancy-status/list`)
}

export const addPregnancyList = async(data)=>{
  return await axios.post(`${API_URL}/pregnancy-status/create`,data);
}

export const deletePregnancyList=async(data)=>{
  return await axios.post(`${API_URL}/pregnancy-status/delete`,data);
}

export const addVaccination=async(data)=>{
  return await axios.post(`${API_URL}/addVaccination`,data)
}

export const getCountsByAnimal=async(params)=>{
  return await axios.get(`${API_URL}/counts`,{params});
}

export const getAnimalsByType=async(params)=>{
  return await axios.get(`${API_URL}/getAnimalsByTypeAPI`,{params});
}

export const getNotifications = async (params) => {
  
    return await axios.get(`${API_URL}/getNotificationsByFarm/${params}`);
 
}

export const markAsReadNotifications=async(data)=>{
  return await axios.post(`${API_URL}/markNotificationsAsRead`,data)
}

export const updateMilkingRecord=async(data)=>{
  return await axios.post(`${API_URL}/updateMilkingRecord`,data)
}