import _mock from '../_mock';
import { randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _partnerList = [...Array(24)].map((_, index) => ({
  id: _mock.name.firstName(index).concat("00" ) + index ,
  name: _mock.name.fullName(index),
  level: _mock.level(index),
  slotRolling: _mock.number.rating(index),
  slotLoosing: _mock.number.rating(index),
  moneySend: randomInArray([1, 0]),
  moneyReceive:  randomInArray([1, 0]),
  partner: _mock.number.age(index),
  user: _mock.number.count(index),
  money: _mock.number.price(index),
  point: _mock.number.rating(index),
  createPartner: randomInArray([1, 0]),
  createUser: 1,
  option: 1,
  status: randomInArray(['active', 'banned']),
  role: _mock.role(index),
}));
