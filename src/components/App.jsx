import React, { useState, useEffect } from 'react';
import bemCn from 'bem-cn';
import Items from './Items/Items';
import Item from './Item/Item';
import Pagination from './Pagination/Pagination';
import Search from './Search/Search';
import * as api from '../api';
import * as constants from '../constants';

import './App.css';

const cn = bemCn('app');

export default function App() {
    const [fail, setFail] = useState(false);

    const [view, setView] = useState('items');
    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(constants.LOADING_DEFAULT);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesLimit, setPagesLimit] = useState(constants.LIMIT_ITEMS);

    const [filterName, setFilterName] = useState('');
    const [filterItems, setFilterItems] = useState([]);
    const [filterCurrentPage, setFilterCurrentPage] = useState(1);

    const [isOpenedSearch, setIsOpenedSearch] = useState(false);

    const getItems = async () => {
        const isSearch = !!filterName;

        setLoading(isSearch ? constants.LOADING_SEARCH : constants.LOADING_DEFAULT);
        setView('items');

        const limit = pagesLimit;
        const page = isSearch ? filterCurrentPage : currentPage;
        const offset = (page - 1) * limit;
        let newItems;

        if (isSearch && filterItems.length) {
            // Когда итемы поиска определены - вытаскиваем остальные по пагинации
            newItems = filterItems.slice(offset, offset + limit);

        } else if (isSearch) {
            try {
                // Для поиска сначала берем все найденные итемы
                newItems = await api.getItems(0, constants.TOTAL_ITEMS, filterName);
                setFilterItems(newItems);
                newItems = newItems.slice(0, limit);
            } catch (error) {
                setFail(true);
            }
        } else {
            try {
                newItems = await api.getItems(offset, limit);
            } catch (error) {
                setFail(true);
            }
        }

        if (newItems) {
            setItems(newItems);
            setLoading('');
        }
    }

    const getItemByID = async (id) => {
        setView('item');
        setLoading(constants.LOADING_DEFAULT);
        try {
            const [itemItem] = await api.getItemByID(id);
            setItem(itemItem);
        } catch (error) {
            setFail(true);
        }
        setLoading('');
    }

    const pageBack = () => {
        setView('items');
    }

    const filterChangePage = (page) => {
        setFilterCurrentPage(page);
    }

    const changePage = (page) => {;
        setCurrentPage(page);
    }

    const changePagesLimit = (limit) => {
        setPagesLimit(limit);
        // сбрасываем т.к пагинация должна перестроиться
        changePage(1);
    }

    const searchItems = (name) => {
        setFilterName(name);
    }

    const resetItems = () => {
        setFilterName('');
        setFilterItems([]);
        setFilterCurrentPage(1);
    }

    useEffect(() => {
        getItems();
    }, [pagesLimit, currentPage, filterCurrentPage, filterName]);

    const doLoader = (text) => <div className={cn('loader')}>{text}</div>;

    if (fail) {
        return (
            <div className={cn('status')}>
               Oooops....
            </div>
        )
    }

    const isSearch = !!filterName;

    return (
        <div className={cn()}>
            {view === 'item' && (
                <>
                    {loading && doLoader(loading)}
                    {!loading && (
                        <Item
                            {...item }
                            onBack={pageBack}
                        />
                    )}
                </>
            )}

            {view === 'items' && (
                <>
                    <div className={cn('search-expand')}>
                        <div className={cn('search-label')} onClick={() => setIsOpenedSearch(!isOpenedSearch) }>Search</div>
                        <div className={cn('search-content', { opened:  isOpenedSearch })}>
                            <Search
                                disabled={!!loading || isSearch}
                                status={!!isSearch}
                                onSearch={searchItems}
                                onReset={resetItems}
                            />
                        </div>
                    </div>
                    {loading && doLoader(loading)}
                    {!loading && (
                        <>
                            {!!items.length ? (
                                <>
                                    <Items
                                        items={items}
                                        onSelectItem={getItemByID}
                                    />
                                    <Pagination
                                        className={cn('pagination')}
                                        current={isSearch ? filterCurrentPage : currentPage}
                                        totalItems={isSearch ? filterItems.length : constants.TOTAL_ITEMS}
                                        pagesLimit={pagesLimit}
                                        onChangePage={isSearch ? filterChangePage : changePage}
                                        onChangePagesLimit={changePagesLimit}
                                    />
                                </>
                            ) : (
                                <div className={cn('status')}>
                                    {isSearch && 'No results were found for your search'}
                                    {!isSearch && 'No items'}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
