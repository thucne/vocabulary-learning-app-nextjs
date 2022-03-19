import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
    useRef,
} from "react";
import Router from "next/router";
import { logout, updateSettings } from "@actions";
import { RECAPTCHA, API } from '@config';

import _ from 'lodash';
import moment from 'moment';
import { NO_PHOTO, NO_PHOTO_SEO } from "@consts";
import qs from 'qs';

import { encode } from "blurhash";

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
            onRedirect = () => { },
            onError = () => { },
            onSuccess = () => { },
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
    return await new Promise((resolve, reject) => {
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
    const { revalidate, timeout, falseCondition, terminalCondition } = options;

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
                const temp = {
                    width: elRef?.current?.clientWidth || 0,
                    height: elRef?.current?.clientHeight || 0,
                };

                if (falseCondition && falseCondition(temp)) {
                    return;
                }
                updateSize();

                if (terminalCondition && terminalCondition(temp)) {
                    clearInterval(loop);
                }
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
    const { revalidate, timeout, falseCondition, terminalCondition } = options;
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
                const temp = elRef?.current?.getBoundingClientRect() || {};

                if (falseCondition && falseCondition(temp)) {
                    return;
                }

                updatePosition(true);

                if (terminalCondition && terminalCondition(temp)) {
                    clearInterval(loop);
                }
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

export const groupBy = function (xs, key) {
    return xs?.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || [])?.push(x);
        return rv;
    }, {});
};

