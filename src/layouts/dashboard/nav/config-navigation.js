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
          { title: 'list', path: PATH_DASHBOARD.partner.list },
          { title: 'create', path: PATH_DASHBOARD.partner.new },
          { title: 'edit', path: PATH_DASHBOARD.partner.demoEdit },
          { title: 'detail', path: PATH_DASHBOARD.partner.detail },
        ],
      },
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'create', path: PATH_DASHBOARD.user.new },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'List(According partner)', path: PATH_DASHBOARD.user.listAccordingPartner },
          { title: 'accept', path: PATH_DASHBOARD.user.accept },
          { title: 'cash movement', path: PATH_DASHBOARD.user.cash },
          { title: 'point management', path: PATH_DASHBOARD.user.point },
          { title: 'track management', path: PATH_DASHBOARD.user.track },
          { title: 'connecting user', path: PATH_DASHBOARD.user.connect },
          { title: 'rolling', path: PATH_DASHBOARD.user.rolling },
          { title: 'multi ip', path: PATH_DASHBOARD.user.multiIp },
        ],
      },

      // BET
      {
        title: 'Bet',
        path: PATH_DASHBOARD.bet.root,
        icon: ICONS.cart,
        children: [
          { title: 'total', path: PATH_DASHBOARD.bet.common },
          { title: 'casino', path: PATH_DASHBOARD.bet.casino },
          { title: 'slot', path: PATH_DASHBOARD.bet.slot },
        ],
      },

      // EGG
      {
        title: 'Egg',
        path: PATH_DASHBOARD.egg.root,
        icon: ICONS.egg,
        children: [
          { title: 'request', path: PATH_DASHBOARD.egg.request },
          { title: 'exchange', path: PATH_DASHBOARD.egg.exchange },
          { title: 'settlement', path: PATH_DASHBOARD.egg.settlement },
          { title: 'process', path: PATH_DASHBOARD.egg.process },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'in apply', path: PATH_DASHBOARD.invoice.inApply },
          { title: 'in report', path: PATH_DASHBOARD.invoice.inReport },
          { title: 'out apply', path: PATH_DASHBOARD.invoice.outApply },
          { title: 'out report', path: PATH_DASHBOARD.invoice.outReport },
          { title: 'admin list', path: PATH_DASHBOARD.invoice.adminList },
          { title: 'cash history', path: PATH_DASHBOARD.invoice.history },
        ],
      },

      // REPORT
      {
        title: 'Settlement',
        path: PATH_DASHBOARD.report.root,
        icon: ICONS.menuItem,
        children: [
          { title: 'partner list', path: PATH_DASHBOARD.report.partner },
          { title: 'user list', path: PATH_DASHBOARD.report.user },
          { title: 'game list', path: PATH_DASHBOARD.report.game },
          { title: 'daily report', path: PATH_DASHBOARD.report.daily },
        ],
      },

      // CUSTOMER CENTER
      {
        title: 'customer center',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'message', path: PATH_DASHBOARD.customer.message },
          { title: 'blog', path: PATH_DASHBOARD.customer.blog },
          { title: 'faq', path: PATH_DASHBOARD.customer.faq },
          { title: 'notice', path: PATH_DASHBOARD.customer.notice },
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
                title: 'account status',
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
                title: 'setting of domain',
                path: PATH_DASHBOARD.setting.company.domain,
              },
            ],
          },
          {
            title: 'level',
            path: PATH_DASHBOARD.setting.level.root,
            children: [
              {
                title: 'level list',
                path: PATH_DASHBOARD.setting.level.list,
              },
              {
                title: 'domain',
                path: PATH_DASHBOARD.setting.level.domain,
              },
            ],
          },
          {
            title: 'site',
            path: PATH_DASHBOARD.setting.site.root,
            children: [
              {
                title: 'main page',
                path: PATH_DASHBOARD.setting.site.main,
              },
              {
                title: 'maintain history',
                path: PATH_DASHBOARD.setting.site.history,
              },
              {
                title: 'maintain',
                path: PATH_DASHBOARD.setting.site.maintain,
              },
              {
                title: 'option',
                path: PATH_DASHBOARD.setting.site.option,
              },
            ],
          },
          {
            title: 'game',
            path: PATH_DASHBOARD.setting.game.root,
            children: [
              {
                title: 'casino',
                path: PATH_DASHBOARD.setting.game.casino,
              },
              {
                title: 'slot',
                path: PATH_DASHBOARD.setting.game.slot,
              },
            ],
          },
        ],
      },
      //  ADMIN
      {
        title: 'Admin Environment',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.admin,
        children: [
          { title: 'admin list', path: PATH_DASHBOARD.admin.list },
          { title: 'ip list', path: PATH_DASHBOARD.admin.ip },
        ],
      },
    ],
  },

];

export default navConfig;
