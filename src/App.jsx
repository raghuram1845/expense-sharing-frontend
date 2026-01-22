import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import GroupsPage from "./pages/GroupsPage";
import ExpensesPage from "./pages/ExpensesPage";
import BalancesPage from "./pages/BalancesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/balances" element={<BalancesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
