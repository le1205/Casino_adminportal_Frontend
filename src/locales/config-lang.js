// @mui
import { enUS, koKR } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'Korean',
    value: 'kr',
    systemValue: koKR,
    icon: '/assets/icons/flags/ic_flag_kr.svg',
  },
];

export const defaultLang = allLangs[0]; // Korean
