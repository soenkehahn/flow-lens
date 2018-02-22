// @flow

export const get: <Field, O: *, Value: $ElementType<O, Field>>(
  Field,
  O
) => Value = (field, object) => {
  return object[field];
};

export const set: <Field, O: *, Value: $ElementType<O, Field>>(
  Field,
  O,
  Value
) => void = (field, object, value) => {
  object[field] = value;
};
