// @flow

export type Lens<Obj, Value> = {|
  get: Obj => Value,
  set: (Obj, Value) => Obj,
  modify: (Obj, (Value) => Value) => Obj
|};

export function mkLens<Obj, Value>(
  get: Obj => Value,
  set: (Obj, Value) => Obj
): Lens<Obj, Value> {
  return {
    get: get,
    set: set,
    modify: (obj, f) => set(obj, f(get(obj)))
  };
}

export function compose<A, B, C>(x_: Lens<A, B>, y_: Lens<B, C>): Lens<A, C> {
  return {
    get: obj => y_.get(x_.get(obj)),
    set: (obj, value) => x_.modify(obj, middle => y_.set(middle, value)),
    modify: (obj, f) => x_.modify(obj, middle => y_.modify(middle, f))
  };
}

class ShortCut {}

const invalidErrorMessage =
  "invalid lens: use the passed in function on the inner type!";

export function lens<Obj, Value>(
  modify: (Obj, (Value) => Value) => Obj
): Lens<Obj, Value> {
  return mkLens(
    obj => {
      let result: ?Value = null;
      try {
        modify(obj, value => {
          result = value;
          throw new ShortCut();
        });
      } catch (e) {
        if (e instanceof ShortCut) {
        } else {
          throw e;
        }
      }
      if (result) {
        return result;
      }
      throw new Error(invalidErrorMessage);
    },
    (obj, value) => {
      let ran = false;
      const result = modify(obj, _ => {
        ran = true;
        return value;
      });
      if (!ran) {
        throw new Error(invalidErrorMessage);
      }
      return result;
    }
  );
}
