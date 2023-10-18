import { AnyObject, Filter } from "./types";

export const debounce = <TArgs extends any[], TReturn>(
  func: (...args: TArgs) => TReturn,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function deepClone(obj: AnyObject): AnyObject {
  if (
    obj instanceof Function ||
    obj instanceof RegExp ||
    obj instanceof Date ||
    obj === null
  ) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  if (Object(obj) === obj) {
    const newObj: AnyObject = {};
    Object.keys(obj).forEach((key) => (newObj[key] = deepClone(obj[key])));
    return newObj;
  }
  return obj;
}

export const filtersToCondition = (filters: Filter[]) => {
  let condition = ``;

  for (const filter of filters) {
    if (!filter.value) continue;

    if (filter.pos !== "all") {
      if (["is", "not"].includes(filter.type)) {
        condition += `word[${Number(filter.pos) - 1}]`;

        if (filter.type === "is") {
          condition += ` =`;
        } else {
          condition += ` !`;
        }

        condition += `== "${filter.value}" && `;
      } else {
        condition += `(`;
        if (filter.type === "exclude") {
          for (const letter of filter.value) {
            condition += `word[${Number(filter.pos) - 1}] !== "${letter}" && `;
          }
        } else {
          for (const letter of filter.value) {
            condition += `word[${Number(filter.pos) - 1}] === "${letter}" || `;
          }
        }

        if (filter.value.length) {
          condition = condition.slice(0, -4);
          condition += `) && `;
        }
      }
    } else {
      if (filter.type === "exclude") {
        for (const letter of filter.value) {
          condition += `!word.includes("${letter}") && `;
        }
      } else {
        for (const letter of filter.value) {
          condition += `word.includes("${letter}") && `;
        }
      }
    }
  }

  return condition.slice(0, -4);
};
