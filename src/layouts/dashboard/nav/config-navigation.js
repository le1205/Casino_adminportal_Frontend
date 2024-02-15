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
          { title: 'partner list', path: PATH_DASHBOARD.partner.list },
          { title: 'partner create', path: PATH_DASHBOARD.partner.new },
          { title: 'partner detail', path: PATH_DASHBOARD.partner.demoEdit },
          { title: 'partner setting', path: PATH_DASHBOARD.partner.detail },
        ],
      },
      // USER
      {
        title: 'member',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'create member', path: PATH_DASHBOARD.user.new },
          { title: 'member list', path: PATH_DASHBOARD.user.list },
          { title: 'member list (Ptn)', path: PATH_DASHBOARD.user.listAccordingPartner },
          { title: 'member approbal', path: PATH_DASHBOARD.user.accept },
          { title: 'money transaction list', path: PATH_DASHBOARD.user.cash },
          { title: 'manage point', path: PATH_DASHBOARD.user.point },
          { title: 'user tracking', path: PATH_DASHBOARD.user.track },
          { title: 'logged in member', path: PATH_DASHBOARD.user.connect },
          { title: 'mamnage rolling rate', path: PATH_DASHBOARD.user.rolling },
          { title: 'multi ip list', path: PATH_DASHBOARD.user.multiIp },
        ],
      },

      // BET
      {
        title: 'betting list',
        path: PATH_DASHBOARD.bet.root,
        icon: ICONS.cart,
        children: [
          { title: 'total bet list', path: PATH_DASHBOARD.bet.common },
          { title: 'casino game list', path: PATH_DASHBOARD.bet.casino },
          { title: 'slot game list', path: PATH_DASHBOARD.bet.slot },
        ],
      },

      // EGG
      {
        title: 'PT',
        path: PATH_DASHBOARD.egg.root,
        icon: ICONS.egg,
        children: [
          { title: 'PT deposit list', path: PATH_DASHBOARD.egg.request },
          { title: 'PT withdrawal list', path: PATH_DASHBOARD.egg.exchange },
          { title: 'credit sum', path: PATH_DASHBOARD.egg.settlement },
          { title: 'credit save list', path: PATH_DASHBOARD.egg.process },
        ],
      },

      // INVOICE
      {
        title: 'deposit & withdraw',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'deposit', path: PATH_DASHBOARD.invoice.inApply },
          { title: 'deposit list', path: PATH_DASHBOARD.invoice.inReport },
          { title: 'withdraw', path: PATH_DASHBOARD.invoice.outApply },
          { title: 'withdraw list', path: PATH_DASHBOARD.invoice.outReport },
          { title: 'operator transaction', path: PATH_DASHBOARD.invoice.adminList },
          { title: 'cash history', path: PATH_DASHBOARD.invoice.history },
        ],
      },

      // REPORT
      {
        title: 'Calculate',
        path: PATH_DASHBOARD.report.root,
        icon: ICONS.menuItem,
        children: [
          { title: 'partner calculate', path: PATH_DASHBOARD.report.partner },
          { title: 'partner calculate2', path: PATH_DASHBOARD.report.user },
          { title: 'result by game', path: PATH_DASHBOARD.report.game },
          { title: 'result by day', path: PATH_DASHBOARD.report.daily },
        ],
      },

      // CUSTOMER CENTER
      {
        title: 'customer center',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'manage message', path: PATH_DASHBOARD.customer.message },
          { title: 'manage board', path: PATH_DASHBOARD.customer.blog },
          { title: 'manage fag', path: PATH_DASHBOARD.customer.faq },
          { title: 'manage notice', path: PATH_DASHBOARD.customer.notice },
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
            title: 'by level setting',
            path: PATH_DASHBOARD.setting.level.root,
            children: [
              {
                title: 'set by level',
                path: PATH_DASHBOARD.setting.level.list,
              },
              {
                title: 'domain level',
                path: PATH_DASHBOARD.setting.level.domain,
              },
            ],
          },
          {
            title: 'site setting',
            path: PATH_DASHBOARD.setting.site.root,
            children: [
              {
                title: 'main page',
                path: PATH_DASHBOARD.setting.site.main,
              },
              {
                title: 'inspection',
                path: PATH_DASHBOARD.setting.site.history,
              },
              {
                title: 'inspection include',
                path: PATH_DASHBOARD.setting.site.maintain,
              },
              {
                title: 'website option',
                path: PATH_DASHBOARD.setting.site.option,
              },
            ],
          },
          {
            title: 'manage game',
            path: PATH_DASHBOARD.setting.game.root,
            children: [
              {
                title: 'casino setting',
                path: PATH_DASHBOARD.setting.game.casino,
              },
              {
                title: 'slot setting',
                path: PATH_DASHBOARD.setting.game.slot,
              },
            ],
          },
        ],
      },
      //  ADMIN
      {
        title: 'Admin Setting',
        path: PATH_DASHBOARD.admin.root,
        icon: ICONS.admin,
        children: [
          { title: 'operator list', path: PATH_DASHBOARD.admin.list },
          { title: 'operator ip control', path: PATH_DASHBOARD.admin.ip },
        ],
      },
    ],
  },

];

export default navConfig;
