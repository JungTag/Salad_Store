import React, { useState, useEffect } from 'react';
import api from '../../api/statisticAPI';
import styles from './AdminMain.module.css';

const AdminMain = () => {
    
    const getFormatDate = date => {
        var year = date.getFullYear();
        var month = (1 + date.getMonth());
        month = month >= 10 ? month : '0' + month;
        var day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    };

    const apiCall = async () => {
        const response = await api.getStat(startDate, endDate, null, null); // 안 넣을 때는 false X
        console.log(response.data.data);
        setData(response.data.data[response.data.data.length - 1]);
        return response.data.data[response.data.data.length - 1];
    };

    const [btnClicked, setBtnClicked] = useState("일간");
    const [startDate, setStartDate] = useState(getFormatDate(new Date()));
    const [endDate, setEndDate] = useState(getFormatDate(new Date()));
    const [data, setData] = useState({});

    const DAYTIME = 24 * 60 * 60 * 1000;
    const DateFilterData = [
        {
            id: 1,
            value: "일간",
        },
        {
            id: 2,
            value: "주간",
        },
        {
            id: 3,
            value: "월간",
        },
    ];

    // userEffect 안에 api 호출 후 setState하면 무한루프에 빠짐
    // 참고: https://one-it.tistory.com/entry/React%EC%9D%98-componentDidUpdate-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C-%EC%A3%BC%EC%9D%98%EC%A0%90-%EB%AC%B4%ED%95%9C%EB%A3%A8%ED%94%84

    useEffect(() => {
        const response = apiCall();
    }, []);

    useEffect(() => {
        const response = apiCall();
    }, [startDate, endDate]);

    const onChangeStart = e => {
        setStartDate(e.target.value)
    }
    const onChangeEnd = e => {
        setEndDate(e.target.value)
    }

    const handleBtnClicked = e => {
        const value = e.target.value;
        setBtnClicked(value);
        const currentDate = new Date();
        console.log(value);
        if (value === "일간") {
            setStartDate(getFormatDate(new Date()));
            setEndDate(getFormatDate(new Date()));
        }
        if (value === "주간") {
            let aWeekAgo = new Date(currentDate.getTime() - 7 * DAYTIME);
            setStartDate(getFormatDate(aWeekAgo));
            setEndDate(getFormatDate(new Date()));
        }
        if (value === "월간") {
            let aMonthAgo = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate()
            );
            setStartDate(getFormatDate(aMonthAgo));
            setEndDate(getFormatDate(new Date()));
        }
    };


    return (
        <>
            <div className={styles.aboutDate}>
                <div className={styles.dateFilterBtns}>
                    {DateFilterData.map((item, i) => (
                        <button className="{styles.dateInput}"
                            onClick={handleBtnClicked}
                            key={i}
                            backgroundColor={btnClicked === item.value}
                            value={item.value}
                        >{item.value}</button>
                    ))}
                </div>
                <div className={styles.dateInput}>
                    <input type='date' className={styles.startDate} name={"startDate"} onChange={onChangeStart}
                        value={startDate}></input>
                    <span> ~ </span>
                    <input type='date' className={styles.endDate} name={"endDate"} onChange={onChangeEnd}
                        value={endDate}></input>
                    {/* <span> </span>
            <button onClick={apiCall}>확인</button> */}
                </div>
            </div>
            <div>
                <p>
                    {startDate} ~ {endDate} <br />
          기간 동안의 매출액은 <br />
                    {data.매출}원입니다.
        </p>
            </div>
        </>
    );
};

export default AdminMain;