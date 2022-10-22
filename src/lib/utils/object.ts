export const makePOJO = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object));
};
