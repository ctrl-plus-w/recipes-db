import { Dispatch, SetStateAction } from 'react';

/**
 * Switch the value of a state if its id is present in the list of values, otherwise add it to the list.
 * @param values The values.
 * @param setValues The values setter.
 */
export const switchIsValue = (values: string[], setValues: Dispatch<SetStateAction<string[]>>) => {
  return <T extends { id: string }>(element: T) => {
    return () => {
      const id = element.id;

      if (values.includes(id)) setValues((ids) => ids.filter((_id) => _id !== id));
      else setValues((ids) => [...ids, id]);
    };
  };
};
