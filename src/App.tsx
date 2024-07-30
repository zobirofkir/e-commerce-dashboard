import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import Order from './pages/Order';
import Offer from './pages/Offer';
import ProtectRoutes from './auth/ProtectRoutes';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="eCommerce Dashboard | csw-shop" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/*"
        element={
          <DefaultLayout>
            <ProtectRoutes/>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <PageTitle title="Calendar | csw-shop" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Calendar | csw-shop" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/products"
                element={
                  <>
                    <PageTitle title="Products | csw-shop" />
                    <Tables />
                  </>
                }
              />
              <Route
                path="/orders"
                element={
                  <>
                    <PageTitle title="Settings | csw-shop" />
                    <Order />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart | csw-shop" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/offers"
                element={
                  <>
                    <PageTitle title="Offers | csw-shop" />
                    <Offer />
                  </>
                }
              />
            </Routes>
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default App;
