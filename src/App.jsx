import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./components/UserLogin";
import UserSignup from "./components/UserSignup";
import EmployeeList from "./components/EmployeeList";
import UpdateEmployee from "./components/UpdateEmployee";
import Layout from "./components/Layout";
import AddEmployee from "./components/AddEmployee";
import AnimalList from "./components/AnimalList";
import AddAnimal from "./components/AddAnimal";
import Pastures from "./components/Pastures/Pastures";
import AddPasture from "./components/Pastures/AddPasture";
import Medicine from "./components/Medicines/Medicine";
import InputInventory from "./components/Medicines/InputInventory";
import OutputInventory from "./components/Medicines/OutputInventory";
import StockInventory from "./components/Medicines/StockInventory";
import AnimalEdit from "./components/Animals/AnimalEdit";
import BreedingTab from "./components/Animals/Breeding/BreedingTab";
import HealthTab from "./components/Animals/HealthTab";
import HeatList from "./components/Animals/Breeding/Heat/HeatList";
import BreedingList from "./components/Animals/Breeding/Heat/BreedingList";
import PregnancyList from "./components/Animals/Breeding/Heat/PregnancyList";
import VaccinationTab from "./components/Animals/VaccinationTab";
import MilkingTab from "./components/Animals/Milking/MilkingTab";
import TimeLine from "./components/Animals/Timeline/TimeLine";
import CalfTags from "./components/Animals/Calf/CalfTags";
import GroupsList from "./components/Groups/GroupsList";
import GroupsDetails from "./components/Groups/GroupsDetails";
import MilkRecords from "./components/Milking/MilkRecords";
import MilkReports from "./components/Milking/MilkReports/MilkReports";
import FodderList from "./components/Fodder/FodderList";
import AllDropDowns from "./components/All DropDowns/AllDropDowns";
import OpenCount from "./components/Dashboard/OpenCount";
import CattleCount from "./components/Dashboard/CattleCount";
import CowReports from "./components/Dashboard/CowReports";

import Counts from "./components/Dashboard/Counts";
import BuffaloReports from "./components/Dashboard/BuffaloReports";
import Notifications from "./components/Notifications/Notifications";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      {/* Protected Layout with SideNav */}
      <Route element={<Layout />}>
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/update-employee" element={<UpdateEmployee />} />
        <Route path="/add-employee" element={<AddEmployee />}/>
        <Route path="/animals" element={<AnimalList />} />
        <Route path="/animals/add" element={<AddAnimal />} />
        <Route path="/animals/edit/:tagNo" element={<AnimalEdit />} />
        <Route path="animals/breeding/:tagNo" element={<BreedingTab />}>
    <Route index element={<HeatList />} />
    <Route index element={<BreedingList/>}/>
    <Route index element={<PregnancyList/>}/>
    <Route index element={<VaccinationTab />} />
    <Route index element={<MilkingTab />} />
    <Route index element={<TimeLine />} />
    <Route index element={<CalfTags />} />
  </Route>
<Route path="/grouping" element={<GroupsList />} />
<Route path="/grouping/:groupId" element={<GroupsDetails />} />
<Route path="/milking" element={<MilkRecords />} />
<Route path="/milkreports" element={<MilkReports />}/>
<Route path="/counts"element={<Counts/>}/>
<Route path="/opencount" element={<OpenCount/>}/>
<Route path="/cattlecount" element={<CattleCount />}/>
<Route path="/cowreports" element={<CowReports/>}/>
<Route path="/buffaloreports" element={<BuffaloReports/>}/>

<Route path="/alldropdowns" element={<AllDropDowns />}/>
<Route path="/notifications" element={<Notifications/>}/>
<Route path="/fodder" element={<FodderList />}/>
        <Route path="/animals/heat/:tagNo" element={<HealthTab />} />
        <Route path="pastures" element={<Pastures />}/>
        <Route path="/pastures/add" element={<AddPasture />} />
          <Route path="/medicines" element={<Medicine />}>
           <Route index element={<Navigate to="input" replace />} />
          <Route path="input" element={<InputInventory />} />
          <Route path="output" element={<OutputInventory />} />
          <Route path="stock" element={<StockInventory/>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
