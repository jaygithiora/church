import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HomePage from "./pages/dashboard/HomePage";
import IndexPage from "./pages/IndexPage";
import RolesPage from "./pages/dashboard/users/roles/RolesPage";
import UsersPage from "./pages/dashboard/users/UsersPage";
import TransactionsPage from "./pages/dashboard/transactions/TransactionsPage";
import RolePage from "./pages/dashboard/users/roles/RolePage";
import ProfilePage from "./pages/dashboard/profile/ProfilePage";
import VerifyPhonePage from "./pages/VerifyPhonePage";
import LoadingBar from "react-top-loading-bar";
import SpecialistsPage from "./pages/SpecialistsPage";
import AmbulancesPage from "./pages/AmbulancesPage";
import RegisterDetailsPage from "./pages/RegisterDetailsPage";
import PaymentModeSettingsPage from "./pages/dashboard/settings/PaymentModeSettingsPage";
import FundSourceSettingsPage from "./pages/dashboard/settings/FundSourceSettingsPage";
import GenderSettingsPage from "./pages/dashboard/settings/GenderSettingsPage";
import ArticlesPage from "./pages/dashboard/articles/ArticlesPage";
import ArticlePage from "./pages/dashboard/articles/ArticlePage";
import ArticleViewPage from "./pages/dashboard/articles/ArticleViewPage";
import EmailsPage from "./pages/dashboard/communication/EmailsPage";
import DiariesPage from "./pages/dashboard/diary/DiariesPage";
import EmailPage from "./pages/dashboard/communication/EmailPage";
import SmsesPage from "./pages/dashboard/communication/SmsesPage";
import SmsPage from "./pages/dashboard/communication/SmsPage";
import SchedulesPage from "./pages/dashboard/communication/SchedulesPage";
import SchedulePage from "./pages/dashboard/communication/SchedulePage";
import TestimonialsPage from "./pages/dashboard/spiritual/TestimonialsPage";
import TestimonialPage from "./pages/dashboard/spiritual/TestimonialPage";
import PrayerPage from "./pages/dashboard/spiritual/PrayerPage";
import PrayersPage from "./pages/dashboard/spiritual/PrayersPage";
import SermonsPage from "./pages/dashboard/spiritual/SermonsPage";
import SermonPage from "./pages/dashboard/spiritual/SermonPage";
import ChildrenPage from "./pages/dashboard/children/ChildrenPage";
import ChildrenCheckInPage from "./pages/dashboard/children/ChildrenCheckInPage";
import ChildrenEventsPage from "./pages/dashboard/children/ChildrenEventsPage";
import AgeGroupSettingsPage from "./pages/dashboard/settings/AgeGroupSettingsPage";
import PeoplePage from "./pages/dashboard/people/PeoplePage";
import PeopleMembersPage from "./pages/dashboard/people/PeopleMembersPage";
import EventsPage from "./pages/dashboard/events/EventsPage";
import EventPage from "./pages/dashboard/events/EventPage";
function AppRoutes() {
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        ref.current?.continuousStart();
        const timeout = setTimeout(() => {
            ref.current?.complete();
        }, 500);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <>
            <LoadingBar color="#⁠FF3D71" ref={ref} />
            <Routes>
                {/* Guest Routes */}
                <Route element={<GuestLayout />}>
                    <Route path="/" element={<IndexPage />/*<Navigate to="/login" replace />*/} />
                    <Route path="/specialists" element={<SpecialistsPage/>}/>
                    <Route path="/ambulances" element={<AmbulancesPage/>}/>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register/:id" element={<RegisterDetailsPage />} />
                    <Route path="/verify/phone" element={<VerifyPhonePage />} />
                </Route>

                {/* Authenticated Routes */}
                <Route element={<AuthLayout />}>\
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/home" element={<HomePage />} />
                    {/**diary */}
                    <Route path="/dashboard/diary" element={<DiariesPage />} />
                    {/*Events*/}
                    <Route path="/dashboard/events" element={<EventsPage />} />
                    <Route path="/dashboard/events/list" element={<EventsPage />} />
                    <Route path="/dashboard/events/add" element={<EventPage />} />
                    {/*people*/}
                    <Route path="/dashboard/people" element={<PeoplePage/>}/>
                    <Route path="/dashboard/people/list" element={<PeoplePage/>}/>
                    <Route path="/dashboard/people/members" element={<PeopleMembersPage/>}/>
                    <Route path="/dashboard/people/members/view/:id" element={<PeopleMembersPage/>}/>
                    {/*Children*/}
                    <Route path="/dashboard/children/all" element={<ChildrenPage />} />
                    <Route path="/dashboard/children/events" element={<ChildrenEventsPage/>} />
                    <Route path="/dashboard/children/checkin" element={<ChildrenCheckInPage/>} />

                    {/*spiritual*/}
                    <Route path="/dashboard/spiritual/sermons" element={<SermonsPage />} />
                    <Route path="/dashboard/spiritual/sermons/add" element={<SermonPage/>} />
                    <Route path="/dashboard/spiritual/sermons/view/:id" element={<SermonPage />} />

                    <Route path="/dashboard/spiritual/prayers" element={<PrayersPage />} />
                    <Route path="/dashboard/spiritual/prayers/add" element={<PrayerPage />} />
                    <Route path="/dashboard/spiritual/prayers/view/:id" element={<PrayerPage />} />
                    
                    <Route path="/dashboard/spiritual/testimonials" element={<TestimonialsPage />} />
                    <Route path="/dashboard/spiritual/testimonials/add" element={<TestimonialPage />} />
                    <Route path="/dashboard/spiritual/testimonials/view/:id" element={<TestimonialPage />} />

                    {/*communication*/}
                    <Route path="/dashboard/communication/emails" element={<EmailsPage />} />
                    <Route path="/dashboard/communication/emails/send" element={<EmailPage />} />
                    <Route path="/dashboard/communication/sms" element={<SmsesPage />} />
                    <Route path="/dashboard/communication/sms/send" element={<SmsPage />} />
                    <Route path="/dashboard/communication/schedules" element={<SchedulesPage/>} />
                    <Route path="/dashboard/communication/schedules/add" element={<SchedulePage />} />
                    <Route path="/dashboard/communication/schedules/view/:id" element={<SchedulePage />} />
                    {/*Articles*/}
                    <Route path="/dashboard/articles" element={<ArticlesPage/>} />
                    <Route path="/dashboard/articles/edit/:id" element={<ArticlePage/>} />
                    <Route path="/dashboard/articles/view/:id" element={<ArticleViewPage/>} />
                    <Route path="/dashboard/articles/add" element={<ArticlePage />} />
                    {/*Transactions*/}
                    <Route path="/dashboard/transactions" element={<TransactionsPage />} />
                    {/*Settings*/}
                    <Route path="/dashboard/settings/payment_modes" element={<PaymentModeSettingsPage />} />
                    <Route path="/dashboard/settings/fund_sources" element={<FundSourceSettingsPage />} />
                    <Route path="/dashboard/settings/genders" element={<GenderSettingsPage />} />
                    <Route path="/dashboard/settings/age-groups" element={<AgeGroupSettingsPage />} />
                    {/*Users */}
                    <Route path="/dashboard/users" element={<UsersPage />} />
                    <Route path="/dashboard/users/all" element={<UsersPage />} />
                    {/*Roles*/}
                    <Route path="/dashboard/users/roles" element={<RolesPage />} />
                    <Route path="/dashboard/users/roles/view/:id" element={<RolePage />} />
                    {/*Profile*/}
                    <Route path="dashboard/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </>
    );
}

export default AppRoutes;