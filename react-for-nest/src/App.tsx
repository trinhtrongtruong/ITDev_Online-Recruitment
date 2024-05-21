import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LayoutAdmin from 'components/admin/layout.admin';
import Footer from 'components/client/footer.client';
import Header from 'components/client/header.client';
import NotFound from 'components/share/not.found';
import ProtectedRoute from 'components/share/protected-route.ts';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import HomePage from 'pages/home';
import { useEffect, useRef, useState } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import styles from 'styles/app.module.scss';
import ViewUpsertJob from './components/admin/job/upsert.job';
import LayoutApp from './components/share/layout.app';
import CompanyPage from './pages/admin/company';
import DashboardPage from './pages/admin/dashboard';
import JobPage from './pages/admin/job';
import PermissionPage from './pages/admin/permission';
import PostPage from './pages/admin/post';
import ResumePage from './pages/admin/resume';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import ChangePasswordPage from './pages/auth/ChangePassword';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import VerifyOtpPage from './pages/auth/VerifyOTP';
import ClientCompanyPage from './pages/company';
import ClientCompanyDetailPage from './pages/company/detail';
import ClientJobPage from './pages/job';
import ClientJobDetailPage from './pages/job/detail';
import ClientPostPage from './pages/post';
import ClientPostDetailPage from './pages/post/detail';
import { fetchAccount } from './redux/slice/accountSlide';
const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "job", element: <ClientJobPage /> },
        { path: "job/:id", element: <ClientJobDetailPage /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> },
        { path: "post", element: <ClientPostPage /> },
        { path: "post/:id", element: <ClientPostDetailPage /> }
      ],
    },

    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      // errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "company",
          element:
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
        },
        {
          path: "post",
          element:
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },

        {
          path: "job",
          children: [
            {
              index: true,
              element: <ProtectedRoute> <JobPage /></ProtectedRoute>
            },
            {
              path: "upsert", element:
                <ProtectedRoute><ViewUpsertJob /></ProtectedRoute>
            }
          ]
        },

        {
          path: "resume",
          element:
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        }
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
    
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },

    {
      path: "/verify-otp",
      element: <VerifyOtpPage />,
    },

    {
      path: "/change-password",
      element: <ChangePasswordPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}