export const handleDictionaryData = (
    firstData,
    vocabTypes,
    settings = defaultSettings,
    originalWord = "",
) => {
    const camAudio = generateAudioLink(originalWord);
    const oxfordAudio = generateOxfordAudioLink(originalWord);

    const allPronounces =
        firstData?.phonetics
            ?.filter((item) => item?.audio && item?.text)
            ?.sort((a, b) => {
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
            ?.filter((item) => {
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
    ].filter((item) => item?.length >= 3);

    const { autoFill, examples, english } = settings;

    if (!autoFill) {
        return {
            pronounce: text || altPronounce,
            audio: `${camAudio}<vip>${oxfordAudio}<vip>${audio}`,
            clasifyVocab: [...new Set(allTypes)],
            synonyms: allSynonyms,
        };
    } else {
        const filteredExamples =
            examples === 0
                ? undefined
                : examples === 100
                    ? highPriorityExamples
                    : highPriorityExamples?.slice(0, examples);

        const filteredMeanings =
            english === 0
                ? undefined
                : english === 100
                    ? highPriorityMeanings
                    : highPriorityMeanings?.slice(0, english);

        return {
            pronounce: text || altPronounce,
            audio: camAudio ? `${camAudio}<vip>${audio}` : audio,
            clasifyVocab: [...new Set(allTypes)],
            examples: filteredExamples,
            engMeanings: filteredMeanings,
            synonyms: allSynonyms,
        };
    }
};

export const toggleSettings = async (value, selectionValue, current, updateFunction) => {
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

    if (updateFunction && typeof updateFunction === "function") {
        updateFunction(newChecked);
    }
};

export const resetSettings = async () => {
    if (window && JSON.parse(localStorage.getItem("vip-user"))?.id) {
        await window.grecaptcha.ready(async function () {
            await window.grecaptcha
                .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                .then(async function (token) {
                    const formData = new FormData();
                    let prepareObject = {
                        token,
                        settings: [],
                    }
                    formData.append("data", JSON.stringify(prepareObject));
                    await updateSettings(JSON.parse(localStorage.getItem("vip-user"))?.id, formData);
                });
        });
    }
}

export const getLastReviewWord = (words) => {
    if (!words.length) return null;

    let orderedWords = words.splice(0, 10);

    return orderedWords;
};

export const useSettings = (userData, raw = false) => {
    const settings = userData?.settings || [];

    let response = {};

    if (!raw) {
        if (settings?.length) {
            Array.from([...settings]).forEach((item) => {
                const [value, selectionValue] = item.includes("/")
                    ? item.split("/")
                    : [item, true];
                response[value] = convertSettingsValue(selectionValue);
            });

            return { ...defaultSettings, ...response };
        }

        return { ...defaultSettings };
    } else {
        return settings || [];
    }
};

export const defaultSettings = {
    autoFill: true,
    examples: 1,
    english: 1,
    tags: 10,
    publicWords: true,
    wordsPerPractice: 20,
    practicesPerDay: 1,
    lastReview: 1,
    lastReviewOK: 5,
    lastPractice: "",
    objectFit: "contain"
};

const convertSettingsValue = (value) => {
    if (isNumeric(value)) {
        return Number(value);
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
};

function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
}

const generateAudioLink = (words) => {

    if (words?.length) {
        const firstChar = words[0].toLowerCase();
        // get first 3 chars and replace the empty space with _
        let firstThreeChars = words.toLowerCase().substring(0, 3);
        firstThreeChars = firstThreeChars.length < 3
            ? firstThreeChars + "_".repeat(3 - firstThreeChars.length)
            : firstThreeChars;

        // get first 5 chars and replace the empty space with _
        let firstFiveChars = words.toLowerCase().substring(0, 5).replace(/\s/g, "_");
        firstFiveChars = firstFiveChars.length < 5
            ? firstFiveChars + "_".repeat(5 - firstFiveChars.length)
            : firstFiveChars;

        //get first 3 characters of words and add _ if it is not enough

        const filesLink = `${firstChar}/${firstThreeChars}/${firstFiveChars}/${words}.mp3`;

        return `https://dictionary.cambridge.org/vi/media/english/us_pron/${filesLink}`;
    } else {
        return "";
    }
}

const generateAudioLinkOxford = (words) => {

    if (words?.length) {
        const firstChar = words[0].toLowerCase();
        // get first 3 chars and replace the empty space with _
        let firstThreeChars = words.toLowerCase().substring(0, 3);
        firstThreeChars = firstThreeChars.length < 3
            ? firstThreeChars + "_".repeat(3 - firstThreeChars.length)
            : firstThreeChars;

        // get first 5 chars and replace the empty space with _
        let firstFiveChars = words.toLowerCase().substring(0, 5).replace(/\s/g, "_");
        firstFiveChars = firstFiveChars.length < 5
            ? firstFiveChars + "_".repeat(5 - firstFiveChars.length)
            : firstFiveChars;

        //get first 3 characters of words and add _ if it is not enough

        const filesLink = `${firstChar}/${firstThreeChars}/${firstFiveChars}/${words}__us_1.mp3`;

        return `https://www.oxfordlearnersdictionaries.com/media/english/us_pron/${filesLink}`;
    } else {
        return "";
    }
}

export const getAudioUrl = async (raw, callback) => {
    if (raw) {
        const links = raw.split("<vip>");

        checkIfAudioIsValid(links[0], (isValid) => {
            if (isValid) {
                callback(links[0]);
            } else {
                checkIfAudioIsValid(links[1], (isValid) => {
                    if (isValid) {
                        callback(links[1]);
                    } else {
                        callback("");
                    }
                })
            }
        });

    } else {
        callback("");
    }
}

export const checkIfAudioIsValid = async (link, callback) => {
    if (isValidHttpUrl(link)) {
        let newSound = new Audio(link);
        newSound.onerror = () => callback(false);
        newSound.oncanplaythrough = () => callback(true);
    } else {
        return false;
    }
}

export const checkPractiseStatus = (userData) => {
    const allVips = userData?.vips || [];

    if (allVips?.length) {

        // find all words that has lastReview in the 24 hours ago
        const recentlyReviewedWords = allVips?.filter((item) => {
            const lastReviewDate = new Date(item?.lastReview);
            const now = new Date();
            const diff = now - lastReviewDate;
            return diff <= 86400000;
        });

        // check if there is many times of pratices by groupby lastReview value
        const groupByLastReview = _.groupBy(recentlyReviewedWords, _.property('lastReview'));

        // number of practices
        const variants = Object.keys(groupByLastReview)?.length || 0;

        return variants;

    } else {
        return 0;
    }
}

export const getOptimizedPraticeSet = (wordList = [], settings) => {

    const { lastReview: lastReviewFactor = 1, lastReviewOK: lastReviewOKFactor = 5, wordsPerPractice = 20 } = settings;

    if (wordList?.length) {
        let evidences = [];

        const sortedWordList = wordList.sort((a, b) => {
            const aLastReview = a?.lastReview;
            const bLastReview = b?.lastReview;

            const aLastReviewDate = aLastReview ? new Date(aLastReview) : new Date('01/01/1970');
            const bLastReviewDate = bLastReview ? new Date(bLastReview) : new Date('01/01/1970');

            const aTimePriority = aLastReviewDate < bLastReviewDate ? 1 : 0;
            const bTimePriority = aLastReviewDate > bLastReviewDate ? 1 : 0;

            const aLastReviewOKPriority = a?.lastReviewOK === true ? 0 : 1;
            const bLastReviewOKPriority = b?.lastReviewOK === true ? 0 : 1;

            const aPriority = -(aTimePriority * lastReviewFactor + aLastReviewOKPriority * lastReviewOKFactor);
            const bPriority = -(bTimePriority * lastReviewFactor + bLastReviewOKPriority * lastReviewOKFactor);

            evidences.push([
                {
                    id: a?.id,
                    vip: a?.vip,
                    lastReview: moment(aLastReviewDate).fromNow(),
                    lastReviewOK: a?.lastReviewOK,
                },
                {
                    id: b?.id,
                    vip: b?.vip,
                    lastReview: moment(bLastReviewDate).fromNow(),
                    lastReviewOK: b?.lastReviewOK,
                },
                {
                    lastReviewFactor,
                    lastReviewOKFactor,
                    aPriority,
                    bPriority,
                    result: aPriority - bPriority > 0 ? 1 : (aPriority - bPriority < 0 ? -1 : 0)
                }
            ])

            return aPriority - bPriority > 0 ? 1 : (aPriority - bPriority < 0 ? -1 : 0);

        }).slice(0, wordsPerPractice);

        return sortedWordList;
    } else {
        return [];
    }
}


export const getIllustrationsList = (userData = {}) => {
    if (!userData?.vips?.length) return [];

    let wordList = [...userData.vips];

    const illustration = wordList.filter((item) => item.illustration)
        .map(item => ({ ...item.illustration, word: item.vip, public: item.public, vipId: item.id }));

    return illustration;
}

export const getAllImageFormats = image => {

    if (_.isEmpty(image?.formats)) return {};

    let opens = {};

    const arrayOrder = ['origin', 'large', 'medium', 'small', 'thumbnail'];

    const formatArrays = Object.entries(image.formats).sort((a, b) => arrayOrder.indexOf(a[0]) - arrayOrder.indexOf(b[0]));

    formatArrays.map((item, index) => {
        opens[item[0]] = index == 0 ? true : false
    })

    return { formatArrays, opens };
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const shortenLink = (link, maxLength) => {

    if (isValidHttpUrl(link)) {
        const generatedURL = new URL(link);

        // get first n chars of the last pathname
        const pathname = generatedURL.pathname;
        const pathnameChars = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
        const firstNChars = pathnameChars.split("_")?.[0].slice(0, maxLength);

        // make link pretty
        const prettyLink = generatedURL.origin + "/.../" + firstNChars + "...";

        return prettyLink;
    } else {
        return "URL is not valid";
    }

}

export function getPastelColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)'
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getWordList = (userData, set = 0, limit = 8,) => {
    if (!userData?.vips?.length) return [];

    let tempt = [...userData.vips]

    let skip = set * limit;
    let sliced = tempt.slice(skip, skip + limit)

    // modify createdAt for more flexible
    mockCreatedAt(sliced)

    return sliced
}

export const mockCreatedAt = (wordList) => {
    wordList.map((item, index) => {
        wordList[index].createdAt = generateRandomDate()
    })
}

export const generateRandomDate = () => {
    // random day from last month
    let randomPastDay = Math.floor(Math.random() * 30)

    let now = new Date()
    let past = new Date(now.getTime() - randomPastDay * 24 * 60 * 60 * 1000)

    return past.toISOString()
}

export const gruopWordByDatePeriod = wordList => {
    // sort by date
    wordList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // calculate days from now
    wordList.map((item, index) => (
        wordList[index] = {
            ...item,
            fromNow: moment({ hours: 0 }).diff(item.createdAt, 'days'),
            checked: false
        }
    ))

    const dateLabels = [
        {
            date: 'lastYear',
            range: [31, 365]
        },
        {
            date: "lastMonth",
            range: [8, 30]
        },
        {
            date: "lastWeek",
            range: [2, 8]
        },
        {
            date: "yesterday",
            range: [1, 2]
        },
        {
            date: "today",
            range: [0, 1],
        },
    ]

    let processedData = []

    // group word by date dateLabels
    dateLabels.map((item, index) => {
        let temp = wordList.filter(word => {
            return word.fromNow < item.range[1] && word.fromNow >= item.range[0]
        })
        if (temp.length) {
            processedData.push({
                date: item.date,
                data: [...temp]
            })
        }
    })

    return processedData
}

export const deepExtractObjectStrapi = (object = {}, options = {}) => {

    if (_.isObject(object) && !_.isEmpty(object)) {
        const {
            minify,
            minifyFields = [],
            minifyPhoto = [],
            allowNullPhoto = false
        } = options;

        if (!_.isArray(object)) {

            // flatten strapi object
            if (Object.keys(object).includes('data') && _.isNull(object?.data)) {
                return null;
            }

            if (Object.keys(object).includes('data') && _.isObject(object?.data)) {
                object = object.data
            }

            if (_.isArray(object)) {
                return object.map(item => deepExtractObjectStrapi(item, options))
            }

            const allKeys = Object.keys(object);

            if (_.isEqual(allKeys, ['id', 'attributes'])) {
                return { id: object.id, ...deepExtractObjectStrapi(object.attributes, options) };
            } else {

                // check if each key is an Strapi object - includes "data", "id" or "attributes"
                const strapiArrays = allKeys.filter(key => {
                    return object[key]?.data;
                }).map(key => {
                    const data = object[key]?.data;
                    return {
                        [key]: data && data.length
                            ? data.map(i => deepExtractObjectStrapi(i, options))
                            : deepExtractObjectStrapi(data, options)
                    }
                });


                const nullData = allKeys.filter(key => {
                    return _.isObject(object[key]?.data) && _.isEmpty(object[key]?.data);
                }).map(key => ({ [key]: null }));

                const photoData = allKeys.filter(key => {
                    return minifyPhoto?.length ? minifyPhoto.includes(key) : false;
                }).map(key => {
                    const temp = object[key]?.data?.attributes;
                    const photo = temp?.formats?.small?.url || temp?.formats?.medium?.url || temp?.formats?.large?.url || temp?.url;
                    return { [key]: photo || (allowNullPhoto ? null : NO_PHOTO_SEO) }
                })

                // convert to object
                const strapiObject = _.merge({}, ...strapiArrays);
                const nullObject = _.merge({}, ...nullData);
                const photoObject = _.merge({}, ...photoData);

                const returnObject = { ...object, ...strapiObject, ...nullObject, ...photoObject };

                return minify ? _.omit(returnObject, minifyFields ? minifyFields : ['createdAt', 'updatedAt']) : returnObject;
            }
        } else {
            return object.map(item => deepExtractObjectStrapi(item, options));
        }
    } else {
        return null;
    }

}

export const sortRelatedVips = (vip, relatedVips) => {

    const vipTags = _.isArray(vip?.tags) && !_.isEmpty(vip?.tags) ? vip.tags.flatMap(item => item.name) : [];
    const vipType2 = _.isArray(vip?.type2) && !_.isEmpty(vip?.type2) ? vip.type2.flatMap(item => item.name) : [];
    const vipType1 = vip?.type1;
    const vipSynonyms = vip?.synonyms;

    // sort related vips

    const evidences = [];

    const sortedRelatedVips = _.isArray(relatedVips) ? relatedVips.sort((a, b) => {
        const aTags = _.isArray(a?.tags) && !_.isEmpty(a?.tags) ? a.tags.flatMap(item => item.name) : null;
        const aType2 = _.isArray(a?.type2) && !_.isEmpty(a?.type2) ? a.type2?.flatMap(item => item.name) : null;
        const aType1 = a?.type1;
        const aSynonyms = a?.synonyms;

        const bTags = _.isArray(b?.tags) && !_.isEmpty(b?.tags) ? b.tags.flatMap(item => item.name) : null;
        const bType2 = _.isArray(b?.type2) && !_.isEmpty(b?.type2) ? b.type2.flatMap(item => item.name) : null;
        const bType1 = b?.type1;
        const bSynonyms = b?.synonyms;

        const aTagsIntersection = _.intersection(aTags, vipTags);
        const aType2Intersection = _.intersection(aType2, vipType2);
        const aType1Intersection = !_.isEmpty(aType1) && !_.isEmpty(vipType1) ? (aType1 === vipType1 ? 1 : 0) : 0;
        const aSynonymsIntersection = !_.isEmpty(aSynonyms) && !_.isEmpty(vipSynonyms) ? (aSynonyms === vipSynonyms ? 1 : 0) : 0;

        const bTagsIntersection = _.intersection(bTags, vipTags);
        const bType2Intersection = _.intersection(bType2, vipType2);
        const bType1Intersection = !_.isEmpty(bType1) && !_.isEmpty(vipType1) ? (bType1 === vipType1 ? 1 : 0) : 0;
        const bSynonymsIntersection = !_.isEmpty(bSynonyms) && !_.isEmpty(vipSynonyms) ? (bSynonyms === vipSynonyms ? 1 : 0) : 0;

        const aVipIntersection = a?.vip === vip?.vip ? 1 : 0;
        const bVipIntersection = b?.vip === vip?.vip ? 1 : 0;

        const aPriority = -(aTagsIntersection.length + aType2Intersection.length * 0.1 + aType1Intersection * 0.2 + aSynonymsIntersection * 2 + aVipIntersection * 2.1);
        const bPriority = -(bTagsIntersection.length + bType2Intersection.length * 0.1 + bType1Intersection * 0.2 + bSynonymsIntersection * 2 + bVipIntersection * 2.1);

        if (!evidences.find(item => item?.id === a?.id)) {
            evidences.push({
                id: a?.id, priority: aPriority, details: {
                    aTagsIntersection,
                    aType2Intersection,
                    aType1Intersection,
                    aSynonymsIntersection,
                    aTags,
                    aType2
                }
            });
        }

        if (!evidences.find(item => item?.id === b?.id)) {
            evidences.push({
                id: b?.id, priority: bPriority, details: {
                    bTagsIntersection,
                    bType2Intersection,
                    bType1Intersection,
                    bSynonymsIntersection,
                    bTags,
                    bType2
                }
            });
        }

        return aPriority - bPriority > 0 ? 1 : (aPriority - bPriority < 0 ? -1 : 0);
    }) : [];

    return sortedRelatedVips.map(item => ({
        ...item,
        priority: evidences.find(ev => ev.id === item.id)?.priority,
        details: evidences.find(ev => ev.id === item.id)?.details
    }));
}

export const generateVipLink = (status, vip, id) => {
    return status ? `/word/public/${vip}/${id}` : `/word/${vip}/${id}`
}

export const getNRelatedVips = async (matchedVip, n = 6, random = false) => {
    const querySearchRelated = {
        populate: '*',
        filters: {
            id: {
                $ne: matchedVip?.id,
            }
        },
        pagination: {
            page: 1,
            pageSize: 1000
        }
    }

    const allVips = await fetch(`${API}/api/vips?${qs.stringify(querySearchRelated, { encodeValuesOnly: true })}`);
    const relatedVips = (await allVips.json())?.data;

    const formattedRelatedVips = relatedVips
        .map(item => deepExtractObjectStrapi(item, {
            minify: true,
            minifyFields: ['lastReview', 'lastReviewOK', 'antonyms', 'audio', 'createdAt', 'updatedAt'],
            minifyPhoto: ['illustration']
        }));

    const sortedRelatedVips = sortRelatedVips(matchedVip, formattedRelatedVips);

    const minifiedRelatedVips = sortedRelatedVips.map(item => deepExtractObjectStrapi(item, {
        minify: true,
        minifyFields: ['tags', 'meanings', 'examples', 'synonyms']
    }));

    const randomNRelatedVips = random
        ? minifiedRelatedVips.sort(() => 0.5 - Math.random()).slice(0, _.isInteger(n) && n > 0 ? n : 6)
        : minifiedRelatedVips.slice(0, _.isInteger(n) && n > 0 ? n : 6);

    return randomNRelatedVips;
}


const loadImage = async src =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (...args) => reject(args);
        img.src = src;
        img.crossOrigin = 'anonymous';
    });

const getImageData = image => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async imageUrl => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);

    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};


export const isInCheckedList = (checkedList, id) => {
    return checkedList.find(item => item.id === id && item.checked);
}

export const isCheckedAll = (data, checkedList) => {
    return data.every(item => isInCheckedList(checkedList, item.id));
}

export const getNumberOfSelected = (data, checkedList) => {
    return data.filter(item => isInCheckedList(checkedList, item.id)).length;
}
