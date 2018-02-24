// @flow

export type Lens<Obj, A> = {|
  get: Obj => A,
  set: (Obj, A) => Obj,
  modify: (Obj, (A) => A) => Obj
|};

export function mkLens<O, A>(get: O => A, set: (O, A) => O): Lens<O, A> {
  return {
    get: get,
    set: set,
    modify: (obj, f) => set(obj, f(get(obj)))
  };
}

export function compose<A, B, C>(x_: Lens<A, B>, y_: Lens<B, C>): Lens<A, C> {
  return {
    get: obj => y_.get(x_.get(obj)),
    set: (obj, value) => x_.modify(obj, inner => y_.set(inner, value)),
    modify: (obj, f) => x_.modify(obj, inner => y_.modify(inner, f))
  };
}
