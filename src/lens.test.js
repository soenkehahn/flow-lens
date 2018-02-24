// @flow

import { type Lens, mkLens, compose } from "./lens";

const foo_: Lens<{ foo: number }, number> = mkLens(
  o => o.foo,
  (o, v) => ({
    ...o,
    foo: v
  })
);

describe("getting", () => {
  it("allows to get values 1 level deep", () => {
    expect(foo_.get({ foo: 42 })).toEqual(42);
  });
  it("type-errors when the field doesn't exist", () => {
    dont(() => {
      //$ExpectError
      foo_.get({ bar: 42 });
    });
  });
  it("value type error", () => {
    dont(() => {
      //$ExpectError
      const x: string = foo_.get({ foo: 42 });
    });
  });
  it("allows to return a supertype", () => {
    const x: mixed = foo_.get({ foo: 42 });
    expect(x).toEqual(42);
  });
});

describe("setting", () => {
  it("allows to set values 1 level deep", () => {
    const x = { foo: 42 };
    expect(foo_.set(x, 23)).toEqual({ foo: 23 });
  });
  it("does not mutate the given object", () => {
    const x = { foo: 42 };
    foo_.set(x, 23);
    expect(x.foo).toEqual(42);
  });
  it("type-errors when the field doesn't exist", () => {
    dont(() => {
      //$ExpectError
      expect(foo_.set({ bar: 42 }, 23)).toEqual({ bar: 42, foo: 23 });
    });
  });
  it("value type error", () => {
    const x = { foo: 42 };
    //$ExpectError
    expect(foo_.set(x, "string")).toEqual({ foo: "string" });
  });
  it("allows to set a subtype", () => {
    const foo_: Lens<{ foo: mixed }, mixed> = mkLens(
      o => o.foo,
      (o, v) => ({ ...o, foo: v })
    );
    const x: { foo: mixed } = { foo: 42 };
    expect(foo_.set(x, "string")).toEqual({ foo: "string" });
  });
});

describe("modifying", () => {
  it("allows to modify values", () => {
    const x = { foo: 42 };
    expect(foo_.modify(x, n => n + 1)).toEqual({ foo: 43 });
  });
  it("does not mutate the given object", () => {
    const x = { foo: 42 };
    foo_.modify(x, n => n + 1);
    expect(x.foo).toEqual(42);
  });
  it("type-errors when the field doesn't exist", () => {
    //$ExpectError
    foo_.modify({ bar: 42 }, n => n + 1);
  });
  it("value type error", () => {
    const x = { foo: 42 };
    //$ExpectError
    expect(foo_.modify(x, n => "string")).toEqual({ foo: "string" });
  });
  describe("super- and subtypes", () => {
    type T = { a: number, b: number };
    type SuperT = { a: number };
    type SubT = { a: number, b: number, c: number };
    const foo_: Lens<{ foo: T }, T> = mkLens(
      o => o.foo,
      (o, v) => ({ ...o, foo: v })
    );
    it("allows to consume a supertype", () => {
      function f(x: SuperT): T {
        return { ...x, b: 13 };
      }
      const obj: { foo: T } = { foo: { a: 42, b: 23 } };
      expect(foo_.modify(obj, f)).toEqual({ foo: { a: 42, b: 13 } });
    });
    it("allows to set a subtype", () => {
      function f(x: T): SubT {
        return { ...x, c: 13 };
      }
      const obj: { foo: T } = { foo: { a: 42, b: 23 } };
      expect(foo_.modify(obj, f)).toEqual({ foo: { a: 42, b: 23, c: 13 } });
    });
    it("allows to consume a supertype and set a subtype", () => {
      function f(x: SuperT): SubT {
        return { ...x, b: 13, c: 51 };
      }
      const obj: { foo: T } = { foo: { a: 42, b: 23 } };
      expect(foo_.modify(obj, f)).toEqual({ foo: { a: 42, b: 13, c: 51 } });
    });
  });
});

describe("compose", () => {
  const foo_: Lens<{ foo: { bar: number } }, { bar: number }> = mkLens(
    o => o.foo,
    (o, v) => ({
      ...o,
      foo: v
    })
  );
  const bar_: Lens<{ bar: number }, number> = mkLens(
    o => o.bar,
    (o, v) => ({
      ...o,
      bar: v
    })
  );
  const foo_bar_ = compose(foo_, bar_);

  it("allows to get nested values", () => {
    expect(foo_bar_.get({ foo: { bar: 42 } })).toEqual(42);
  });
  it("allows to set nested values", () => {
    expect(foo_bar_.set({ foo: { bar: 42 } }, 23)).toEqual({
      foo: { bar: 23 }
    });
  });
  it(".set does not mutate any objects", () => {
    const x = { foo: { bar: 42 } };
    foo_bar_.set(x, 23);
    expect(x).toEqual({ foo: { bar: 42 } });
  });
  it("allows to modify nested values", () => {
    expect(foo_bar_.modify({ foo: { bar: 42 } }, n => n + 1)).toEqual({
      foo: { bar: 43 }
    });
  });
  it(".modify does not mutate any objects", () => {
    const x = { foo: { bar: 42 } };
    foo_bar_.modify(x, n => n + 1);
    expect(x).toEqual({ foo: { bar: 42 } });
  });
});

describe("mkLens", () => {
  it("works without type annotations");
  it("is not verbose");
  it("works for exact object types");
  it("works for classes");
});

function dont(action: () => void): void {}
