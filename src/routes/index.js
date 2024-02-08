import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  // Dashboard: Partner
  PartnerListPage,
  PartnerEditPage,
  PartnerCreatePage,
  PartnerDetailPage,
  // Dashboard: User
  UserListPage,
  UserListAccordingPartnerPage,
  UserAcceptPage,
  UserCashPage,
  UserPointPage,
  UserTrackPage,
  UserConnectPage,
  UserRollingPage,
  UserMultiIpPage,
  UserCreatePage,
  // Dashboard: Bet
  BetCommonPage,
  BetCasinoPage,
  BetSlotPage,
  // Dashboard: Egg
  EggRequestPage,
  EggExchangePage,
  EggSettlementPage,
  EggProcessPage,
  // Dashboard: Invoice
  InvoiceInApplyPage,
  InvoiceInReportPage,
  InvoiceOutApplyPage,
  InvoiceOutReportPage,
  InvoiceAdminListPage,
  InvoiceHistoryPage,
  // Dashboard: Report
  ReportPartnerListPage,
  ReportUserListPage,
  ReportGameListPage,
  ReportDailyPage,
  // Dashboard: Customer
  CustomerMessagePage,
  CustomerBlogPage,
  CustomerFaqPage,
  CustomerNoticePage,
  // Dashboard: Setting
  SettingAccountStatusPage,
  SettingAccountLogPage,
  SettingCompanyBankPage,
  SettingCompanyDomainPage,
  SettingLevelListPage,
  SettingLevelDomainPage,
  SettingSiteMainPage,
  SettingSiteHistoryPage,
  SettingSiteMaintainPage,
  SettingSiteOptionPage,
  SettingGameCasinoPage,
  SettingGameSlotPage,
  // Dashboard: Admin
  AdminListPage,
  AdminIpPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        // <AuthGuard>
          <DashboardLayout />
        // </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        {
          path: 'partner',
          children: [
            { element: <Navigate to="/dashboard/partner/list" replace />, index: true },
            { path: 'list', element: <PartnerListPage /> },
            { path: 'new', element: <PartnerCreatePage /> },
            { path: ':name/edit', element: <PartnerEditPage /> },
            { path: 'detail', element: <PartnerDetailPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/new" replace />, index: true },
            { path: 'new', element: <UserCreatePage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'partner-list', element: <UserListAccordingPartnerPage /> },
            { path: 'accept', element: <UserAcceptPage /> },
            { path: 'cash', element: <UserCashPage /> },
            { path: 'point', element: <UserPointPage /> },
            { path: 'track', element: <UserTrackPage /> },
            { path: 'connect', element: <UserConnectPage /> },
            { path: 'rolling', element: <UserRollingPage /> },
            { path: 'multi-ip', element: <UserMultiIpPage /> },
          ],
        },
        {
          path: 'bet',
          children: [
            { element: <Navigate to="/dashboard/bet/common" replace />, index: true },
            { path: 'common', element: <BetCommonPage /> },
            { path: 'casino', element: <BetCasinoPage /> },
            { path: 'slot', element: <BetSlotPage /> },
          ],
        },
        {
          path: 'egg',
          children: [
            { element: <Navigate to="/dashboard/egg/reqeust" replace />, index: true },
            { path: 'request', element: <EggRequestPage /> },
            { path: 'exchange', element: <EggExchangePage /> },
            { path: 'settlement', element: <EggSettlementPage /> },
            { path: 'process', element: <EggProcessPage /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/in-apply" replace />, index: true },
            { path: 'in-apply', element: <InvoiceInApplyPage /> },
            { path: 'in-report', element: <InvoiceInReportPage /> },
            { path: 'out-apply', element: <InvoiceOutApplyPage /> },
            { path: 'out-report', element: <InvoiceOutReportPage /> },
            { path: 'admin-list', element: <InvoiceAdminListPage /> },
            { path: 'history', element: <InvoiceHistoryPage /> },
          ],
        },
        {
          path: 'report',
          children: [
            { element: <Navigate to="/dashboard/report/partner" replace />, index: true },
            { path: 'partner', element: <ReportPartnerListPage /> },
            { path: 'user', element: <ReportUserListPage /> },
            { path: 'game', element: <ReportGameListPage /> },
            { path: 'daily', element: <ReportDailyPage /> },
          ],
        },
        {
          path: 'customer',
          children: [
            { element: <Navigate to="/dashboard/customer/message" replace />, index: true },
            { path: 'message', element: <CustomerMessagePage /> },
            { path: 'blog', element: <CustomerBlogPage /> },
            { path: 'faq', element: <CustomerFaqPage /> },
            { path: 'notice', element: <CustomerNoticePage /> },
          ],
        },
        {
          path: 'setting',
          children: [
            { element: <Navigate to="/dashboard/setting/account" replace />, index: true },
            { path: 'account',
              children: [{ 
                element: <Navigate to="/dashboard/setting/account/list" replace />, index: true },
                { path: 'list', element: <SettingAccountStatusPage /> },
                { path: 'log', element: <SettingAccountLogPage /> },
              ]   
            },
            { path: 'company',
              children: [{ 
                element: <Navigate to="/dashboard/setting/company/bank" replace />, index: true },
                { path: 'bank', element: <SettingCompanyBankPage /> },
                { path: 'domain', element: <SettingCompanyDomainPage /> },
              ]   
            },
            { path: 'level',
              children: [{ 
                element: <Navigate to="/dashboard/setting/level/list" replace />, index: true },
                { path: 'list', element: <SettingLevelListPage /> },
                { path: 'domain', element: <SettingLevelDomainPage /> },
              ]   
            },
            { path: 'site',
              children: [{ 
                element: <Navigate to="/dashboard/setting/site/main" replace />, index: true },
                { path: 'main', element: <SettingSiteMainPage /> },
                { path: 'history', element: <SettingSiteHistoryPage /> },
                { path: 'maintain', element: <SettingSiteMaintainPage /> },
                { path: 'option', element: <SettingSiteOptionPage /> },
              ]   
            },
            { path: 'game',
              children: [{ 
                element: <Navigate to="/dashboard/setting/game/list" replace />, index: true },
                { path: 'casino', element: <SettingGameCasinoPage /> },
                { path: 'slot', element: <SettingGameSlotPage /> },
              ]   
            },
          ],
        },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/dashboard/admin/list" replace />, index: true },
            { path: 'list', element: <AdminListPage /> },
            { path: 'ip', element: <AdminIpPage /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      element: <CompactLayout />,
      children: [
        { element: <LoginPage />, index: true },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
