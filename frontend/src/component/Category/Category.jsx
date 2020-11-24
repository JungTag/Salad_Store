import React from 'react';
import Mains from '../Mains';
import styles from './Category.module.css';

const Category = (props) => {
    const { optionRelation, main, option, categoryPk, name } = props;

    return (
        <div className={styles.container}>
            <div className="name">
                <h2>{name}</h2>
                <button onClick={props.onCatDel}>❌</button>
            </div>
            <div className="menus">
                <Mains
                    key={categoryPk}
                    optionRelation={optionRelation}
                    main={main}
                    option={option}
                    onMenAdd={props.handleMenuAdd}
                    onMenDel={props.handleMenuDelete}
                    onImgAdd={props.handleImageAdd}
                    onOptAdd={props.handleOptionAdd}
                    onOptDel={props.handleOptionDelete}
                />
            </div>
        </div>
    );
};

export default Category;