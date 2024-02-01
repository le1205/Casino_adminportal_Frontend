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
  // Dashboard: Admin
  AdminListPage,
  AdminIpPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  PricingPage,
  PaymentPage,
  ComingSoonPage,
  MaintenancePage,
  //
  ComponentsOverviewPage,
  FoundationColorsPage,
  FoundationTypographyPage,
  FoundationShadowsPage,
  FoundationGridPage,
  FoundationIconsPage,
  //
  MUIAccordionPage,
  MUIAlertPage,
  MUIAutocompletePage,
  MUIAvatarPage,
  MUIBadgePage,
  MUIBreadcrumbsPage,
  MUIButtonsPage,
  MUICheckboxPage,
  MUIChipPage,
  MUIDataGridPage,
  MUIDialogPage,
  MUIListPage,
  MUIMenuPage,
  MUIPaginationPage,
  MUIPickersPage,
  MUIPopoverPage,
  MUIProgressPage,
  MUIRadioButtonsPage,
  MUIRatingPage,
  MUISliderPage,
  MUIStepperPage,
  MUISwitchPage,
  MUITablePage,
  MUITabsPage,
  MUITextFieldPage,
  MUITimelinePage,
  MUITooltipPage,
  MUITransferListPage,
  MUITreesViewPage,
  //
  DemoAnimatePage,
  DemoCarouselsPage,
  DemoChartsPage,
  DemoCopyToClipboardPage,
  DemoEditorPage,
  DemoFormValidationPage,
  DemoImagePage,
  DemoLabelPage,
  DemoLightboxPage,
  DemoMapPage,
  DemoMegaMenuPage,
  DemoMultiLanguagePage,
  DemoNavigationBarPage,
  DemoOrganizationalChartPage,
  DemoScrollbarPage,
  DemoSnackbarPage,
  DemoTextMaxLinePage,
  DemoUploadPage,
  DemoMarkdownPage,
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
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
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
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <AboutPage /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <FaqsPage /> },
        // Demo Components
        {
          path: 'components',
          children: [
            { element: <ComponentsOverviewPage />, index: true },
            {
              path: 'foundation',
              children: [
                { element: <Navigate to="/components/foundation/colors" replace />, index: true },
                { path: 'colors', element: <FoundationColorsPage /> },
                { path: 'typography', element: <FoundationTypographyPage /> },
                { path: 'shadows', element: <FoundationShadowsPage /> },
                { path: 'grid', element: <FoundationGridPage /> },
                { path: 'icons', element: <FoundationIconsPage /> },
              ],
            },
            {
              path: 'mui',
              children: [
                { element: <Navigate to="/components/mui/accordion" replace />, index: true },
                { path: 'accordion', element: <MUIAccordionPage /> },
                { path: 'alert', element: <MUIAlertPage /> },
                { path: 'autocomplete', element: <MUIAutocompletePage /> },
                { path: 'avatar', element: <MUIAvatarPage /> },
                { path: 'badge', element: <MUIBadgePage /> },
                { path: 'breadcrumbs', element: <MUIBreadcrumbsPage /> },
                { path: 'buttons', element: <MUIButtonsPage /> },
                { path: 'checkbox', element: <MUICheckboxPage /> },
                { path: 'chip', element: <MUIChipPage /> },
                { path: 'data-grid', element: <MUIDataGridPage /> },
                { path: 'dialog', element: <MUIDialogPage /> },
                { path: 'list', element: <MUIListPage /> },
                { path: 'menu', element: <MUIMenuPage /> },
                { path: 'pagination', element: <MUIPaginationPage /> },
                { path: 'pickers', element: <MUIPickersPage /> },
                { path: 'popover', element: <MUIPopoverPage /> },
                { path: 'progress', element: <MUIProgressPage /> },
                { path: 'radio-button', element: <MUIRadioButtonsPage /> },
                { path: 'rating', element: <MUIRatingPage /> },
                { path: 'slider', element: <MUISliderPage /> },
                { path: 'stepper', element: <MUIStepperPage /> },
                { path: 'switch', element: <MUISwitchPage /> },
                { path: 'table', element: <MUITablePage /> },
                { path: 'tabs', element: <MUITabsPage /> },
                { path: 'textfield', element: <MUITextFieldPage /> },
                { path: 'timeline', element: <MUITimelinePage /> },
                { path: 'tooltip', element: <MUITooltipPage /> },
                { path: 'transfer-list', element: <MUITransferListPage /> },
                { path: 'tree-view', element: <MUITreesViewPage /> },
              ],
            },
            {
              path: 'extra',
              children: [
                { element: <Navigate to="/components/extra/animate" replace />, index: true },
                { path: 'animate', element: <DemoAnimatePage /> },
                { path: 'carousel', element: <DemoCarouselsPage /> },
                { path: 'chart', element: <DemoChartsPage /> },
                { path: 'copy-to-clipboard', element: <DemoCopyToClipboardPage /> },
                { path: 'editor', element: <DemoEditorPage /> },
                { path: 'form-validation', element: <DemoFormValidationPage /> },
                { path: 'image', element: <DemoImagePage /> },
                { path: 'label', element: <DemoLabelPage /> },
                { path: 'lightbox', element: <DemoLightboxPage /> },
                { path: 'map', element: <DemoMapPage /> },
                { path: 'mega-menu', element: <DemoMegaMenuPage /> },
                { path: 'multi-language', element: <DemoMultiLanguagePage /> },
                { path: 'navigation-bar', element: <DemoNavigationBarPage /> },
                { path: 'organization-chart', element: <DemoOrganizationalChartPage /> },
                { path: 'scroll', element: <DemoScrollbarPage /> },
                { path: 'snackbar', element: <DemoSnackbarPage /> },
                { path: 'text-max-line', element: <DemoTextMaxLinePage /> },
                { path: 'upload', element: <DemoUploadPage /> },
                { path: 'markdown', element: <DemoMarkdownPage /> },
              ],
            },
          ],
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: 'pricing', element: <PricingPage /> },
        { path: 'payment', element: <PaymentPage /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
