import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import Router from "next/router";
import { logout } from "@actions";
import * as t from "@consts";

export const isAuth = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("vip-user")) {
      return JSON.parse(localStorage.getItem("vip-user"));
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getJWT = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("vip-token")) {
      return JSON.parse(localStorage.getItem("vip-token"));
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const handleServerError = (error, noRedirect) => {
  if (!error)
    return { error: `Unknown error, please report this case to us! 😥` };
  if (`${error}` === "TypeError: Failed to fetch") {
    return {
      error: `Oops! Our server is currently unresponsive or under maintenance, please try again later!`,
    };
  } else if (`${error}` === "Error: Request failed with status code 401") {
    handleResponse({ status: 401 }, noRedirect);
    return { error: "Unauthorized, please login again!" };
  } else if (`${error}` === "Error: Request failed with status code 400") {
    return { error: error.response.data.error };
  } else if (`${error}` === "Error: Request failed with status code 500") {
    return { error: `Internal Server Error` };
  } else {
    return { error: `Internal Server Error` };
  }
};

export const handleResponse = (res, noRedirect) => {
  if (res.status === 401) {
    if (!noRedirect) {
      logout(() =>
        Router.push({
          pathname: "/login",
          query: {
            message: "Your session is expire. Please sign in!",
          },
        })
      );
    }
    return "true";
  } else {
    return;
  }
};

export const handleCommonResponse = (res, options = {}) => {
  if (!res) {
    return {};
  } else {
    const {
      onRedirect = () => {},
      onError = () => {},
      onSuccess = () => {},
    } = options;

    const isRedirect = handleResponse(res) === "true";
    if (isRedirect) {
      if (onRedirect) {
        onRedirect();
      }
      return {};
    } else {
      const data = res.data;

      if (data?.error) {
        if (onError) {
          onError(data.error);
        }
        return { error: data.error };
      }
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    }
  }
};

export const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getSizeImage = async (link, callback) => {
  const data = await toDataURL(link);
  return new Promise((resolve, reject) => {
    const newImg = new window.Image();
    newImg.src = data;
    newImg.onload = function () {
      if (callback) {
        callback({
          width: this.width,
          height: this.height,
        });
        resolve();
      }
    };
  });
};

export const toDataURL = async (url) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

export const validateEmail = (email) => {
  if (!email || email.length === 0) return false;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return String(password).match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  );
};

export const isValidHttpUrl = (string, canBeEmtyOrNull = false) => {
  if (
    canBeEmtyOrNull &&
    (!string || string === "" || string === null || string === undefined)
  ) {
    return true;
  }

  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 50,
      height: 50,
    },
    children: `${name?.split(" ")?.[0]?.[0]}${name?.split(" ")?.[1]?.[0]}`,
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const convertString2Array = (str) =>
  str === "" ? [] : str.split(",").map((item) => item.trim());

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useThisToGetSizesFromRef(elRef, options = {}) {
  const [sizes, setSizes] = useState({ width: 0, height: 0 });
  const { revalidate, timeout, falseCondition } = options;

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSizes({
        width: elRef?.current?.clientWidth || 0,
        height: elRef?.current?.clientHeight || 0,
      });
    }

    window.addEventListener("resize", updateSize);

    let loop;

    if (revalidate && typeof revalidate === "number") {
      loop = setInterval(() => {
        if (
          falseCondition &&
          falseCondition({
            width: elRef?.current?.clientWidth || 0,
            height: elRef?.current?.clientHeight || 0,
          })
        ) {
          clearInterval(loop);
        }
        updateSize();
      }, [revalidate]);
      if (timeout) {
        setTimeout(() => clearInterval(loop), timeout);
      }
    }

    updateSize();

    return () => {
      window && window.removeEventListener("resize", updateSize);
      if (loop) {
        clearInterval(loop);
      }
    };
  }, [elRef]);

  return sizes;
}

