import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';

import { ReviewReminder } from '../reviews/ReviewReminder';

const MainLayout: React.FC = () => {
    return (
        <div className="app-shell">
            <Header />
            <main>
                <Outlet />
            </main>
            <ReviewReminder />
            <WhatsAppButton />
            <Footer />
        </div>
    );
};

export default MainLayout;
