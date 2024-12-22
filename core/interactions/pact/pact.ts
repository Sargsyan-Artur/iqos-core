import { Actions } from './actions';
import { memory } from '../../utils/memory';

memory.config({ overwrite: true });

class Pact {
  // eslint-disable-next-line class-methods-use-this
  public get actions(): Actions {
    return new Actions();
  }
}

export default new Pact();
