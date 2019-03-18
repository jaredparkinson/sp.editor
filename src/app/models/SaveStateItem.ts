import { ISaveStateItem } from './ISaveStateItem';

export class SaveStateItem<T> implements ISaveStateItem<T> {
  animated: boolean;
  value: T;
}
