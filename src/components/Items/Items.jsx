import React from 'react';
import bemCn from 'bem-cn';

import './Items.css';

const cn = bemCn('items');

export default function Items({
    items,
    onSelectItem,
}) {
    const handleSelectItem = async (e, id) => {
        e.preventDefault();
        onSelectItem(id);
    }

    return (
        <div className={cn()}>
            <table className={cn('table')}>
                <thead>
                    <tr className={cn('row')}>
                        <td className={cn('col')}>ID</td>
                        <td className={cn('col', { type: 'name' })}>Name</td>
                        <td className={cn('col')}>Birthday</td>
                    </tr>
                </thead>
                <tbody>
                    {items.map(({ char_id, name, birthday }, i) => (
                        <tr key={char_id} className={cn('row')}>
                            <td className={cn('col')}>
                                {char_id}
                            </td>
                            <td className={cn('col', { type: 'name' })}>
                                <a href="#" onClick={e => handleSelectItem(e, char_id)}>
                                    {name}
                                </a>
                            </td>
                            <td className={cn('col')}>
                                {birthday}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
