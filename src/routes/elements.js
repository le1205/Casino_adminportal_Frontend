import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

// DASHBOARD: PARTNER
export const PartnerListPage = Loadable(lazy(() => import('../pages/dashboard/partner/PartnerListPage')));
export const PartnerDetailPage = Loadable(lazy(() => import('../pages/dashboard/partner/PartnerDetailPage')));
export const PartnerCreatePage = Loadable(lazy(() => import('../pages/dashboard/partner/PartnerCreatePage')));
export const PartnerEditPage = Loadable(lazy(() => import('../pages/dashboard/partner/PartnerEditPage')));

// DASHBOARD: USER
export const UserListPage = Loadable(lazy(() => import('../pages/dashboard/user/UserListPage')));
export const UserListAccordingPartnerPage = Loadable(lazy(() => import('../pages/dashboard/user/UserListAccordingPartnerPage')));
export const UserAcceptPage = Loadable(lazy(() => import('../pages/dashboard/user/UserAcceptPage')));
export const UserCashPage = Loadable(lazy(() => import('../pages/dashboard/user/UserCashPage')));
export const UserPointPage = Loadable(lazy(() => import('../pages/dashboard/user/UserPointPage')));
export const UserTrackPage = Loadable(lazy(() => import('../pages/dashboard/user/UserTrackPage')));
export const UserConnectPage = Loadable(lazy(() => import('../pages/dashboard/user/UserConnectPage')));
export const UserRollingPage = Loadable(lazy(() => import('../pages/dashboard/user/UserRollingPage')));
export const UserMultiIpPage = Loadable(lazy(() => import('../pages/dashboard/user/UserMultiIpPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/dashboard/user/UserCreatePage')));

// DASHBOARD: BET
export const BetCommonPage = Loadable(lazy(() => import('../pages/dashboard/bet/BetCommonPage')));
export const BetCasinoPage = Loadable(lazy(() => import('../pages/dashboard/bet/BetCasinoPage')));
export const BetSlotPage = Loadable(lazy(() => import('../pages/dashboard/bet/BetSlotPage')));

// DASHBOARD: EGG
export const EggRequestPage = Loadable(lazy(() => import('../pages/dashboard/egg/EggRequestPage')));
export const EggExchangePage = Loadable(lazy(() => import('../pages/dashboard/egg/EggExchangePage')));
export const EggSettlementPage = Loadable(lazy(() => import('../pages/dashboard/egg/EggSettlementPage')));
export const EggProcessPage = Loadable(lazy(() => import('../pages/dashboard/egg/EggProcessPage')));

// DASHBOARD: INVOICE
export const InvoiceInApplyPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceInApplyPage')));
export const InvoiceInReportPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceInReportPage')));
export const InvoiceOutApplyPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceOutApplyPage')));
export const InvoiceOutReportPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceOutReportPage')));
export const InvoiceAdminListPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceAdminListPage')));
export const InvoiceHistoryPage = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceHistoryPage')));

// DASHBOARD: REPORT
export const ReportPartnerListPage = Loadable(lazy(() => import('../pages/dashboard/report/ReportPartnerListPage')));
export const ReportUserListPage = Loadable(lazy(() => import('../pages/dashboard/report/ReportUserListPage')));
export const ReportGameListPage = Loadable(lazy(() => import('../pages/dashboard/report/ReportGameListPage')));
export const ReportDailyPage = Loadable(lazy(() => import('../pages/dashboard/report/ReportDailyPage')));

// DASHBOARD: CUSTOMER CENTER
export const CustomerMessagePage = Loadable(lazy(() => import('../pages/dashboard/customer/CustomerMessagePage')));
export const CustomerBlogPage = Loadable(lazy(() => import('../pages/dashboard/customer/CustomerBlogPage')));
export const CustomerFaqPage = Loadable(lazy(() => import('../pages/dashboard/customer/CustomerFaqPage')));
export const CustomerNoticePage = Loadable(lazy(() => import('../pages/dashboard/customer/CustomerNoticePage')));

// DASHBOARD: SETTING
export const SettingAccountStatusPage = Loadable(lazy(() => import('../pages/dashboard/setting/account/SettingAccountStatusPage')));
export const SettingAccountLogPage = Loadable(lazy(() => import('../pages/dashboard/setting/account/SettingAccountLogPage')));
export const SettingCompanyBankPage = Loadable(lazy(() => import('../pages/dashboard/setting/company/SettingCompanyBankPage')));
export const SettingCompanyDomainPage = Loadable(lazy(() => import('../pages/dashboard/setting/company/SettingCompanyDomainPage')));
export const SettingGameCasinoPage = Loadable(lazy(() => import('../pages/dashboard/setting/game/SettingGameCasinoPage')));
export const SettingGameSlotPage = Loadable(lazy(() => import('../pages/dashboard/setting/game/SettingGameSlotPage')));
export const SettingLevelDomainPage = Loadable(lazy(() => import('../pages/dashboard/setting/level/SettingLevelDomainPage')));
export const SettingLevelListPage = Loadable(lazy(() => import('../pages/dashboard/setting/level/SettingLevelListPage')));
export const SettingSiteMainPage = Loadable(lazy(() => import('../pages/dashboard/setting/site/SettingSiteMainPage')));
export const SettingSiteHistoryPage = Loadable(lazy(() => import('../pages/dashboard/setting/site/SettingSiteHistoryPage')));
export const SettingSiteMaintainPage = Loadable(lazy(() => import('../pages/dashboard/setting/site/SettingSiteMaintainPage')));
export const SettingSiteOptionPage = Loadable(lazy(() => import('../pages/dashboard/setting/site/SettingSiteOptionPage')));

// DASHBOARD: ADMIN
export const AdminListPage = Loadable(lazy(() => import('../pages/dashboard/admin/AdminListPage')));
export const AdminIpPage = Loadable(lazy(() => import('../pages/dashboard/admin/AdminIpPage')));


// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loadable(
  lazy(() => import('../pages/dashboard/PermissionDeniedPage'))
);


// MAIN
export const Page500 = Loadable(lazy(() => import('../pages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));

