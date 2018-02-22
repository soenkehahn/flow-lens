// @flow

import { get } from "./lens";

describe("getting", () => {
  it("allows to get values 1 level deep", () => {
    expect(get("foo", { foo: 42 })).toBe(42);
  });
  it("type-errors when the field doesn't exist", () => {
    //$ExpectError
    expect(get("bar", { foo: 42 })).toBe(undefined);
  });
  it("allows to get values 2 level deep");
});

describe("setting", () => {
  it("allows to set values 1 level deep");
  it("allows to set values 2 level deep");
});

describe("modifying", () => {
  it("allows to modify values 1 level deep");
  it("allows to modify values 2 level deep");
});
