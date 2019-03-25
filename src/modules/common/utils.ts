import _ from 'lodash';

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export const isUuid = (value?: string) => {
  if (!value) {
    return false;
  }

  return uuidRegex.test(value);
};

export const fillProps = <T extends {}, TSub extends Partial<T>>(obj: T, subset: TSub, props: string[]): T => {
  const filteredSubset = _.pick(subset, props);
  return Object.assign(obj, filteredSubset);
};