export function useThisToGetPositionFromRef(elRef, options = {}) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const { revalidate, timeout, falseCondition } = options;
  const [oldWidth, setOldWidth] = useState(0);

  useIsomorphicLayoutEffect(() => {
    function updatePosition(bypass = false) {
      const { top, left, right, bottom, width, height, x, y } =
        elRef?.current?.getBoundingClientRect() || {};

      if (bypass || elRef?.current?.clientWidth !== oldWidth) {
        setPosition({ top, left, right, bottom, width, height, x, y });
        setOldWidth(elRef?.current?.clientWidth);
      }
    }

    window.addEventListener("resize", updatePosition);

    let loop;

    if (revalidate && typeof revalidate === "number") {
      loop = setInterval(() => {
        if (
          falseCondition &&
          falseCondition(elRef?.current?.getBoundingClientRect() || {})
        ) {
          clearInterval(loop);
        }
        updatePosition(true);
      }, [revalidate]);
      if (timeout) {
        setTimeout(() => clearInterval(loop), timeout);
      }
    }

    return () => {
      window && window.removeEventListener("resize", updatePosition);
      if (loop) {
        clearInterval(loop);
      }
    };
  }, [elRef]);

  return position;
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export function useDebounce(input, callback, delay = 2000) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const setTime = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      if (typeof callbackRef.current == "function") callbackRef.current();
    }, [delay]);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    setTime();
    return clear;
  }, [delay, setTime, input]);
}

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const handleDictionaryData = (firstData, vocabTypes) => {
  console.log(firstData);
  const allPronounces =
    firstData?.phonetics
      .filter((item) => item?.audio && item?.text)
      .sort((a, b) => {
        // sort by order of -us, -uk, -au in audio
        const aOrder = a?.audio?.includes("-us")
          ? 0
          : a?.audio?.includes("-uk")
          ? 1
          : 2;
        const bOrder = b?.audio?.includes("-us")
          ? 0
          : b?.audio?.includes("-uk")
          ? 1
          : 2;
        return aOrder - bOrder > 0 ? 1 : aOrder - bOrder < 0 ? -1 : 0;
      }) || [];

  const { text, audio } = allPronounces[0] || {};

  // filter out all types of word and filter some types
  const allTypes =
    firstData?.meanings
      ?.map((item) => item?.partOfSpeech)
      .filter((item) => {
        const found = vocabTypes.find((each) => each.value === item);
        const index = vocabTypes.indexOf(found);
        return index !== -1;
      }) || [];

  const altPronounce = firstData?.phonetic;

  // filter out examples by priority
  const allExamplesByType = firstData?.meanings?.filter((each) =>
    allTypes?.includes(each?.partOfSpeech)
  );

  const groupByType = groupBy(allExamplesByType, "partOfSpeech");

  const allExamplesByPriority = Object.keys(groupByType)?.map((each) => {
    return {
      type: each,
      examples: groupByType?.[each]
        ?.flat() // flat all examples
        ?.map((item) => item?.definitions)
        ?.flat() // flat all definitions
        ?.sort((a, b) => {
          // sort by priority
          const aOrder =
            (a?.definition?.length > 0 ? 0 : 1) +
            (a?.example?.length > 0 ? 0 : 1) +
            (a?.synonyms?.length > 0 ? 0 : 1);
          const bOrder =
            (b?.definition?.length > 0 ? 0 : 1) +
            (b?.example?.length > 0 ? 0 : 1) +
            (b?.synonyms?.length > 0 ? 0 : 1);
          return aOrder - bOrder > 0 ? 1 : aOrder - bOrder < 0 ? -1 : 0;
        }),
    };
  });

  const filterEmptyTypes = allExamplesByPriority?.filter(
    (each) => each?.examples?.length > 0
  );

  const highPriorityObjectByType = filterEmptyTypes?.flatMap(
    (item) => item?.examples
  );

  const highPriorityMeanings = highPriorityObjectByType
    ?.filter((each) => each?.definition?.length > 0)
    ?.map((item) => item?.definition);

  const highPriorityExamples = highPriorityObjectByType
    ?.filter((each) => each?.example?.length > 0)
    ?.map((item) => item?.example);

  const allSynonymsByType = allExamplesByPriority.map((item) => {
    const { type, examples } = item;
    const synonyms = examples
      ?.map((each) => each?.synonyms)
      .flat()
      .filter((each) => each?.length > 0);
    return { type, synonyms };
  });

  const allSynonyms = allSynonymsByType.flatMap((item) => item?.synonyms);

  const allKeyWords = highPriorityObjectByType.flatMap((item) => {
    const synonyms =
      item?.synonyms?.length > 0
        ? item.synonyms.flatMap((each) => each?.split(/[\s,]+/))
        : [];
    const definition = item?.definition || "";
    const example = item?.example || "";
    return [...synonyms, definition, example];
  });

  const allTags = [
    ...new Set(
      allKeyWords
        ?.map((i) =>
          i
            ?.replace(/[^\w\s]/gi, "")
            ?.toLowerCase()
            ?.split(/\s+/)
            ?.filter(String)
        )
        ?.flat()
    ),
  ];

  return {
    pronounce: text || altPronounce,
    audio: audio,
    clasifyVocab: [...new Set(allTypes)],
    examples: highPriorityExamples,
    engMeanings: highPriorityMeanings,
    synonyms: allSynonyms,
    tags: allTags,
  };
};

export const toggleSettings = (value, selectionValue, current, setCurrent) => {
  const currentIndex = current.findIndex((item) => item?.includes(value));
  const newChecked = [...current];

  if (currentIndex === -1) {
    newChecked.push(`${value}${selectionValue ? `/${selectionValue}` : ""}`);
  } else {
    if (!selectionValue) {
      newChecked.splice(currentIndex, 1);
    } else {
      newChecked[currentIndex] = `${value}/${selectionValue}`;
    }
  }
  setCurrent(newChecked);

  if (window) {
    localStorage.setItem("vip-settings", JSON.stringify(newChecked));
  }
};

export const getLastReviewWord = (words) => {
  if (!words.length) return null;

  let orderedWords = words
    .filter((word) => word.lastReview && !word.lastReviewOK)
    .sort((a, b) => {
      return new Date(a.lastReview) - new Date(b.lastReview);
    });

  return orderedWords[0];
};
