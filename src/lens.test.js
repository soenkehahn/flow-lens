// @flow

import { get, set } from "./lens";

describe("getting", () => {
  it("allows to get values 1 level deep", () => {
    expect(get("foo", { foo: 42 })).toBe(42);
  });
  it("type-errors when the field doesn't exist", () => {
    //$ExpectError
    expect(get("bar", { foo: 42 })).toBe(undefined);
  });
  it("value type error");
  it("allows to return a supertype");
  it("allows to get values 2 level deep");
  it("works for exact types");
});

describe("setting", () => {
  it("allows to set values 1 level deep", () => {
    const x = { foo: 42 };
    set("foo", x, 23);
    expect(x).toEqual({ foo: 23 });
  });
  it("type-errors when the field doesn't exist", () => {
    //$ExpectError
    set("bar", { foo: 42 }, 23);
  });
  it("value type error");
  it("allows to set a subtype");
  it("allows to set values 2 level deep");
  it("works for exact types");
});

describe("modifying", () => {
  it("allows to modify values 1 level deep");
  it("allows to modify values 2 level deep");
});
