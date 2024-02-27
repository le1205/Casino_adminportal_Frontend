// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  egg:icon('ic_egg'),
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  admin: icon('ic_admin'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  setting: icon('ic_setting'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  partner: icon('ic_partner'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  customer: icon('ic_customer'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // DASHBORAD
  // ----------------------------------------------------------------------
  {
    subheader: 'dashboard',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // PARTNER
      {
        title: 'partner',
        path: PATH_DASHBOARD.partner.root,
        icon: ICONS.partner,
        children: [
          { title: 'partnerList', path: PATH_DASHBOARD.partner.list },
          { title: 'partnerCreate', path: PATH_DASHBOARD.partner.new },
          { title: 'partnerDetail', path: PATH_DASHBOARD.partner.detail },
        ],
      },
      // USER
      {
        title: 'member',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'createMember', path: PATH_DASHBOARD.user.new },
          { title: 'memberList', path: PATH_DASHBOARD.user.list },
          { title: 'memberListPtn', path: PATH_DASHBOARD.user.listAccordingPartner },
          { title: 'memberApproval', path: PATH_DASHBOARD.user.accept },
          { title: 'moneyTransactionList', path: PATH_DASHBOARD.user.cash },
          { title: 'managePoint', path: PATH_DASHBOARD.user.point },
          { title: 'userTracking', path: PATH_DASHBOARD.user.track },
          { title: 'loggedInMember', path: PATH_DASHBOARD.user.connect },
          { title: 'mamnageRollingRate', path: PATH_DASHBOARD.user.rolling },
          { title: 'multiIpList', path: PATH_DASHBOARD.user.multiIp },
        ],
      },

      // BET
      {
        title: 'bettingList',
        path: PATH_DASHBOARD.bet.root,
        icon: ICONS.cart,
        children: [
          { title: 'totalBetList', path: PATH_DASHBOARD.bet.common },
          { title: 'casinoGameList', path: PATH_DASHBOARD.bet.casino },
          { title: 'slotGameList', path: PATH_DASHBOARD.bet.slot },
        ],
      },

      // EGG
      {
        title: 'pt',
        path: PATH_DASHBOARD.egg.root,
        icon: ICONS.egg,
        children: [
          { title: 'PTDepositList', path: PATH_DASHBOARD.egg.request },
          { title: 'PTWithdrawalList', path: PATH_DASHBOARD.egg.exchange },
          { title: 'creditSum', path: PATH_DASHBOARD.egg.settlement },
          { title: 'creditSaveList', path: PATH_DASHBOARD.egg.process },
        ],
      },

      // INVOICE
      {
        title: 'depositWithdraw',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'deposit', path: PATH_DASHBOARD.invoice.inApply },
          { title: 'depositList', path: PATH_DASHBOARD.invoice.inReport },
          { title: 'withdraw', path: PATH_DASHBOARD.invoice.outApply },
          { title: 'withdrawList', path: PATH_DASHBOARD.invoice.outReport },
          { title: 'operatorTransaction', path: PATH_DASHBOARD.invoice.adminList },
          { title: 'amountList', path: PATH_DASHBOARD.invoice.amount },
          { title: 'cashHistory', path: PATH_DASHBOARD.invoice.history },
        ],
      },

      // REPORT
      {
        title: 'calculate',
        path: PATH_DASHBOARD.report.root,
        icon: ICONS.menuItem,
        children: [
          { title: 'partnerCalculate', path: PATH_DASHBOARD.report.partner },
          { title: 'partnerCalculate2', path: PATH_DASHBOARD.report.user },
          { title: 'resultByGame', path: PATH_DASHBOARD.report.game },
          { title: 'resultByDay', path: PATH_DASHBOARD.report.daily },
        ],
      },

      // CUSTOMER CENTER
      {
        title: 'customerCenter',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'manageMessage', path: PATH_DASHBOARD.customer.message },
          { title: 'manageBoard', path: PATH_DASHBOARD.customer.blog },
          { title: 'manageFaq', path: PATH_DASHBOARD.customer.faq },
          { title: 'manageNotice', path: PATH_DASHBOARD.customer.notice },
        ],
      },
      // SETTING
      {
        title: 'setting',
        path: PATH_DASHBOARD.setting.root,
        icon: ICONS.setting,
        children: [
          {
            title: 'account',
            path: PATH_DASHBOARD.setting.account.root,
            children: [
              {
                title: 'accountStatus',
                path:  PATH_DASHBOARD.setting.account.list,
              },
              {
                title: 'log',
                path:  PATH_DASHBOARD.setting.account.log,
              },
            ],
          },
          {
            title: 'company',
            path: PATH_DASHBOARD.setting.company.root,
            children: [
              {
                title: 'bank',
                path: PATH_DASHBOARD.setting.company.bank,
              },
              {
                title: 'settingOfDomain',
                path: PATH_DASHBOARD.setting.company.domain,
              },
            ],
          },
          {
            title: 'byLevelSetting',
            path: PATH_DASHBOARD.setting.level.root,
            children: [
              {
                title: 'setByLevel',
                path: PATH_DASHBOARD.setting.level.list,
              },
              {
                title: 'domainLevel',
                path: PATH_DASHBOARD.setting.level.domain,
              },
            ],
          },
          {
            title: 'siteSetting',
            path: PATH_DASHBOARD.setting.site.root,
            children: [
              {
                title: 'mainPage',
                path: PATH_DASHBOARD.setting.site.main,
              },
              {
                title: 'inspection',
                path: PATH_DASHBOARD.setting.site.history,
              },
              {
                title: 'inspectionInclude',
                path: PATH_DASHBOARD.setting.site.maintain,
              },
              {
                title: 'websiteOption',
                path: PATH_DASHBOARD.setting.site.option,
              },
            ],
          },
          {
            title: 'manageGame',
            path: PATH_DASHBOARD.setting.game.root,
            children: [
              {
                title: 'casinoSetting',
                path: PATH_DASHBOARD.setting.game.casino,
              },
              {
                title: 'slotSetting',
                path: PATH_DASHBOARD.setting.game.slot,
              },
            ],
          },
        ],
      },
      //  ADMIN
      {
        title: 'adminSetting',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.admin,
        children: [
          { title: 'operatorList', path: PATH_DASHBOARD.admin.list },
          { title: 'operatorIpControl', path: PATH_DASHBOARD.admin.ip },
        ],
      },
    ],
  },

];

export default navConfig;
