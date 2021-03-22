/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

const getStoredValue = (key, initialValue) => {
    const storedValue = JSON.parse(localStorage.getItem(key));
    if (storedValue) return storedValue;
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
};

const useForm = (key, initialValue = '') => {
    const [value, setValue] = useState(() => getStoredValue(key, initialValue));

    // persisting the value to localStorage
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};

export default useForm;