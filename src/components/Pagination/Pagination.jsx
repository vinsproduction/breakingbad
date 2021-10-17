import React, { useEffect, useState } from 'react';
import bemCn from 'bem-cn';
import * as constants from '../../constants';

import './Pagination.css';

const cn = bemCn('pagination');

export default function Pagination({
    className,
    current,
    totalItems,
    pagesLimit,
    onChangePage,
    onChangePagesLimit,
}) {
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const handleChange = (e) => {
        onChangePagesLimit(parseInt(e.target.value, 10));
    }

    const handlePrev = () => {
        const page = current - 1;
        onChangePage(page, current);
    }

    const handleNext = () => {
        const page = current + 1;
        onChangePage(page, current);
    }

    useEffect(() => {
        setShowNext(true);
        setShowPrev(true);

        if (current <= 1) {
            setShowPrev(false);
        }
        if (current + 1 > Math.round(totalItems / pagesLimit)) {
            setShowNext(false);
        }
    }, [current])

    return (
        <div className={cn({}).mix(className)}>
            <div className={cn('pages')}>
                {showPrev && (
                    <button className={cn('prev')} onClick={handlePrev}>
                        prev page
                    </button>
                )}
                <div className={cn('current')}>
                    <b>{current}</b> of {Math.round(totalItems / pagesLimit)}
                </div>
                {showNext && (
                    <button className={cn('next')} onClick={handleNext}>
                        next page
                    </button>
                )}
            </div>
            <div className={cn('limit')}>
                <span className={cn('limit-label')}>Limit per page:</span>
                <select className={cn('limit-select')} onChange={handleChange} value={pagesLimit}>
                    {[...new Set([constants.LIMIT_ITEMS, 5, 10, 15, 20, 25, 30])].map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
