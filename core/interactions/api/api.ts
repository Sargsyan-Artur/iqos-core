import { Matchers } from './matchers';
import { Actions } from './actions';
import { memory } from '../../utils/memory';

memory.config({ overwrite: true });

class Api {
  /* eslint-disable class-methods-use-this */
  public get matchers(): Matchers {
    return new Matchers();
  }

  public get actions(): Actions {
    return new Actions();
  }
}

export default new Api();
