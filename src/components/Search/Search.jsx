import React, { useRef, useState } from 'react';
import bemCn from 'bem-cn';

import './Search.css';

const cn = bemCn('search');

export default function Search({
    disabled,
    status,
    onSearch,
    onReset,
}) {
    const inputRef = useRef(null);
    const [value, setValue] = useState('');

    const handleChange = () => {
        if (inputRef.current) {
            setValue(inputRef.current.value)
        }
    }

    const handleSearch = () => {
        if (disabled || !value.trim()) {
            return;
        }
        onSearch(value);
    }

    const handleReset = () => {
        setValue('');

        if (status) {
            onReset();
        }
    }

    return (
        <div className={cn()}>
            <input
                className={cn('input', { disabled })}
                ref={inputRef}
                value={value}
                onChange={handleChange}
                type="text"
                placeholder="Find by name"
                disabled={disabled}
            />
            {!status && (
                <button className={cn('button')} onClick={handleSearch}>Search</button>
            )}
            {status && (
                <button className={cn('button')} onClick={handleReset}>Reset</button>
            )}
        </div>
    )
};
