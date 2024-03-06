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

const navAgentConfig = [

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'member',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'createMember', path: PATH_DASHBOARD.user.new },
          { title: 'memberList', path: PATH_DASHBOARD.user.list },
          { title: 'loggedInMember', path: PATH_DASHBOARD.user.connect },
        ],
      },

      // BET
      {
        title: 'bettingList',
        path: PATH_DASHBOARD.bet.root,
        icon: ICONS.cart,
        children: [
          { title: 'slotGameList', path: PATH_DASHBOARD.bet.slot },
        ],
      },

      // INVOICE
      {
        title: 'depositWithdraw',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'depositList', path: PATH_DASHBOARD.invoice.inReport },
          { title: 'withdrawList', path: PATH_DASHBOARD.invoice.outReport },
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
          { title: 'resultByDay', path: PATH_DASHBOARD.report.daily },
        ],
      },
    ],
  },

];

export default navAgentConfig;
