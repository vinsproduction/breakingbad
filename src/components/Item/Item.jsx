import React from 'react';
import bemCn from 'bem-cn';

import './Item.css';

const cn = bemCn('item');

export default function Item({
    char_id,
    img,
    name,
    birthday,
    status,
    category,
    nickname,
    onBack,
}) {
    const handleBack = () => {
        onBack();
    }

    return (
        <div className={cn()}>
            <table className={cn('table')}>
                <thead>
                    <tr className={cn('row')}>
                        <td className={cn('col')}>ID</td>
                        <td className={cn('col')}>Img</td>
                        <td className={cn('col')}>Name</td>
                        <td className={cn('col')}>Birthday</td>
                        <td className={cn('col')}>Status</td>
                        <td className={cn('col')}>Nickname</td>
                        <td className={cn('col')}>Category</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className={cn('row')}>
                        <td className={cn('col')}>
                            {char_id}
                        </td>
                        <td className={cn('col')}>
                            <img src={img} alt="" className={cn('image')} />
                        </td>
                        <td className={cn('col')}>
                            {name}
                        </td>
                        <td className={cn('col')}>
                            {birthday}
                        </td>
                        <td className={cn('col')}>
                            {status}
                        </td>
                        <td className={cn('col')}>
                            {nickname}
                        </td>
                        <td className={cn('col')}>
                            {category}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={cn('footer')}>
                <button className={cn('back')} onClick={handleBack}>Go back</button>
            </div>
        </div>
    );
}
