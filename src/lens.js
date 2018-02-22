// @flow

export const get: <Field, O: *, Value: $ElementType<O, Field>>(
  field: Field,
  object: O
) => Value = (field, object) => {
  return object[field];
};
