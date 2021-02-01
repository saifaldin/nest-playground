export const isTruthy = (value: string | boolean) => {
  if (typeof value === 'string' && value.toLowerCase() === 'false')
    return false;
  else return !!value;
};
