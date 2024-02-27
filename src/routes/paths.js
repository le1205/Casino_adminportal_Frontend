// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  partner: {
    root: path(ROOTS_DASHBOARD, '/partner'),
    new: path(ROOTS_DASHBOARD, '/partner/new'),
    list: path(ROOTS_DASHBOARD, '/partner/list'),
    detail: path(ROOTS_DASHBOARD, '/partner/detail'),
    edit: (name) => path(ROOTS_DASHBOARD, `/partner/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/partnerer/reece-chung/edit`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    listAccordingPartner: path(ROOTS_DASHBOARD, '/user/partner-list'),
    accept: path(ROOTS_DASHBOARD, '/user/accept'),
    cash: path(ROOTS_DASHBOARD, '/user/cash'),
    point: path(ROOTS_DASHBOARD, '/user/point'),
    track: path(ROOTS_DASHBOARD, '/user/track'),
    connect: path(ROOTS_DASHBOARD, '/user/connect'),
    rolling: path(ROOTS_DASHBOARD, '/user/rolling'),
    multiIp: path(ROOTS_DASHBOARD, '/user/multi-ip'),
  },
  bet: {
    root: path(ROOTS_DASHBOARD, '/bet'),
    common: path(ROOTS_DASHBOARD, '/bet/common'),
    casino: path(ROOTS_DASHBOARD, '/bet/casino'),
    slot: path(ROOTS_DASHBOARD, '/bet/slot'),
  },
  egg: {
    root: path(ROOTS_DASHBOARD, '/egg'),
    request: path(ROOTS_DASHBOARD, '/egg/request'),
    exchange: path(ROOTS_DASHBOARD, '/egg/exchange'),
    settlement: path(ROOTS_DASHBOARD, '/egg/settlement'),
    process: path(ROOTS_DASHBOARD, '/egg/process'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    inApply: path(ROOTS_DASHBOARD, '/invoice/in-apply'),
    inReport: path(ROOTS_DASHBOARD, '/invoice/in-report'),
    outApply: path(ROOTS_DASHBOARD, '/invoice/out-apply'),
    outReport: path(ROOTS_DASHBOARD, '/invoice/out-report'),
    adminList: path(ROOTS_DASHBOARD, '/invoice/admin-list'),
    amount: path(ROOTS_DASHBOARD, '/invoice/amount'),
    history: path(ROOTS_DASHBOARD, '/invoice/history'),
  },
  report: {
    root: path(ROOTS_DASHBOARD, '/report'),
    partner: path(ROOTS_DASHBOARD, '/report/partner'),
    user: path(ROOTS_DASHBOARD, '/report/user'),
    game: path(ROOTS_DASHBOARD, '/report/game'),
    daily: path(ROOTS_DASHBOARD, '/report/daily'),
  },
  customer: {
    root: path(ROOTS_DASHBOARD, '/customer'),
    message: path(ROOTS_DASHBOARD, '/customer/message'),
    blog: path(ROOTS_DASHBOARD, '/customer/blog'),
    faq: path(ROOTS_DASHBOARD, '/customer/faq'),
    notice: path(ROOTS_DASHBOARD, '/customer/notice'),
  },
  setting: {
    root: path(ROOTS_DASHBOARD, '/setting'),
    account: {
      root: path(ROOTS_DASHBOARD, '/setting/account'),
      list: path(ROOTS_DASHBOARD, '/setting/account/list'),
      log: path(ROOTS_DASHBOARD, '/setting/account/log'),
    },
    company: {
      root:  path(ROOTS_DASHBOARD, '/setting/company'),
      bank: path(ROOTS_DASHBOARD, '/setting/company/bank'),
      domain: path(ROOTS_DASHBOARD, '/setting/company/domain'),
    },
    level: {
      root:  path(ROOTS_DASHBOARD, '/setting/level'),
      list: path(ROOTS_DASHBOARD, '/setting/level/list'),
      domain: path(ROOTS_DASHBOARD, '/setting/level/domain'),
    },
    site: {
      root:  path(ROOTS_DASHBOARD, '/setting/site'),
      main: path(ROOTS_DASHBOARD, '/setting/site/main'),
      history: path(ROOTS_DASHBOARD, '/setting/site/history'),
      maintain: path(ROOTS_DASHBOARD, '/setting/site/maintain'),
      option: path(ROOTS_DASHBOARD, '/setting/site/option'),
    },
    game: {
      root:  path(ROOTS_DASHBOARD, '/setting/game'),
      casino: path(ROOTS_DASHBOARD, '/setting/game/casino'),
      slot: path(ROOTS_DASHBOARD, '/setting/game/slot'),
    },
  },
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    list: path(ROOTS_DASHBOARD, '/admin/list'),
    ip: path(ROOTS_DASHBOARD, '/admin/ip'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};


