import { authCheck } from '@/Decorators/authCheck';

@authCheck
export default class Reaction {
  constructor() {
    console.log('Reaction constructor');
  }
}
