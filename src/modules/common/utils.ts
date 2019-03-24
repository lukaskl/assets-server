const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export const isUuid = (value?: string) => {
  if (!value) {
    return false;
  }

  return uuidRegex.test(value);
};
