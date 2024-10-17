// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FaqPage from './pages/faqPage.tsx'
import RegistrationSearch from "./pages/searchPage.tsx";
import HomePage from "./pages/homePage.tsx";
import RegisterPage from "./pages/registerPage.tsx";
import WhatToExpect16Page from "./pages/whatToExpect16Page.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/registrations" element={<RegistrationSearch />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/fromRegister" element={<WhatToExpect16Page />} />
            </Routes>
        </Router>
    );
};

export default App;
