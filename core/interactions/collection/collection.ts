import { Actions } from './actions';
import { ICollectionConfig } from '../../interfaces/element';
import { Expects } from './expects';
import { CollectionHandler } from './collection.handler';

export class Collection extends CollectionHandler {
  public actions: Actions;

  public expects: Expects;

  constructor(collectionConfigOrPwLocator: ICollectionConfig) {
    super(collectionConfigOrPwLocator);
    this.actions = new Actions(this.collection);
    this.expects = new Expects(this.collection);
  }

  static init(locator: string): Collection {
    return new Collection({ locator });
  }
}
